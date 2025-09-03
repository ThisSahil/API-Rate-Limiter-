import express from "express";
import ApiKey from "../models/ApiKey.js";
import RequestLog from "../models/RequestLog.js";
import redisClient from "../config/redis.js";
import { ipBlockCheck } from "../middleware/ipBlockCheck.js";
import mongoose from "mongoose";

const router = express.Router();

/**
 * Helpers to build Redis keys
 */
const getMinuteKey = (apiKey) => {
  const now = new Date();
  const minute = `${now.getUTCFullYear()}${
    now.getUTCMonth() + 1
  }${now.getUTCDate()}${now.getUTCHours()}${now.getUTCMinutes()}`;
  return `rate:${apiKey}:minute:${minute}`;
};

const getDayKey = (apiKey) => {
  const now = new Date();
  const day = `${now.getUTCFullYear()}${
    now.getUTCMonth() + 1
  }${now.getUTCDate()}`;
  return `rate:${apiKey}:day:${day}`;
};

/**
 * POST /api/check-limit
 * Check if a request should be allowed
 */
router.post("/check-limit", ipBlockCheck, async (req, res) => {
  try {
    const { api_key, endpoint, ip_address } = req.body;
    if (!api_key) return res.status(400).json({ error: "API key required" });

    const apiKeyDoc = await ApiKey.findOne({
      key_value: api_key,
      is_active: true,
    });
    if (!apiKeyDoc) {
      return res.status(403).json({ error: "Invalid or inactive API key" });
    }

    const minuteKey = `rate:${api_key}:minute:${new Date()
      .toISOString()
      .slice(0, 16)}`;
    const dayKey = `rate:${api_key}:day:${new Date()
      .toISOString()
      .slice(0, 10)}`;

    const minuteCount = await redisClient.incr(minuteKey);
    const dayCount = await redisClient.incr(dayKey);

    if (minuteCount === 1) await redisClient.expire(minuteKey, 60);
    if (dayCount === 1) await redisClient.expire(dayKey, 24 * 60 * 60);

    if (minuteCount > apiKeyDoc.rate_limit_per_minute) {
      return res
        .status(429)
        .json({ allowed: false, reason: "Minute limit exceeded" });
    }
    if (dayCount > apiKeyDoc.daily_quota) {
      return res
        .status(429)
        .json({ allowed: false, reason: "Daily quota exceeded" });
    }

    const bucketKey = `bucket:${api_key}`;
    let tokens = await redisClient.get(bucketKey);

    if (tokens === null) {
      tokens = apiKeyDoc.rate_limit_per_minute;
      await redisClient.set(bucketKey, tokens, { EX: 60 });
    }

    tokens = parseInt(tokens);

    if (tokens <= 0) {
      return res
        .status(429)
        .json({ allowed: false, reason: "Burst limit exceeded" });
    }

    await redisClient.decr(bucketKey);

    if (
      endpoint &&
      apiKeyDoc.endpoint_limits &&
      apiKeyDoc.endpoint_limits.has(endpoint)
    ) {
      const endpointLimit = apiKeyDoc.endpoint_limits.get(endpoint);

      const endpointKey = `rate:${api_key}:${endpoint}:${new Date()
        .toISOString()
        .slice(0, 16)}`;
      const endpointCount = await redisClient.incr(endpointKey);

      if (endpointCount === 1) await redisClient.expire(endpointKey, 60);

      if (endpointCount > endpointLimit) {
        return res.status(429).json({
          allowed: false,
          reason: `Endpoint ${endpoint} limit exceeded`,
        });
      }
    }

    const slidingKey = `sliding:${api_key}`;
    const now = Date.now();
    const windowSize = 60 * 1000;

    await redisClient.zAdd(slidingKey, [
      { score: now, value: `${now}:${Math.random()}` },
    ]);
    await redisClient.zRemRangeByScore(slidingKey, 0, now - windowSize);

    const slidingCount = await redisClient.zCard(slidingKey);

    if (slidingCount > apiKeyDoc.rate_limit_per_minute) {
      return res
        .status(429)
        .json({ allowed: false, reason: "Sliding window limit exceeded" });
    }

    return res.json({ allowed: true });
  } catch (err) {
    console.error("check-limit error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/record-request
 */
router.post("/record-request", ipBlockCheck, async (req, res) => {
  try {
    const { api_key, endpoint, ip_address, was_allowed } = req.body;

    if (!api_key) return res.status(400).json({ error: "API key required" });

    const apiKeyDoc = await ApiKey.findOne({ key_value: api_key });
    if (!apiKeyDoc) {
      return res.status(403).json({ error: "Invalid API key" });
    }

    await RequestLog.create({
      api_key_id: apiKeyDoc._id,
      endpoint,
      ip_address,
      was_allowed: was_allowed !== false,
    });

    res.json({ message: "Request recorded" });
  } catch (err) {
    console.error("record-request error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/limits/:api_key
 * Get current usage for an API key
 */
router.get("/limits/:api_key", async (req, res) => {
  try {
    const { api_key } = req.params;

    const apiKeyDoc = await ApiKey.findOne({ key_value: api_key });
    if (!apiKeyDoc) {
      return res.status(404).json({ error: "API key not found" });
    }

    const minuteKey = getMinuteKey(api_key);
    const dayKey = getDayKey(api_key);

    const minuteCount = (await redisClient.get(minuteKey)) || 0;
    const dayCount = (await redisClient.get(dayKey)) || 0;

    res.json({
      app_name: apiKeyDoc.app_name,
      minute_usage: `${minuteCount}/${apiKeyDoc.rate_limit_per_minute}`,
      daily_usage: `${dayCount}/${apiKeyDoc.daily_quota}`,
    });
  } catch (err) {
    console.error("limits error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/usage/:api_key", async (req, res) => {
  try {
    const { api_key } = req.params;

    const apiKeyDoc = await ApiKey.findOne({ key_value: api_key });
    if (!apiKeyDoc) return res.status(404).json({ error: "API key not found" });

    const total = await RequestLog.countDocuments({
      api_key_id: apiKeyDoc._id,
    });
    const allowed = await RequestLog.countDocuments({
      api_key_id: apiKeyDoc._id,
      was_allowed: true,
    });
    const blocked = total - allowed;

    res.json({
      app_name: apiKeyDoc.app_name,
      total_requests: total,
      allowed_requests: allowed,
      blocked_requests: blocked,
    });
  } catch (err) {
    console.error("usage error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/violations", async (req, res) => {
  try {
    const violations = await RequestLog.find({ was_allowed: false }).populate(
      "api_key_id",
      "app_name key_value"
    );

    res.json(violations);
  } catch (err) {
    console.error("violations error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/health", async (req, res) => {
  try {
    const mongoStatus = mongoose.connection.readyState === 1 ? "up" : "down";
    const redisStatus = redisClient.isOpen ? "up" : "down";

    res.json({
      server: "up",
      mongo: mongoStatus,
      redis: redisStatus,
    });
  } catch (err) {
    console.error("health error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

import express from "express";
import BlockedIp from "../models/BlockedIp.js";
import redisClient from "../config/redis.js";

const router = express.Router();

router.post("/block-ip", async (req, res) => {
  try {
    const { ip_address, reason, duration_minutes } = req.body;

    if (!ip_address)
      return res.status(400).json({ error: "IP address required" });

    const duration = duration_minutes || 60; // default 1 hour
    const blockedUntil = new Date(Date.now() + duration * 60 * 1000);

    const blockedIp = await BlockedIp.findOneAndUpdate(
      { ip_address },
      { ip_address, blocked_until: blockedUntil, reason },
      { upsert: true, new: true }
    );

    const redisKey = `blocked:${ip_address}`;
    await redisClient.set(redisKey, "true", { EX: duration * 60 });

    res.json({
      message: `IP ${ip_address} blocked for ${duration} minutes`,
      blockedIp,
    });
  } catch (err) {
    console.error("block-ip error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/block-ip/:ip
 * Unblock an IP
 */
router.delete("/block-ip/:ip", async (req, res) => {
  try {
    const { ip } = req.params;

    await BlockedIp.deleteOne({ ip_address: ip });
    await redisClient.del(`blocked:${ip}`);

    res.json({ message: `IP ${ip} unblocked successfully` });
  } catch (err) {
    console.error("unblock-ip error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/blocked-ips
 * List all currently blocked IPs
 */
router.get("/blocked-ips", async (req, res) => {
  try {
    const now = new Date();
    const blockedIps = await BlockedIp.find({ blocked_until: { $gte: now } });
    res.json(blockedIps);
  } catch (err) {
    console.error("blocked-ips error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

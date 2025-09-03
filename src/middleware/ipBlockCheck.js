import redisClient from "../config/redis.js";

export const ipBlockCheck = async (req, res, next) => {
  try {
    const ip = req.body.ip_address || req.ip;

    if (!ip) {
      return res.status(400).json({ error: "IP address required" });
    }

    const blocked = await redisClient.get(`blocked:${ip}`);
    if (blocked) {
      return res.status(403).json({ allowed: false, reason: "IP blocked" });
    }

    next();
  } catch (err) {
    console.error("IP check error:", err);
    res.status(500).json({ error: err.message });
  }
};

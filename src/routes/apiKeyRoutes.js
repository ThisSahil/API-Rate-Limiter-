import express from "express";
import ApiKey from "../models/ApiKey.js";
import crypto from "crypto";

const router = express.Router();

// 🔹 Generate new API key
router.post("/keys", async (req, res) => {
  try {
    const { app_name, rate_limit_per_minute, daily_quota } = req.body;

    const key_value = crypto.randomBytes(16).toString("hex"); // random key

    const apiKey = await ApiKey.create({
      key_value,
      app_name,
      rate_limit_per_minute,
      daily_quota,
    });

    res.status(201).json(apiKey);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 List all API keys
router.get("/keys", async (req, res) => {
  try {
    const keys = await ApiKey.find();
    res.json(keys);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Update an API key
router.put("/keys/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const apiKey = await ApiKey.findByIdAndUpdate(id, updates, { new: true });

    if (!apiKey) return res.status(404).json({ error: "API Key not found" });

    res.json(apiKey);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Delete (revoke) an API key
router.delete("/keys/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const apiKey = await ApiKey.findByIdAndDelete(id);

    if (!apiKey) return res.status(404).json({ error: "API Key not found" });

    res.json({ message: "API Key revoked successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

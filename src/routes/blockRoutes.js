import express from "express";
const router = express.Router();

router.get("/blocked-ips", (req, res) => {
  res.json({ message: "Blocked IPs list placeholder" });
});

export default router;   // <--- REQUIRED

import mongoose from "mongoose";

const blockedIpSchema = new mongoose.Schema({
  ip_address: { type: String, required: true, unique: true },
  blocked_until: { type: Date, required: true },
  reason: { type: String },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("BlockedIp", blockedIpSchema);

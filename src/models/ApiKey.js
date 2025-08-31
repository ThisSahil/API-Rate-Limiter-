import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema({
  key_value: { type: String, unique: true, required: true },
  app_name: { type: String, required: true },
  rate_limit_per_minute: { type: Number, default: 1000 },
  daily_quota: { type: Number, default: 100000 },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("ApiKey", apiKeySchema);

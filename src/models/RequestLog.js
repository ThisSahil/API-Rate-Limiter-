import mongoose from "mongoose";

const requestLogSchema = new mongoose.Schema({
  api_key_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ApiKey",
    required: true,
  },
  endpoint: { type: String, required: true },
  ip_address: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  was_allowed: { type: Boolean, default: true },
});

export default mongoose.model("RequestLog", requestLogSchema);

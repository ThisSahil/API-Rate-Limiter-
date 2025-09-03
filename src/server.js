import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import redisClient from "./config/redis.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    await redisClient.connect();
    console.log("✅ Redis connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

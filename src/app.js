import express from "express";
import rateLimitRoutes from "./routes/rateLimitRoutes.js";
import apiKeyRoutes from "./routes/apiKeyRoutes.js";
import blockRoutes from "./routes/blockRoutes.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
// Routes
app.use("/api", rateLimitRoutes);
app.use("/api", apiKeyRoutes);
app.use("/api", blockRoutes);

export default app;

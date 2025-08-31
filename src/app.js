import express from "express";
import rateLimitRoutes from "./routes/rateLimitRoutes.js";
import apiKeyRoutes from "./routes/apiKeyRoutes.js";
import blockRoutes from "./routes/blockRoutes.js";

const app = express();
app.use(express.json());

// Routes
app.use("/api", rateLimitRoutes);
app.use("/api", apiKeyRoutes);
app.use("/api", blockRoutes);

export default app;

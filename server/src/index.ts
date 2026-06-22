import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import eventRoutes from "./routes/events";
import sessionRoutes from "./routes/sessions";
import heatmapRoutes from "./routes/heatmap";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();

const corsOrigins = process.env.CORS_ORIGIN?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const dashboardCors = cors({
  origin: corsOrigins && corsOrigins.length > 0 ? corsOrigins : true,
});

app.use(express.json());

// Tracker events endpoint must be accessible from any origin
app.use("/api/events", cors({ origin: "*" }), eventRoutes);

// Dashboard endpoints are restricted to configured client origins
app.use("/api/sessions", dashboardCors, sessionRoutes);
app.use("/api/heatmap", dashboardCors, heatmapRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

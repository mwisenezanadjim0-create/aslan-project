import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dashboardRoutes from "./routes/dashboard.js";
import authRoutes from "./routes/auth.js";
import "./utils/whatsapp.js"; // Initialize WhatsApp connection
import { logError, logInfo } from "./utils/logger.js";

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || 'https://yourdomain.com'
    : '*',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve API Routes
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, "../frontend")));

// Fallback to index.html for SPA-like behavior
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const maskedUri = process.env.MONGO_URI ? process.env.MONGO_URI.replace(/:([^@]+)@/, ":****@") : "UNDEFINED";
logInfo(`Attempting to connect to: ${maskedUri}`);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => logInfo("MongoDB connected ✅"))
  .catch(err => {
    logError("MongoDB Connection", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  logInfo(`Server running on port ${PORT} 🚀`);
  logInfo(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

import "./config/env.js"; // MUST BE FIRST
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import cors from "cors";
import fileUpload from "express-fileupload";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dashboardRoutes from "./routes/dashboard.js";
import authRoutes from "./routes/auth.js";
import momoRoutes from "./routes/momo.js";
import { connectToWhatsApp } from "./utils/whatsapp.js"; // Initialize WhatsApp connection
import { logError, logInfo } from "./utils/logger.js";
import reviewsRoutes from "./routes/reviews.js";
import bookingsRoutes from "./routes/bookings.js";
import productsRoutes from "./routes/products.js";

const app = express();

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// CORS Configuration
const corsOptions = {
  origin: true, // Reflect the request origin
  credentials: true,
  maxAge: 600, // Cache preflight for 10 minutes
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(fileUpload());

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    dbState: mongoose.connection.readyState,
    time: new Date()
  });
});

// Serve API Routes
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/momo", momoRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/products", productsRoutes);

// Serve Frontend Static Files
const frontendDist = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendDist));

// Fallback to index.html for SPA-like behavior
app.get(/^(?!\/api).*/, (req, res) => {
  const indexPath = path.join(frontendDist, "index.html");
  // Check if dist/index.html exists, if not fallback to the source index.html (useful for dev)
  res.sendFile(indexPath);
});

const maskedUri = process.env.MONGO_URI ? process.env.MONGO_URI.replace(/:([^@]+)@/, ":****@") : "UNDEFINED";
logInfo(`Attempting to connect to: ${maskedUri}`);

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000 // 5 seconds timeout
  })
  .then(() => logInfo("MongoDB connected ✅"))
  .catch(err => {
    logError("MongoDB Connection failed ❌", err);
    // Don't exit here, let health check show it's down
  });

// Global Error Handler
app.use((err, req, res, next) => {
  logError("UNHANDLED ERROR", err);
  res.status(500).json({ msg: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  logInfo(`Server running on port ${PORT} 🚀`);
  logInfo(`Environment: ${process.env.NODE_ENV || 'development'}`);
  connectToWhatsApp().catch(err => logError("WhatsApp Init", err));
});

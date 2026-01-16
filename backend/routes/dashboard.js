import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js";
import whatsappClient from "../utils/whatsapp.js";
import { logError, logInfo } from "../utils/logger.js";

import User from "../models/User.js";
import Stock from "../models/stock.js";
import Daily from "../models/Daily.js";
import Marketing from "../models/Marketing.js";
import Order from "../models/Order.js";

const router = express.Router();

const BOSS_NUMBER = process.env.BOSS_NUMBER || "250785975691";

/* ================= WHATSAPP HELPER ================= */
async function sendWhatsApp(message) {
  try {
    // Format number for whatsapp-web.js (e.g., 250785975691@c.us)
    const formattedNumber = BOSS_NUMBER.includes("@c.us") ? BOSS_NUMBER : `${BOSS_NUMBER}@c.us`;

    await whatsappClient.sendMessage(formattedNumber, message);
    logInfo(`WhatsApp message sent to ${BOSS_NUMBER}`);
  } catch (err) {
    logError("WhatsApp Send", err);
  }
}

const ALLOWED_EMAILS = [
  "mwisenezanadjim0@gmail.com",
  "admin@aslan.com",
  "boss@aslan.com",
  "manager@aslan.com",
  "chef@aslan.com"
];

/* ================= AUTH MIDDLEWARE ================= */
async function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ msg: "No token" });

  const token = header.split(" ")[1];
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ msg: "Invalid token" });

    // Extra security: Check if this user is still in the allowed list
    try {
      const user = await User.findById(decoded.id);
      if (!user || !ALLOWED_EMAILS.includes(user.email.toLowerCase())) {
        return res.status(403).json({ msg: "Access denied. Not authorized." });
      }
      req.userId = decoded.id;
      next();
    } catch (error) {
      res.status(500).json({ msg: "Security check error" });
    }
  });
}

/* ================= USER ================= */
router.get("/user", verifyToken, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
});

/* ================= SUMMARY ================= */
router.get("/summary", verifyToken, async (req, res) => {
  const stockCount = await Stock.countDocuments({ userId: req.userId });
  const dailyCount = await Daily.countDocuments({ userId: req.userId });
  const marketingCount = await Marketing.countDocuments({ userId: req.userId });
  res.json({ stockCount, dailyCount, marketingCount });
});

/* ================= STOCK ================= */
router.get("/stock", verifyToken, async (req, res) => {
  res.json(await Stock.find({ userId: req.userId }));
});

router.post("/stock", verifyToken, async (req, res) => {
  await Stock.create({ ...req.body, userId: req.userId });
  res.json({ msg: "Stock saved" });
});

router.delete("/stock/:id", verifyToken, async (req, res) => {
  await Stock.findByIdAndDelete(req.params.id);
  res.json({ msg: "Stock removed" });
});

/* ================= DAILY ================= */
router.get("/daily", verifyToken, async (req, res) => {
  res.json(await Daily.find({ userId: req.userId }));
});

router.post("/daily", verifyToken, async (req, res) => {
  try {
    const { date, amount } = req.body;
    if (!date || !amount) {
      return res.status(400).json({ msg: "Date and amount are required" });
    }

    await Daily.create({ ...req.body, userId: req.userId });

    // ✅ SEND FREE WHATSAPP REPORT
    const message =
      `📈 *DAILY PROGRESS REPORT*\n\n` +
      `*Date:* ${date}\n` +
      `*Amount:* ${amount.toLocaleString()} RWF\n\n` +
      `_Logged successfully via Aslan Dashboard_`;

    await sendWhatsApp(message);

    res.json({ msg: "Daily progress saved & boss notified via WhatsApp" });
  } catch (err) {
    logError("Daily report", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ================= MARKETING ================= */
router.get("/marketing", verifyToken, async (req, res) => {
  res.json(await Marketing.find({ userId: req.userId }));
});

router.post("/marketing", verifyToken, async (req, res) => {
  await Marketing.create({ ...req.body, userId: req.userId });
  res.json({ msg: "Marketing saved" });
});

/* ================= ORDERS ================= */
router.get("/orders", verifyToken, async (req, res) => {
  res.json(await Order.find({ userId: req.userId }));
});

router.post("/orders", verifyToken, async (req, res) => {
  try {
    const { date, foodType, amount, paymentType, orderType, userName, userPhone } = req.body;
    if (!date || !foodType || !amount || !paymentType || !orderType) {
      return res.status(400).json({ msg: "All fields required" });
    }

    await Order.create({
      userId: req.userId,
      date,
      foodType,
      amount,
      paymentType,
      orderType
    });

    // ✅ SEND FREE WHATSAPP ORDER NOTIFICATION
    const message =
      `📦 *NEW ORDER RECEIVED*\n\n` +
      `*Customer:* ${userName || 'N/A'}\n` +
      `*Phone:* ${userPhone || 'N/A'}\n` +
      `*Food:* ${foodType}\n` +
      `*Amount:* ${amount.toLocaleString()} RWF\n` +
      `*Payment:* ${paymentType.toUpperCase()}\n\n` +
      `_Please prepare the order!_`;

    await sendWhatsApp(message);

    res.json({ msg: "Order saved & boss notified via WhatsApp" });
  } catch (err) {
    logError("Order notification", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;

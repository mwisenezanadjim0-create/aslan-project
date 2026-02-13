import express from "express";
import Booking from "../models/Booking.js";
import whatsapp from "../utils/whatsapp.js";
import { logError, logInfo } from "../utils/logger.js";

const router = express.Router();

// Submit a new booking/inquiry
router.post("/submit", async (req, res) => {
    try {
        const { serviceType, customerName, customerPhone, date, time, guests, details } = req.body;

        const newBooking = new Booking({
            serviceType,
            customerName,
            customerPhone,
            date,
            time,
            guests,
            details
        });

        await newBooking.save();

        // Send WhatsApp Notification to Boss
        const bossNumber = process.env.BOSS_NUMBER;
        if (bossNumber) {
            const message = `🌟 *New ${serviceType} Request!* 🌟\n\n` +
                `👤 *Name:* ${customerName}\n` +
                `📞 *Phone:* ${customerPhone}\n` +
                `📅 *Date:* ${date}\n` +
                (time ? `⏰ *Time:* ${time}\n` : "") +
                (guests ? `👥 *Guests:* ${guests}\n` : "") +
                (details ? `📝 *Details:* ${details}\n` : "") +
                `\n_Please contact the customer to confirm._`;

            try {
                await whatsapp.sendMessage(bossNumber, message);
                logInfo(`WhatsApp alert sent for new ${serviceType}`);
            } catch (waErr) {
                logError("WhatsApp Alert Failed", waErr);
            }
        }

        res.status(201).json({ msg: "Request submitted successfully!", booking: newBooking });
    } catch (err) {
        logError("Booking Submission Error", err);
        res.status(500).json({ msg: "Failed to submit request" });
    }
});

// Get all bookings (for admin dashboard in future)
router.get("/all", async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

export default router;

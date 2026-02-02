import express from "express";
import momo from "../utils/momo.js";
import whatsapp from "../utils/whatsapp.js";
import { logError, logInfo } from "../utils/logger.js";

const router = express.Router();

// 1. Kick off the push
router.post("/pay", async (req, res) => {
    console.log(">>> RECEIVED PAY REQUEST", req.body);
    try {
        const { amount, phone } = req.body;
        console.log(`[DEBUG] MoMo Pay Request: Amount=${amount}, Phone=${phone}`);
        if (!amount || !phone) {
            return res.status(400).json({ msg: "Amount and Phone are required" });
        }

        const refId = await momo.requestToPay(amount, phone);
        res.json({ refId });
    } catch (error) {
        logError("MoMo Route Pay", error);
        res.status(500).json({ msg: error.message || "Failed to initiate MTN Push" });
    }
});

// 2. Poll for status
router.get("/status/:refId", async (req, res) => {
    try {
        const statusData = await momo.getTransactionStatus(req.params.refId);
        res.json(statusData);
    } catch (error) {
        res.status(500).json({ msg: "Failed to check payment status" });
    }
});

// 3. Verify via Screenshot (New Flow)
router.post("/verify-screenshot", async (req, res) => {
    try {
        if (!req.files || !req.files.screenshot) {
            return res.status(400).json({ msg: "No screenshot uploaded" });
        }

        const { customerName, orderName, amount, phone } = req.body;
        const screenshot = req.files.screenshot;
        const bossNumber = process.env.BOSS_NUMBER;

        if (!bossNumber) {
            return res.status(500).json({ msg: "Boss phone number not configured" });
        }

        const caption = `📸 *New Payment Proof Received*\n\n` +
            `👤 *Customer:* ${customerName}\n` +
            `📞 *Phone:* ${phone}\n` +
            `🍴 *Item:* ${orderName}\n` +
            `💵 *Amount:* ${Number(amount).toLocaleString()} RWF\n\n` +
            `_Please verify this screenshot manually!_`;

        await whatsapp.sendImage(bossNumber, screenshot.data, caption);

        logInfo(`Screenshot payment proof sent to boss for ${customerName}`);
        res.json({ msg: "Screenshot sent for verification!" });
    } catch (error) {
        logError("Screenshot Upload", error);
        const msg = error.message?.includes("WhatsApp") ? error.message : "Failed to send screenshot to Boss";
        res.status(500).json({ msg });
    }
});

export default router;

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

        const { customerName, orderName, amount, phone, orderId } = req.body;
        const screenshot = req.files.screenshot;
        const receipt = req.files.receipt;
        const bossNumber = process.env.BOSS_NUMBER;

        if (!bossNumber) {
            return res.status(500).json({ msg: "Boss phone number not configured" });
        }

        // 1. Send MoMo Screenshot (Proof)
        const proofCaption = `📸 *MOMO PROOF RECEIVED*\n\n` +
            `👤 *Customer:* ${customerName}\n` +
            `📞 *Phone:* ${phone}\n` +
            `💵 *Amount:* ${Number(amount).toLocaleString()} RWF\n\n` +
            `_Verifying proof for Order #ASL-${orderId}_`;

        await whatsapp.sendImage(bossNumber, screenshot.data, proofCaption);

        // 2. Send Digital Pro Receipt (Order Details)
        if (receipt) {
            const receiptCaption = `🧾 *ASLAN CAFÉ RECEIPT: #ASL-${orderId}*\n\n` +
                `🍴 *Items:* ${orderName}\n` +
                `💰 *Total:* ${Number(amount).toLocaleString()} RWF\n` +
                `👤 *Buyer:* ${customerName}\n\n` +
                `_Thank you for your order! Your meal is being prepared._`;

            // A. Send to Boss/Restaurant
            await whatsapp.sendImage(bossNumber, receipt.data, receiptCaption);

            // B. Send to Customer (Instant confirmation)
            let customerWA = phone.trim();
            if (customerWA.startsWith('0')) {
                customerWA = '250' + customerWA.substring(1);
            } else if (!customerWA.startsWith('250')) {
                customerWA = '250' + customerWA;
            }

            try {
                await whatsapp.sendImage(customerWA, receipt.data, receiptCaption);
                logInfo(`Receipt #${orderId} delivered to customer ${customerWA}`);
            } catch (waErr) {
                logError(`Delivery failed for customer ${customerWA}`, waErr);
                // We don't block the response if only the customer message fails
            }
        }

        logInfo(`Proof & Receipt for #${orderId} sent to boss for ${customerName}`);
        res.json({ msg: "Proof & Receipt sent for verification!" });
    } catch (error) {
        logError("Screenshot Upload", error);
        const msg = error.message?.includes("WhatsApp") ? error.message : "Failed to send screenshot to Boss";
        res.status(500).json({ msg });
    }
});

export default router;

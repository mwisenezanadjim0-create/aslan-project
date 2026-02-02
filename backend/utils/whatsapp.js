import {
    makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode-terminal';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';
import pino from 'pino';
import { logError, logInfo, logWarning } from "./logger.js";

let sock;

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info');
    const { version, isLatest } = await fetchLatestBaileysVersion();

    logInfo(`using WA v${version.join('.')}, isLatest: ${isLatest}`);

    sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false, // We will handle QR ourselves
        logger: pino({ level: 'silent' }),
        browser: ["Aslan System", "Chrome", "111.0.0.0"]
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            logInfo('--- NEW QR CODE GENERATED (BAILEYS) ---');
            qrcode.generate(qr, { small: true });

            const qrPath = path.join(process.cwd(), 'whatsapp-qr.png');
            await QRCode.toFile(qrPath, qr);
            logInfo(`✅ QR Code saved to: ${qrPath}`);
            logInfo('PLEASE OPEN THE FILE "whatsapp-qr.png" IN YOUR FOLDER TO SCAN IT.');
            logInfo('--------------------------------------');
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom) ?
                lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut : true;
            logWarning(`connection closed due to ${lastDisconnect.error}, reconnecting: ${shouldReconnect}`);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            logInfo('WhatsApp Client (Baileys) is ready! ✅');

            const qrPath = path.join(process.cwd(), 'whatsapp-qr.png');
            if (fs.existsSync(qrPath)) fs.unlinkSync(qrPath);

            // Test message to Boss
            const bossNumber = process.env.BOSS_NUMBER;
            if (!bossNumber) {
                logWarning("BOSS_NUMBER not set in .env - Setup message skipped");
                return;
            }
            try {
                const chatId = `${bossNumber}@s.whatsapp.net`;
                await sock.sendMessage(chatId, { text: "🚀 *Aslan System:* WhatsApp Connection Online (Baileys)!" });
                logInfo(`Test message sent to ${bossNumber}`);
            } catch (err) {
                logError("WhatsApp Startup Test Message", err);
            }
        }
    });

    return sock;
}

// Export initialization function
export { connectToWhatsApp };

export default {
    sendMessage: async (jid, text) => {
        if (!sock || !sock.user) throw new Error("WhatsApp is currently disconnected. Please scan the QR code.");

        let recipient = jid;
        if (!recipient.includes('@')) {
            recipient = `${recipient}@s.whatsapp.net`;
        } else if (recipient.endsWith('@c.us')) {
            recipient = recipient.replace('@c.us', '@s.whatsapp.net');
        }

        try {
            return await sock.sendMessage(recipient, { text });
        } catch (err) {
            logError("WA Message Send Failure", err);
            throw new Error("Failed to send WhatsApp message. Client might be offline.");
        }
    },
    sendImage: async (jid, buffer, caption = "") => {
        if (!sock || !sock.user) throw new Error("WhatsApp is currently disconnected. Please scan the QR code.");

        let recipient = jid;
        if (!recipient.includes('@')) {
            recipient = `${recipient}@s.whatsapp.net`;
        } else if (recipient.endsWith('@c.us')) {
            recipient = recipient.replace('@c.us', '@s.whatsapp.net');
        }

        try {
            return await sock.sendMessage(recipient, {
                image: buffer,
                caption: caption
            });
        } catch (err) {
            logError("WA Image Send Failure", err);
            throw new Error("Failed to send WhatsApp image. Client might be offline.");
        }
    }
};

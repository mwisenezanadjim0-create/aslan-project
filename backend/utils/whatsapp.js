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
            const bossNumber = process.env.BOSS_NUMBER || "250785975691";
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

// Initialize on import
connectToWhatsApp();

export default {
    sendMessage: async (jid, text) => {
        if (!sock) throw new Error("WhatsApp client not initialized");

        // Baileys uses @s.whatsapp.net for users and @g.us for groups
        // Ensure we strip @c.us (from old whatsapp-web.js logic) and append @s.whatsapp.net if missing
        let recipient = jid;
        if (!recipient.includes('@')) {
            recipient = `${recipient}@s.whatsapp.net`;
        } else if (recipient.endsWith('@c.us')) {
            recipient = recipient.replace('@c.us', '@s.whatsapp.net');
        }

        return sock.sendMessage(recipient, { text });
    }
};

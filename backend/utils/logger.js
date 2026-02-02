import fs from 'fs';
import path from 'path';

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

const logFile = path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`);

export function logError(context, error) {
    const timestamp = new Date().toISOString();
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : 'No stack trace available';

    const logMessage = `[${timestamp}] [ERROR] ${context}: ${message}\n${stack}\n\n`;

    // Log to console
    console.error(logMessage);

    // Log to file
    try {
        fs.appendFileSync(logFile, logMessage);
    } catch (e) {
        console.error("Failed to write to log file:", e);
    }
}

export function logInfo(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [INFO] ${message}\n`;

    console.log(logMessage);
    fs.appendFileSync(logFile, logMessage);
}

export function logWarning(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [WARNING] ${message}\n`;

    console.warn(logMessage);
    fs.appendFileSync(logFile, logMessage);
}

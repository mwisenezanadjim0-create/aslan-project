import { logWarning, logError } from "../utils/logger.js";

if (!process.env.JWT_SECRET) {
    if (process.env.NODE_ENV === "production") {
        logError("JWT CONFIG", new Error("CRITICAL: JWT_SECRET is missing in production environment!"));
        process.exit(1);
    } else {
        logWarning("JWT_SECRET is not defined. Using development fallback.");
    }
}

export const JWT_SECRET = process.env.JWT_SECRET || "aslan_dev_secret_key_2026";

import axios from "axios";
import { logError, logInfo } from "./logger.js";

const BASE_URL = "https://payments.paypack.rw/api";

/**
 * Get Paypack Access Token
 */
async function getAccessToken() {
    console.log("Paypack Auth Attempt:", {
        url: "https://payments.paypack.rw/api/auth/agents/authorize",
        id: process.env.PAYPACK_CLIENT_ID
    });
    try {
        const response = await axios.post("https://payments.paypack.rw/api/auth/agents/authorize", {
            client_id: process.env.PAYPACK_CLIENT_ID,
            client_secret: process.env.PAYPACK_CLIENT_SECRET
        });
        return response.data.access;
    } catch (error) {
        logError("Paypack Token Fetch", JSON.stringify(error.response?.data || error.message));
        throw error;
    }
}

/**
 * Initiate a Cash-in (MoMo Push)
 */
async function requestToPay(amount, phoneNumber) {
    try {
        const token = await getAccessToken();

        // Normalize phone: remove non-digits
        let cleanPhone = phoneNumber.replace(/\D/g, "");

        // If it's a local 078... number, common to use 25078...
        if (cleanPhone.startsWith("0")) {
            cleanPhone = "250" + cleanPhone.substring(1);
        }
        // If it starts with 78... but no 250, add it
        else if (cleanPhone.length === 9) {
            cleanPhone = "250" + cleanPhone;
        }

        const data = {
            amount: Number(amount),
            number: cleanPhone
        };

        logInfo(`Initiating Paypack Push for ${cleanPhone}: ${amount} RWF`);

        const response = await axios.post(`${BASE_URL}/transactions/cashin`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        // Paypack returns a ref (event_kind / ref)
        return response.data.ref;
    } catch (error) {
        const errorDetail = error.response?.data || error.message;
        logError("Paypack Cashin", JSON.stringify(errorDetail));
        throw new Error(errorDetail.message || "Paypack failed to initiate push");
    }
}

/**
 * Check transaction status
 */
async function getTransactionStatus(ref) {
    try {
        const token = await getAccessToken();
        // Paypack status endpoint
        const response = await axios.get(`${BASE_URL}/transactions/find/${ref}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // Map Paypack status to our frontend expectations (PENDING, SUCCESSFUL, FAILED)
        const paypackStatus = response.data.status?.toLowerCase();
        let status = "PENDING";

        if (paypackStatus === "successful") status = "SUCCESSFUL";
        else if (paypackStatus === "failed" || paypackStatus === "expired") status = "FAILED";

        return { status };
    } catch (error) {
        logError("Paypack Status Check", JSON.stringify(error.response?.data || error.message));
        throw error;
    }
}

export default {
    requestToPay,
    getTransactionStatus,
};

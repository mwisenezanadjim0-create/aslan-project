import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

const SUB_KEY = "1fed204f3f6e4ac9ba8bd7176a94db8f";
const BASE_URL = "https://sandbox.momodeveloper.mtn.com";

async function setupMomo() {
    try {
        console.log("🚀 Starting MTN MoMo Sandbox Setup...");

        // 1. Create API User ID (UUID)
        const apiUserId = uuidv4();
        console.log(`✅ Generated API User ID: ${apiUserId}`);

        // 2. Register API User
        await axios.post(
            `${BASE_URL}/v1_0/apiuser`,
            { providerCallbackHost: "aslan-cafe.com" }, // Dummy host for sandbox
            {
                headers: {
                    "X-Reference-Id": apiUserId,
                    "Ocp-Apim-Subscription-Key": SUB_KEY,
                },
            }
        );
        console.log("✅ API User registered with MTN.");

        // 3. Create API Key
        const response = await axios.post(
            `${BASE_URL}/v1_0/apiuser/${apiUserId}/apikey`,
            {},
            {
                headers: {
                    "Ocp-Apim-Subscription-Key": SUB_KEY,
                },
            }
        );
        const apiKey = response.data.apiKey;
        console.log(`✅ Generated API Secret Key: ${apiKey}`);

        // 4. Update .env file
        const envPath = "c:\\Users\\Admin\\Desktop\\aslan project\\backend\\.env";
        let envContent = fs.readFileSync(envPath, "utf8");

        // Remove old keys if they exist
        envContent = envContent.split("\n").filter(line =>
            !line.startsWith("MOMO_SUB_KEY") &&
            !line.startsWith("MOMO_API_USER") &&
            !line.startsWith("MOMO_API_KEY") &&
            !line.startsWith("MOMO_ENV")
        ).join("\n");

        // Add new keys
        const newKeys = `
MOMO_SUB_KEY=${SUB_KEY}
MOMO_API_USER=${apiUserId}
MOMO_API_KEY=${apiKey}
MOMO_ENV=sandbox
`;
        fs.writeFileSync(envPath, envContent + newKeys);
        console.log("\n🎊 DONE! Your .env file has been updated.");
        console.log("You can now test REAL MoMo push notifications on your site!");

    } catch (error) {
        console.error("❌ SETUP FAILED!");
        console.error(error.response?.data || error.message);
    }
}

setupMomo();

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") }); // Adjusted for config folder deeper in tree
// Wait, actually server.js is in backend/, and .env is in backend/.
// So from config/env.js, it's ../../.env. Wait.
// backend/
//   server.js
//   .env
//   config/
//     env.js

dotenv.config({ path: path.join(__dirname, "../.env") });
console.log("Environment variables loaded. JWT_SECRET exists:", !!process.env.JWT_SECRET);

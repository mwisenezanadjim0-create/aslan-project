import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../config/jwt.js";
import { logError, logInfo } from "../utils/logger.js";

const router = express.Router();

// 🔒 ALLOWED EMAILS ONLY
const ALLOWED_EMAILS = [
  "mwisenezanadjim0@gmail.com",
  "admin@aslan.com",
  "boss@aslan.com",
  "manager@aslan.com",
  "chef@aslan.com"
];

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { username, email: rawEmail, password } = req.body;
    const email = rawEmail.toLowerCase();

    if (!username || !email || !password)
      return res.status(400).json({ msg: "All fields required" });

    // Check if email is allowed
    if (!ALLOWED_EMAILS.includes(email.toLowerCase())) {
      return res.status(403).json({ msg: "This email is not authorized to create an account." });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Email exists" });

    const hashed = await bcrypt.hash(password, 10);

    // Assign role based on email
    let role = "staff";
    const lowerEmail = email.toLowerCase();
    if (lowerEmail === "boss@aslan.com") role = "boss";
    else if (lowerEmail === "manager@aslan.com") role = "manager";
    else if (lowerEmail === "admin@aslan.com") role = "admin";
    else if (lowerEmail === "mwisenezanadjim0@gmail.com") role = "admin";
    else if (lowerEmail === "chef@aslan.com") role = "chef";

    await User.create({ username, email, password: hashed, role });

    logInfo(`New user registered: ${email} with role: ${role}`);
    res.json({ msg: "Account created" });
  } catch (err) {
    logError("SIGNUP", err);
    res.status(500).json({ msg: "Server error" });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  const loginStart = Date.now();
  console.log("Login request received [START]");
  try {
    const { email: rawEmail, password } = req.body;
    const email = rawEmail.toLowerCase();

    if (!email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    console.log("Searching for user in database...");
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    console.log("User found. Comparing passwords...");

    // Check if email is in the allowed list
    if (!ALLOWED_EMAILS.includes(user.email.toLowerCase())) {
      console.log("User not authorized (email check):", email);
      return res.status(403).json({ msg: "You are not authorized to access the dashboard." });
    }

    const ok = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", ok);
    if (!ok) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    console.log("Generating token for user ID:", user._id);
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log(`Login successful. Total server time: ${Date.now() - loginStart}ms`);
    logInfo(`User logged in: ${email}`);
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role || "staff"
      }
    });

  } catch (err) {
    logError("LOGIN", err);
    res.status(500).json({ msg: "Server error" });
  }
});


export default router;

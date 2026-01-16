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
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ msg: "All fields required" });

    // Check if email is allowed
    if (!ALLOWED_EMAILS.includes(email.toLowerCase())) {
      return res.status(403).json({ msg: "This email is not authorized to create an account." });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Email exists" });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashed });

    logInfo(`New user registered: ${email}`);
    res.json({ msg: "Account created" });
  } catch (err) {
    logError("SIGNUP", err);
    res.status(500).json({ msg: "Server error" });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check if email is in the allowed list
    if (!ALLOWED_EMAILS.includes(user.email.toLowerCase())) {
      return res.status(403).json({ msg: "You are not authorized to access the dashboard." });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    logInfo(`User logged in: ${email}`);
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });

  } catch (err) {
    logError("LOGIN", err);
    res.status(500).json({ msg: "Server error" });
  }
});


export default router;

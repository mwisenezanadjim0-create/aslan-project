import jwt from "jsonwebtoken";
import User from "../models/User.js";

import { JWT_SECRET } from "../config/jwt.js";

const ALLOWED_EMAILS = [
  "mwisenezanadjim0@gmail.com",
  "admin@aslan.com",
  "boss@aslan.com",
  "manager@aslan.com",
  "chef@aslan.com"
];

export default async function (req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Session expired. Please login again." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if the user's email is authorized
    const user = await User.findById(decoded.id);
    if (!user || !ALLOWED_EMAILS.includes(user.email.toLowerCase())) {
      return res.status(403).json({ msg: "Access denied. You are not authorized." });
    }

    req.user = { id: decoded.id };
    req.userId = decoded.id; // consistency with some routes
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Session expired. Please login again." });
  }
}

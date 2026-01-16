import mongoose from "mongoose";

const dailySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: String,
  amount: Number
});

export default mongoose.model("Daily", dailySchema);

import mongoose from "mongoose";

const marketingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: String,
  cost: Number
});

export default mongoose.model("Marketing", marketingSchema);

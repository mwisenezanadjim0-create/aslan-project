import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  item: String,
  qty: Number
});

export default mongoose.model("Stock", stockSchema);

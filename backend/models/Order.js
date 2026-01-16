import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: String, required: true },
  foodType: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentType: { type: String, required: true },
  orderType: { type: String, required: true }, // delivery, pickup, etc.
});

export default mongoose.model("Order", orderSchema);

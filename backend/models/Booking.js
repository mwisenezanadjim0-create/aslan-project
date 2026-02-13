import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    serviceType: {
        type: String,
        required: true,
        enum: ["Reservation", "Catering", "Conference", "Event", "Inquiry"]
    },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String },
    guests: { type: Number },
    details: { type: String },
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Confirmed", "Cancelled"]
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Booking", bookingSchema);

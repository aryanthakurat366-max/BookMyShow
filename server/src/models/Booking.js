const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        show: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "show",
            required: true,
        },
        seats: {
            type: [Number],
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        razorpayOrderId: {
            type: String,
        },
        razorpayPaymentId: {
            type: String,
        },
    },
    { timestamps: true }
);

const Booking = mongoose.model("booking", bookingSchema);
module.exports = Booking;
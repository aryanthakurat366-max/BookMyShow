const Razorpay = require("razorpay");
const crypto = require("crypto");
const Show = require("../models/Show");
const Booking = require("../models/Booking");
const sendResponse = require("../utilis/response");
const sendBookingEmail = require("../utilis/sendEmail");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const { showId, seats } = req.body;

    if (!showId || !seats || seats.length === 0) {
      return sendResponse(res, 400, false, "Show and seats are required");
    }

    const show = await Show.findById(showId);

    if (!show) {
      return sendResponse(res, 404, false, "Show not found");
    }

    const alreadyBooked = seats.filter(s => show.bookedSeats.includes(s));
    if (alreadyBooked.length > 0) {
      return sendResponse(res, 400, false, `Seats already booked: ${alreadyBooked.join(', ')}`);
    }

    const totalAmount = seats.length * show.ticketPrice;

    const order = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    const newBooking = new Booking({
      user: req.user.id,
      show: showId,
      seats,
      totalAmount,
      paymentStatus: 'pending',
      razorpayOrderId: order.id,
    });

    await newBooking.save();

    return sendResponse(res, 200, true, "Order created", {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingId: newBooking._id,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return sendResponse(res, 400, false, `Failed to create order: ${error}`);
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return sendResponse(res, 400, false, "Payment verification failed");
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return sendResponse(res, 404, false, "Booking not found");
    }

    booking.paymentStatus = 'paid';
    booking.razorpayPaymentId = razorpay_payment_id;
    await booking.save();

    await Show.findByIdAndUpdate(booking.show, {
      $push: { bookedSeats: { $each: booking.seats } },
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate({ path: 'show', populate: [{ path: 'movie' }, { path: 'theatre' }] })
      .populate('user', 'email name');

    // booking confirm hote hi email bhej de
    if (populatedBooking.user?.email) {
      sendBookingEmail(populatedBooking.user.email, populatedBooking);
    }

    return sendResponse(res, 200, true, "Payment verified, booking confirmed", populatedBooking);
  } catch (error) {
    return sendResponse(res, 400, false, `Payment verification failed: ${error}`);
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id, paymentStatus: 'paid' })
      .populate({ path: 'show', populate: [{ path: 'movie' }, { path: 'theatre' }] })
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, "Bookings fetched successfully", bookings);
  } catch (error) {
    return sendResponse(res, 400, false, `Failed to fetch bookings: ${error}`);
  }
};

module.exports = { createOrder, verifyPayment, getMyBookings };
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendBookingEmail = async (toEmail, booking) => {
    try {
        const seats = booking.seats.join(', ');
        const movieName = booking.show?.movie?.title || 'Movie';
        const theatreName = booking.show?.theatre?.name || 'Theatre';
        const showTime = booking.show?.time || '';

        const mailOptions = {
            from: `"BookMyShow" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: `Booking Confirmed - ${movieName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <div style="background: #e50914; padding: 16px; color: white;">
                        <h2 style="margin: 0;">Booking Confirmed 🎬</h2>
                    </div>
                    <div style="padding: 20px;">
                        <h3>${movieName}</h3>
                        <p><strong>Theatre:</strong> ${theatreName}</p>
                        <p><strong>Time:</strong> ${showTime}</p>
                        <p><strong>Seats:</strong> ${seats}</p>
                        <p><strong>Total Paid:</strong> ₹${booking.totalAmount}</p>
                        <p><strong>Booking ID:</strong> ${booking._id}</p>
                        <hr style="margin: 20px 0;" />
                        <p style="color: #888; font-size: 13px;">Thank you for booking with BookMyShow. Enjoy your movie!</p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Booking email sent to", toEmail);
    } catch (error) {
        console.error("Failed to send booking email:", error);
    }
};

module.exports = sendBookingEmail;
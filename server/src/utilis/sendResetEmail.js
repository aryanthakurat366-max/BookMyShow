const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendResetEmail = async (toEmail, resetLink) => {
    try {
        const mailOptions = {
            from: `"BookMyShow" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: "Reset Your Password - BookMyShow",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <div style="background: #e50914; padding: 16px; color: white;">
                        <h2 style="margin: 0;">Password Reset Request</h2>
                    </div>
                    <div style="padding: 20px;">
                        <p>You requested to reset your password. Click the button below to set a new password. This link is valid for 15 minutes.</p>
                        <a href="${resetLink}" style="display: inline-block; margin-top: 12px; padding: 10px 24px; background: #e50914; color: white; text-decoration: none; border-radius: 6px;">Reset Password</a>
                        <p style="margin-top: 20px; color: #888; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Reset email sent to", toEmail);
    } catch (error) {
        console.error("Failed to send reset email:", error);
    }
};

module.exports = sendResetEmail;
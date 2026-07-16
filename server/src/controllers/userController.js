const crypto = require('crypto');
const User = require('../models/User');
const sendResponse = require('../utilis/response');
const { generateToken } = require('../utilis/jwt');
const sendResetEmail = require('../utilis/sendResetEmail');

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return sendResponse(res, 400, false, 'Name, email and password are required');
        }

        // Security: sirf 'user' ya 'partner' hi self-register kar sakte hain, admin/owner nahi
        const allowedRoles = ['user', 'partner'];
        const finalRole = allowedRoles.includes(role) ? role : 'user';

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendResponse(res, 400, false, 'User already exists with this email');
        }

        const newUser = new User({ name, email, password, role: finalRole });
        await newUser.save();

        return sendResponse(res, 201, true, 'User registered successfully', {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        });
    } catch (error) {
        return sendResponse(res, 500, false, `Registration failed with error ${error}`);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req?.body;

        const validateUser = await User.findOne({ email: email });

        if (!validateUser) {
            return sendResponse(res, 404, false, 'user does not exists, please register');
        }

        const validatePassword = await validateUser.comparePassword(password);

        if (!validatePassword) {
            return sendResponse(res, 400, false, 'Invalid credentials');
        }

        const token = generateToken({ id: validateUser._id, role: validateUser.role });

        return sendResponse(res, 200, true, 'Login successful', {
            id: validateUser._id,
            name: validateUser.name,
            email: validateUser.email,
            role: validateUser.role,
            token: token
        });

    } catch (error) {
        return sendResponse(res, 500, false, `Login failed with error ${error}`);
    }
};

const currentUser = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return sendResponse(res, 400, false, 'User ID is required');
        }

        const user = await User.findById(userId);

        if (!user) {
            return sendResponse(res, 404, false, 'User not found');
        }

        return sendResponse(res, 200, true, 'User fetched successfully', user);

    } catch (error) {
        return sendResponse(res, 500, false, `Failed to fetch user with error ${error}`);
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return sendResponse(res, 404, false, 'No user found with this email');
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
        await sendResetEmail(user.email, resetLink);

        return sendResponse(res, 200, true, 'Password reset link sent to your email');
    } catch (error) {
        return sendResponse(res, 500, false, `Failed to process request: ${error}`);
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return sendResponse(res, 400, false, 'Invalid or expired reset link');
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        return sendResponse(res, 200, true, 'Password reset successful. Please login.');
    } catch (error) {
        return sendResponse(res, 500, false, `Failed to reset password: ${error}`);
    }
};

module.exports = { register, login, currentUser, forgotPassword, resetPassword };
const { verifyToken } = require('../utilis/jwt');
const sendResponse = require('../utilis/response');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return sendResponse(res, 401, false, 'No token provided, access denied');
        }

        const token = authHeader.split(' ')[1];

        const decoded = verifyToken(token);
        req.user = decoded;

        next();
    } catch (error) {
        return sendResponse(res, 401, false, 'Invalid or expired token');
    }
};

module.exports = authMiddleware;
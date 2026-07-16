const sendResponse = require('../utilis/response');

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return sendResponse(res, 403, false, 'Access denied: Admins only');
  }
  next();
};

const adminOrPartner = (req, res, next) => {
  const allowedRoles = ['admin', 'partner', 'owner'];
  if (!allowedRoles.includes(req.user?.role)) {
    return sendResponse(res, 403, false, 'Access denied: Admins or Partners only');
  }
  next();
};

const ownerOnly = (req, res, next) => {
  if (req.user?.role !== 'owner') {
    return sendResponse(res, 403, false, 'Access denied: Owners only');
  }
  next();
};

module.exports = { adminOnly, adminOrPartner, ownerOnly };
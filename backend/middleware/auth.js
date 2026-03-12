const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protectAdmin = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'titas_secret_key');

            const admin = await Admin.findById(decoded.id).select('-password');

            if (!admin) {
                return res.status(401).json({ success: false, message: 'Not authorized as an admin' });
            }

            req.admin = admin;
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ success: false, message: 'Token expired, please login again' });
            }
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ success: false, message: 'Not authorized, no token present' });
    }
};

const requireRoles = (...roles) => {
    const allowed = new Set(roles.map((role) => String(role || '').trim()).filter(Boolean));

    return (req, res, next) => {
        const currentRole = req?.admin?.role;
        if (!currentRole || !allowed.has(currentRole)) {
            return res.status(403).json({ success: false, message: 'Access denied: insufficient role permissions' });
        }

        return next();
    };
};

module.exports = { protectAdmin, requireRoles };

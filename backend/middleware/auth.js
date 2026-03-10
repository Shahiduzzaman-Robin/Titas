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
            console.error('Auth Error:', error);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ success: false, message: 'Not authorized, no token present' });
    }
};

module.exports = { protectAdmin };

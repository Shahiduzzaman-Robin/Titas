const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { submitMessage, getMessages, getUnreadCount, updateMessageStatus } = require('../controllers/contactController');

// Middleware for protecting Admin routes
const protectAdmin = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'titas_secret_key');
            req.admin = await Admin.findById(decoded.id).select('-password');
            if (!req.admin) {
                return res.status(401).json({ msg: 'Not authorized as an admin' });
            }
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ msg: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ msg: 'Not authorized, no token' });
    }
};

// Define routes
router.post('/', submitMessage);
router.get('/unread', protectAdmin, getUnreadCount);
router.get('/', protectAdmin, getMessages);
router.put('/:id/status', protectAdmin, updateMessageStatus);

module.exports = router;

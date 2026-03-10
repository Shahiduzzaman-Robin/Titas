const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const {
    getNotices,
    getAllNotices,
    createNotice,
    updateNotice,
    deleteNotice
} = require('../controllers/noticeController');

// Middleware for protecting Admin routes
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
            console.error(error);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ success: false, message: 'Not authorized, no token present' });
    }
};

// Public route for frontend ticker
router.get('/', getNotices);

// Protected Admin Routes
router.get('/all', protectAdmin, getAllNotices);
router.post('/', protectAdmin, createNotice);
router.put('/:id', protectAdmin, updateNotice);
router.delete('/:id', protectAdmin, deleteNotice);

module.exports = router;

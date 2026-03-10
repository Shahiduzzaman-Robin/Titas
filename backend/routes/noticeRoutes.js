const express = require('express');
const router = express.Router();
const {
    getNotices,
    getAllNotices,
    createNotice,
    updateNotice,
    deleteNotice
} = require('../controllers/noticeController');

const { protectAdmin, requireRoles } = require('../middleware/auth');
const allowContentAdmin = requireRoles('Super Admin', 'Admin', 'Content Admin');

// Public route for frontend ticker
router.get('/', getNotices);

// Protected Admin Routes
router.get('/all', protectAdmin, allowContentAdmin, getAllNotices);
router.post('/', protectAdmin, allowContentAdmin, createNotice);
router.put('/:id', protectAdmin, allowContentAdmin, updateNotice);
router.delete('/:id', protectAdmin, allowContentAdmin, deleteNotice);

module.exports = router;

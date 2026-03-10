const express = require('express');
const router = express.Router();
const {
    getNotices,
    getAllNotices,
    createNotice,
    updateNotice,
    deleteNotice
} = require('../controllers/noticeController');

const { protectAdmin } = require('../middleware/auth');

// Public route for frontend ticker
router.get('/', getNotices);

// Protected Admin Routes
router.get('/all', protectAdmin, getAllNotices);
router.post('/', protectAdmin, createNotice);
router.put('/:id', protectAdmin, updateNotice);
router.delete('/:id', protectAdmin, deleteNotice);

module.exports = router;

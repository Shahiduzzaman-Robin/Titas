const express = require('express');
const router = express.Router();
const { protectAdmin, requireRoles } = require('../middleware/auth');
const allowContentAdmin = requireRoles('Super Admin', 'Admin', 'Content Admin');
const {
    getEvents,
    getAllEvents,
    createEvent,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController');

// Public Route
router.get('/', getEvents);

// Admin Routes
router.get('/all', protectAdmin, allowContentAdmin, getAllEvents);
router.post('/', protectAdmin, allowContentAdmin, createEvent);
router.put('/:id', protectAdmin, allowContentAdmin, updateEvent);
router.delete('/:id', protectAdmin, allowContentAdmin, deleteEvent);

module.exports = router;

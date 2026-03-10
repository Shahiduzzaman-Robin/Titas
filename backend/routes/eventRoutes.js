const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/auth');
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
router.get('/all', protectAdmin, getAllEvents);
router.post('/', protectAdmin, createEvent);
router.put('/:id', protectAdmin, updateEvent);
router.delete('/:id', protectAdmin, deleteEvent);

module.exports = router;

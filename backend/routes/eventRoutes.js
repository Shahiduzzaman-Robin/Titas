const express = require('express');
const router = express.Router();
const { protectAdmin, requireRoles } = require('../middleware/auth');
const allowContentAdmin = requireRoles('Super Admin', 'Admin', 'Content Admin');
const {
    getEvents,
    getAllEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    submitRsvp,
    getEventRsvps,
    updateRsvpAttendance,
} = require('../controllers/eventController');

// Public Route
router.get('/', getEvents);
router.post('/:id/rsvp', submitRsvp);

// Admin Routes
router.get('/all', protectAdmin, allowContentAdmin, getAllEvents);
router.post('/', protectAdmin, allowContentAdmin, createEvent);
router.put('/:id', protectAdmin, allowContentAdmin, updateEvent);
router.delete('/:id', protectAdmin, allowContentAdmin, deleteEvent);
router.get('/:id/rsvps', protectAdmin, allowContentAdmin, getEventRsvps);
router.patch('/:id/rsvps/:rsvpId/attendance', protectAdmin, allowContentAdmin, updateRsvpAttendance);

module.exports = router;

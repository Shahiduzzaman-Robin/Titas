const Event = require('../models/Event');

// @desc    Get all upcoming events (Public)
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
    try {
        // Find events where date is greater than or equal to yesterday (to show today's events)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const events = await Event.find({ date: { $gte: yesterday } }).sort({ date: 1 });
        res.status(200).json({ success: true, count: events.length, data: events });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all events (Admin)
// @route   GET /api/events/all
// @access  Private/Admin
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: -1 });
        res.status(200).json({ success: true, count: events.length, data: events });
    } catch (error) {
        console.error('Error fetching all events:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create a new event (Admin)
// @route   POST /api/events
// @access  Private/Admin
exports.createEvent = async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json({ success: true, data: event });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update an event (Admin)
// @route   PUT /api/events/:id
// @access  Private/Admin
exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        res.status(200).json({ success: true, data: event });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete an event (Admin)
// @route   DELETE /api/events/:id
// @access  Private/Admin
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

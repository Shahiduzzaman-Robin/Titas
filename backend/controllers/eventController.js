const Event = require('../models/Event');
const { logAdminAction } = require('../utils/auditLogger');

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
        await logAdminAction(req, {
            module: 'events',
            action: 'publish_content',
            targetType: 'event',
            targetId: event._id,
            targetLabel: event.title || event.name || 'Untitled Event',
            description: `Published event "${event.title || event.name || 'Untitled Event'}"`,
            details: {
                date: event.date,
                location: event.location,
            },
        });
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
        const existingEvent = await Event.findById(req.params.id);
        if (!existingEvent) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        await logAdminAction(req, {
            module: 'events',
            action: 'update_content',
            targetType: 'event',
            targetId: event._id,
            targetLabel: event.title || event.name || 'Untitled Event',
            description: `Updated event "${event.title || event.name || 'Untitled Event'}"`,
            details: {
                before: {
                    title: existingEvent.title,
                    date: existingEvent.date,
                    location: existingEvent.location,
                },
                after: {
                    title: event.title,
                    date: event.date,
                    location: event.location,
                },
            },
        });

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

        await logAdminAction(req, {
            module: 'events',
            action: 'remove_content',
            targetType: 'event',
            targetId: event._id,
            targetLabel: event.title || event.name || 'Untitled Event',
            description: `Removed event "${event.title || event.name || 'Untitled Event'}"`,
            details: {
                date: event.date,
                location: event.location,
            },
        });

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

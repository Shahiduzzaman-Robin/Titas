const Event = require('../models/Event');
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
const { logAdminAction } = require('../utils/auditLogger');

const normalizeEmail = (value = '') => String(value || '').trim().toLowerCase();
const normalizePhone = (value = '') => String(value || '').trim();

const getStudentFromAuthorization = async (authHeader = '') => {
    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.split(' ')[1];
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'titas_secret_key');
        if (!decoded?.id) return null;
        return await Student.findById(decoded.id).select('nameBn nameEn email mobile department session status');
    } catch (error) {
        return null;
    }
};

const withRsvpSummary = (eventDoc) => {
    const rsvps = Array.isArray(eventDoc.rsvps) ? eventDoc.rsvps : [];
    const going = rsvps.filter((item) => item.response === 'going').length;
    const notGoing = rsvps.filter((item) => item.response === 'not_going').length;
    const checkedIn = rsvps.filter((item) => item.attendanceStatus === 'checked_in').length;
    const absent = rsvps.filter((item) => item.attendanceStatus === 'absent').length;

    return {
        ...eventDoc,
        rsvpSummary: {
            total: rsvps.length,
            going,
            notGoing,
            checkedIn,
            absent,
            capacity: Number(eventDoc.capacity || 0),
            seatsLeft: Number(eventDoc.capacity || 0) > 0 ? Math.max(0, Number(eventDoc.capacity || 0) - going) : null,
        },
    };
};

// @desc    Get all upcoming events (Public)
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
    try {
        // Find events where date is greater than or equal to yesterday (to show today's events)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const events = await Event.find({ date: { $gte: yesterday } }).sort({ date: 1 }).lean();
        const data = events.map(withRsvpSummary);
        res.status(200).json({ success: true, count: data.length, data });
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
        const events = await Event.find().sort({ date: -1 }).lean();
        const data = events.map(withRsvpSummary);
        res.status(200).json({ success: true, count: data.length, data });
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

// @desc    Submit or update an RSVP for an event (Public)
// @route   POST /api/events/:id/rsvp
// @access  Public
exports.submitRsvp = async (req, res) => {
    try {
        const student = await getStudentFromAuthorization(req.headers.authorization || '');

        const fullName = student
            ? String(student.nameBn || student.nameEn || '').trim()
            : String(req.body.fullName || '').trim();
        const email = student
            ? normalizeEmail(student.email)
            : normalizeEmail(req.body.email);
        const phone = student
            ? normalizePhone(student.mobile)
            : normalizePhone(req.body.phone);
        const department = student
            ? String(student.department || '').trim()
            : String(req.body.department || '').trim();
        const session = student
            ? String(student.session || '').trim()
            : String(req.body.session || '').trim();
        const response = req.body.response === 'not_going' ? 'not_going' : 'going';

        if (!fullName) {
            return res.status(400).json({ success: false, message: 'Full name is required.' });
        }
        if (!email && !phone) {
            return res.status(400).json({ success: false, message: 'Provide at least email or phone.' });
        }

        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found.' });
        }
        if (!event.rsvpEnabled) {
            return res.status(400).json({ success: false, message: 'Registration is disabled for this event.' });
        }
        if (event.rsvpDeadline && new Date(event.rsvpDeadline) < new Date()) {
            return res.status(400).json({ success: false, message: 'Registration deadline has passed.' });
        }

        const existingIndex = event.rsvps.findIndex((item) => {
            const sameEmail = email && item.email && normalizeEmail(item.email) === email;
            const samePhone = phone && item.phone && normalizePhone(item.phone) === phone;
            return sameEmail || samePhone;
        });

        const isNewGoing = response === 'going' && existingIndex === -1;
        const isSwitchToGoing =
            response === 'going' &&
            existingIndex >= 0 &&
            event.rsvps[existingIndex].response !== 'going';

        if (Number(event.capacity || 0) > 0 && (isNewGoing || isSwitchToGoing)) {
            const goingCount = event.rsvps.filter((item) => item.response === 'going').length;
            if (goingCount >= Number(event.capacity || 0)) {
                return res.status(409).json({ success: false, message: 'Event capacity is full.' });
            }
        }

        if (existingIndex >= 0) {
            event.rsvps[existingIndex].fullName = fullName;
            event.rsvps[existingIndex].email = email;
            event.rsvps[existingIndex].phone = phone;
            event.rsvps[existingIndex].department = department;
            event.rsvps[existingIndex].session = session;
            event.rsvps[existingIndex].response = response;

            if (response !== 'going') {
                event.rsvps[existingIndex].attendanceStatus = 'pending';
                event.rsvps[existingIndex].checkedInAt = null;
            }
        } else {
            event.rsvps.push({
                fullName,
                email,
                phone,
                department,
                session,
                response,
            });
        }

        await event.save();

        const updated = withRsvpSummary(event.toObject());
        const current = updated.rsvps.find((item) =>
            (email && item.email === email) || (phone && item.phone === phone)
        );

        return res.status(200).json({
            success: true,
            message: existingIndex >= 0 ? 'Registration updated successfully.' : 'Registration submitted successfully.',
            data: {
                eventId: event._id,
                source: student ? 'student_profile' : 'manual',
                rsvp: current || null,
                summary: updated.rsvpSummary,
            },
        });
    } catch (error) {
        console.error('Error submitting RSVP:', error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get RSVPs for an event (Admin)
// @route   GET /api/events/:id/rsvps
// @access  Private/Admin
exports.getEventRsvps = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).lean();
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found.' });
        }

        const withSummary = withRsvpSummary(event);
        const rsvps = [...(withSummary.rsvps || [])].sort((a, b) =>
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );

        return res.status(200).json({
            success: true,
            data: {
                event: {
                    _id: withSummary._id,
                    title: withSummary.title,
                    date: withSummary.date,
                    location: withSummary.location,
                    capacity: withSummary.capacity,
                    rsvpDeadline: withSummary.rsvpDeadline,
                    rsvpEnabled: withSummary.rsvpEnabled,
                },
                summary: withSummary.rsvpSummary,
                rsvps,
            },
        });
    } catch (error) {
        console.error('Error fetching event RSVPs:', error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update RSVP attendance status (Admin)
// @route   PATCH /api/events/:id/rsvps/:rsvpId/attendance
// @access  Private/Admin
exports.updateRsvpAttendance = async (req, res) => {
    try {
        const attendanceStatus = String(req.body.attendanceStatus || '').trim();
        if (!['pending', 'checked_in', 'absent'].includes(attendanceStatus)) {
            return res.status(400).json({ success: false, message: 'Invalid attendance status.' });
        }

        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found.' });
        }

        const rsvp = event.rsvps.id(req.params.rsvpId);
        if (!rsvp) {
            return res.status(404).json({ success: false, message: 'RSVP not found.' });
        }

        rsvp.attendanceStatus = attendanceStatus;
        rsvp.checkedInAt = attendanceStatus === 'checked_in' ? new Date() : null;
        await event.save();

        await logAdminAction(req, {
            module: 'events',
            action: 'update_content',
            targetType: 'event_rsvp',
            targetId: rsvp._id,
            targetLabel: `${rsvp.fullName} - ${event.title}`,
            description: `Updated attendance status to ${attendanceStatus} for ${rsvp.fullName}`,
            details: {
                eventId: event._id,
                eventTitle: event.title,
                attendanceStatus,
            },
        });

        return res.status(200).json({
            success: true,
            message: 'Attendance updated successfully.',
            data: {
                rsvpId: rsvp._id,
                attendanceStatus: rsvp.attendanceStatus,
                checkedInAt: rsvp.checkedInAt,
            },
        });
    } catch (error) {
        console.error('Error updating attendance status:', error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

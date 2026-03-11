const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 120,
    },
    phone: {
        type: String,
        trim: true,
        maxlength: 30,
    },
    department: {
        type: String,
        trim: true,
        maxlength: 120,
    },
    session: {
        type: String,
        trim: true,
        maxlength: 30,
    },
    response: {
        type: String,
        enum: ['going', 'not_going'],
        default: 'going',
    },
    attendanceStatus: {
        type: String,
        enum: ['pending', 'checked_in', 'absent'],
        default: 'pending',
    },
    checkedInAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    link: {
        type: String
    },
    rsvpEnabled: {
        type: Boolean,
        default: true,
    },
    capacity: {
        type: Number,
        default: 0,
        min: 0,
    },
    rsvpDeadline: {
        type: Date,
        default: null,
    },
    rsvps: {
        type: [rsvpSchema],
        default: [],
    },
    lastReminderSentOn: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);

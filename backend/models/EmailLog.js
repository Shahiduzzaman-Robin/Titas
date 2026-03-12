const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: [
            'registrationStatus',
            'profileEdit',
            'noticePublished',
            'eventReminders',
            'passwordReset',
            'loginAlerts',
        ],
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['sent', 'failed'],
        required: true,
        trim: true,
    },
    recipientEmail: {
        type: String,
        default: '',
        trim: true,
        lowercase: true,
    },
    subject: {
        type: String,
        default: '',
        trim: true,
    },
    sentAt: {
        type: Date,
        default: Date.now,
        index: true,
    },
    failureReason: {
        type: String,
        default: '',
        trim: true,
    },
}, { timestamps: true });

emailLogSchema.index({ category: 1, sentAt: -1 });
emailLogSchema.index({ status: 1, sentAt: -1 });

module.exports = mongoose.model('EmailLog', emailLogSchema);
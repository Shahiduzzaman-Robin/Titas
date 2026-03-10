const mongoose = require('mongoose');

const notificationSettingsSchema = new mongoose.Schema({
    key: {
        type: String,
        default: 'default',
        unique: true,
        trim: true,
    },
    settings: {
        registrationStatus: { type: Boolean, default: true },
        profileEdit: { type: Boolean, default: true },
        noticePublished: { type: Boolean, default: true },
        eventReminders: { type: Boolean, default: true },
        passwordReset: { type: Boolean, default: true },
        loginAlerts: { type: Boolean, default: true },
    },
    updatedBy: {
        type: String,
        default: '',
        trim: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('NotificationSettings', notificationSettingsSchema);
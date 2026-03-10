const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null,
    },
    adminUsername: {
        type: String,
        required: true,
        trim: true,
    },
    module: {
        type: String,
        required: true,
        trim: true,
    },
    action: {
        type: String,
        required: true,
        trim: true,
    },
    targetType: {
        type: String,
        required: true,
        trim: true,
    },
    targetId: {
        type: String,
        default: '',
        trim: true,
    },
    targetLabel: {
        type: String,
        default: '',
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    ipAddress: {
        type: String,
        default: '',
    },
    userAgent: {
        type: String,
        default: '',
    },
}, { timestamps: true });

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ module: 1, action: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
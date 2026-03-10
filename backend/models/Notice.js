const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    link: {
        type: String,
        trim: true,
        default: ''
    },
    priority: {
        type: String,
        enum: ['normal', 'urgent', 'new'],
        default: 'normal'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);

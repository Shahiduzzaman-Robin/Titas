const mongoose = require('mongoose');

const profileEditSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    changes: {
        type: Map,
        of: {
            oldValue: mongoose.Schema.Types.Mixed,
            newValue: mongoose.Schema.Types.Mixed
        }
    },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    submittedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
    reviewedBy: { type: String } // admin username
}, { timestamps: true });

module.exports = mongoose.model('ProfileEdit', profileEditSchema);

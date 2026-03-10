const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    originalId: { type: Number }, // Original site's ID (for imported data)
    session: { type: String, required: true },
    regNo: { type: String, required: true },
    nameEn: { type: String, required: true },
    nameBn: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    addressEn: { type: String, required: true },
    addressBn: { type: String, required: true },
    upazila: { type: String, required: true },
    department: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    hall: { type: String, required: true },
    gender: { type: String, required: true },
    isEmployed: { type: Boolean, default: false },
    organization: {
        type: String,
        required: function () {
            return this.isEmployed;
        },
        trim: true,
    },
    jobTitle: {
        type: String,
        required: function () {
            return this.isEmployed;
        },
        trim: true,
    },
    photo: { type: String }, // Path to the uploaded image
    password: { type: String, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    activities: [{
        actionTitle: { type: String, required: true }, // e.g. "Registration Submitted", "Profile Approved"
        adminName: { type: String }, // Name of the person who approved it
        details: { type: Object }, // Store the changes map { field: { oldValue, newValue } }
        timestamp: { type: Date, default: Date.now }
    }],
    resetPasswordOTP: { type: String },
    resetPasswordOTPExpires: { type: Date }
}, { timestamps: true });


// Pre-save middleware to hash password (promise-based, no next() for Mongoose v7+)
studentSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return; // early return, no next() needed
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
studentSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);

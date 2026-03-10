const express = require('express');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const {
    sendPasswordResetOtpEmail,
    sendPasswordResetSuccessAlert,
    sendStudentLoginAlert,
} = require('../utils/emailNotifier');

const router = express.Router();
const MOBILE_REGEX = /^01\d{9}$/;

const getRequestIpAddress = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    if (Array.isArray(forwarded)) return forwarded[0];
    if (typeof forwarded === 'string' && forwarded.length) return forwarded.split(',')[0].trim();
    return req.ip || req.connection?.remoteAddress || '';
};

const toDuplicateRecord = (studentDoc) => {
    if (!studentDoc) return null;
    const student = studentDoc.toObject ? studentDoc.toObject() : studentDoc;
    const titasId = student.originalId ? `TITAS-${student.originalId}` : `TITAS-${String(student._id).slice(-6).toUpperCase()}`;
    return {
        nameBn: student.nameBn || '',
        nameEn: student.nameEn || '',
        titasId,
    };
};

const buildDuplicatePayload = async ({ regNo, mobile, email }) => {
    const duplicates = { regNo: false, mobile: false, email: false };
    const messages = { regNo: '', mobile: '', email: '' };
    const records = { regNo: null, mobile: null, email: null };

    if (regNo && String(regNo).trim()) {
        const found = await Student.findOne({ regNo: String(regNo).trim() }).select('_id originalId nameBn nameEn');
        if (found) {
            duplicates.regNo = true;
            messages.regNo = 'এই রেজিস্ট্রেশন নম্বর দিয়ে ইতিমধ্যে নিবন্ধন করা হয়েছে।';
            records.regNo = toDuplicateRecord(found);
        }
    }

    if (mobile && String(mobile).trim()) {
        const found = await Student.findOne({ mobile: String(mobile).trim() }).select('_id originalId nameBn nameEn');
        if (found) {
            duplicates.mobile = true;
            messages.mobile = 'এই মোবাইল নম্বর দিয়ে ইতিমধ্যে নিবন্ধন করা হয়েছে।';
            records.mobile = toDuplicateRecord(found);
        }
    }

    if (email && String(email).trim()) {
        const normalizedEmail = String(email).trim().toLowerCase();
        const found = await Student.findOne({ email: { $regex: `^${normalizedEmail}$`, $options: 'i' } }).select('_id originalId nameBn nameEn');
        if (found) {
            duplicates.email = true;
            messages.email = 'এই ইমেইল দিয়ে ইতিমধ্যে নিবন্ধন করা হয়েছে।';
            records.email = toDuplicateRecord(found);
        }
    }

    return { duplicates, messages, records };
};

// Multer storage configuration for photo uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, 'student-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only (PNG, JPG)!');
        }
    }
});

// @route   GET /api/students/check-duplicate
// @desc    Check duplicate values for regNo, mobile, email
// @access  Public
router.get('/check-duplicate', async (req, res) => {
    try {
        const { regNo, mobile, email } = req.query;
        const payload = await buildDuplicatePayload({ regNo, mobile, email });
        return res.json(payload);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   POST /api/students
// @desc    Register a new student
// @access  Public
router.post('/', upload.single('photo'), async (req, res) => {
    try {
        const {
            session, regNo, nameEn, nameBn, mobile, email,
            addressEn, addressBn, upazila, department,
            bloodGroup, hall, gender, isEmployed, organization, jobTitle, password
        } = req.body;

        const trimmedMobile = String(mobile || '').trim();
        if (trimmedMobile.startsWith('+88')) {
            return res.status(400).json({ msg: 'মোবাইল নম্বর +88 ছাড়া ১১ ডিজিটে দিন (যেমন: 01XXXXXXXXX)।' });
        }
        if (!MOBILE_REGEX.test(trimmedMobile)) {
            return res.status(400).json({ msg: 'মোবাইল নম্বর অবশ্যই ১১ ডিজিট হতে হবে এবং 01 দিয়ে শুরু হতে হবে।' });
        }

        const employedFlag = isEmployed === 'true' || isEmployed === true;

        if (employedFlag) {
            if (!String(organization || '').trim()) {
                return res.status(400).json({ msg: 'প্রতিষ্ঠান / দপ্তর এর নাম প্রদান করুন।' });
            }
            if (!String(jobTitle || '').trim()) {
                return res.status(400).json({ msg: 'পদবী প্রদান করুন।' });
            }
        }

        // Check if student already exists by Reg No, Mobile, or Email
        const duplicateCheck = await buildDuplicatePayload({ regNo, mobile, email });
        if (duplicateCheck.duplicates.regNo) {
            return res.status(400).json({ msg: duplicateCheck.messages.regNo });
        }
        if (duplicateCheck.duplicates.mobile) {
            return res.status(400).json({ msg: duplicateCheck.messages.mobile });
        }
        if (duplicateCheck.duplicates.email) {
            return res.status(400).json({ msg: duplicateCheck.messages.email });
        }

        const newStudent = new Student({
            session,
            regNo,
            nameEn,
            nameBn,
            mobile: trimmedMobile,
            email: String(email).trim().toLowerCase(),
            addressEn,
            addressBn,
            upazila,
            department,
            bloodGroup,
            hall,
            gender,
            isEmployed: employedFlag,
            organization: employedFlag ? String(organization || '').trim() : '',
            jobTitle: employedFlag ? String(jobTitle || '').trim() : '',
            photo: req.file ? `/uploads/${req.file.filename}` : null,
            password
        });

        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET /api/students
// @desc    Get all students (with optional filtering)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { department, session, hall, bloodGroup, upazila, search } = req.query;
        // Only show admin-approved students in the public directory
        let query = { status: 'Approved' };

        // Apply filters if provided
        if (department) query.department = department;
        if (session) query.session = session;
        if (hall) query.hall = hall;
        if (bloodGroup) query.bloodGroup = encodeURIComponent(bloodGroup);
        if (upazila) query.upazila = upazila;

        // Apply search query (name, mobile, regNo)
        if (search) {
            query.$or = [
                { nameEn: { $regex: search, $options: 'i' } },
                { nameBn: { $regex: search, $options: 'i' } },
                { mobile: { $regex: search, $options: 'i' } },
                { regNo: { $regex: search, $options: 'i' } }
            ];
        }

        // Special handling if bloodgroup was passed in the query unencoded (Express sometimes decodes '+' to ' ')
        if (req.query.bloodGroup) {
            query.bloodGroup = req.query.bloodGroup.replace(' ', '+');
        }

        const rawStudents = await Student.find(query)
            .select('-password')
            .sort({ originalId: 1, createdAt: -1 });

        // Mask mobile numbers on server-side for privacy
        const students = rawStudents.map(student => {
            const s = student.toObject();
            if (s.mobile) {
                s.mobileMasked = s.mobile.slice(0, 5) + '****' + s.mobile.slice(-2);
                delete s.mobile; // Remove original full number
            }
            return s;
        });

        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Middleware for protecting routes
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'titas_secret_key');
            req.user = await Student.findById(decoded.id).select('-password');
            if (!req.user) return res.status(401).json({ msg: 'User not found' });
            return next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ msg: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        return res.status(401).json({ msg: 'Not authorized, no token' });
    }
};

// @route   POST /api/students/login
// @desc    Auth user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { emailOrMobile, password } = req.body;

    try {
        // Find user by email or mobile
        const user = await Student.findOne({
            $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }]
        });

        if (user && (await user.matchPassword(password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'titas_secret_key', {
                expiresIn: '30d',
            });

            try {
                await sendStudentLoginAlert(user, {
                    ipAddress: getRequestIpAddress(req),
                    userAgent: req.get('user-agent') || '',
                });
            } catch (notifyErr) {
                console.error('Student login alert email failed:', notifyErr);
            }

            res.json({
                _id: user._id,
                nameBn: user.nameBn,
                nameEn: user.nameEn,
                email: user.email,
                mobile: user.mobile,
                token,
            });
        } else {
            res.status(401).json({ msg: 'Invalid email/mobile or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET /api/students/me
// @desc    Get logged in user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const user = await Student.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ msg: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});
// @route   PUT /api/students/me/photo
// @desc    Upload/update profile photo directly
// @access  Private
router.put('/me/photo', protect, upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ msg: 'No photo uploaded' });
        const student = await Student.findByIdAndUpdate(
            req.user._id,
            { photo: `/uploads/${req.file.filename}` },
            { new: true }
        ).select('-password');
        res.json({ photo: student.photo, msg: 'Photo updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   PUT /api/students/me/password
// @desc    Change student password
// @access  Private
router.put('/me/password', protect, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) return res.status(400).json({ msg: 'Both passwords required' });
        const student = await Student.findById(req.user._id);
        const isMatch = await student.matchPassword(oldPassword);
        if (!isMatch) return res.status(400).json({ msg: 'Current password is incorrect' });
        if (newPassword.length < 6) return res.status(400).json({ msg: 'New password must be at least 6 characters' });
        student.password = newPassword;
        await student.save();
        res.json({ msg: 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!' });
    } catch (err) {
        console.error('Password change error:', err);
        res.status(500).json({ msg: err.message || 'Server Error' });
    }
});

// @route   POST /api/students/edit-request
// @desc    Student submits a profile edit request (supports photo via multipart)
// @access  Private (student)
const ProfileEdit = require('../models/ProfileEdit');

// Separate multer storage for pending photos (awaiting admin approval)
const pendingStorage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, 'uploads/pending/'); },
    filename: function (req, file, cb) { cb(null, 'pending-' + Date.now() + path.extname(file.originalname)); }
});
const uploadPending = multer({
    storage: pendingStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (/jpeg|jpg|png/.test(file.mimetype)) cb(null, true);
        else cb('Images only (JPEG, PNG)!');
    }
});

router.post('/edit-request', uploadPending.single('photo'), async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ msg: 'No token' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'titas_secret_key');
        const student = await Student.findById(decoded.id).select('-password');
        if (!student) return res.status(404).json({ msg: 'Student not found' });

        // Parse text changes (JSON string or object)
        let changes = {};
        if (req.body.changes) {
            try { changes = typeof req.body.changes === 'string' ? JSON.parse(req.body.changes) : req.body.changes; }
            catch (e) { changes = {}; }
        }

        const EDITABLE = ['nameBn', 'nameEn', 'mobile', 'email', 'addressEn', 'addressBn', 'upazila', 'bloodGroup', 'gender', 'isEmployed', 'organization', 'jobTitle'];
        const changeMap = {};

        for (const [field, newValue] of Object.entries(changes)) {
            if (!EDITABLE.includes(field)) continue;
            if (String(student[field] ?? '') !== String(newValue ?? '')) {
                changeMap[field] = { oldValue: student[field], newValue };
            }
        }

        // Handle photo change — stored in pending folder, awaiting approval
        if (req.file) {
            changeMap['photo'] = {
                oldValue: student.photo || null,
                newValue: `/uploads/pending/${req.file.filename}`
            };
        }

        if (Object.keys(changeMap).length === 0) {
            return res.status(400).json({ msg: 'No actual changes detected' });
        }

        // Cancel existing pending edits
        await ProfileEdit.updateMany(
            { student: student._id, status: 'Pending' },
            { status: 'Rejected', reviewedAt: new Date(), reviewedBy: 'SYSTEM (new request)' }
        );

        const edit = new ProfileEdit({ student: student._id, changes: changeMap });
        await edit.save();
        res.status(201).json({ msg: 'Edit request submitted successfully', editId: edit._id });
    } catch (err) {
        console.error('Edit request error:', err);
        res.status(500).json({ msg: err.message || 'Server Error' });
    }
});


// @route   GET /api/students/my-edits
// @desc    Get current student's edit requests
// @access  Private (student)
router.get('/my-edits', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ msg: 'No token' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'titas_secret_key');
        const edits = await ProfileEdit.find({ student: decoded.id }).sort({ createdAt: -1 }).limit(5);
        res.json(edits);
    } catch (err) {
        console.error('My edits error:', err);
        res.status(500).json({ msg: err.message || 'Server Error' });
    }
});

// @route   POST /api/students/forgot-password
// @desc    Send OTP for password reset
// @access  Public
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ msg: 'এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি।' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        student.resetPasswordOTP = otp;
        student.resetPasswordOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await student.save();

        const otpEmailResult = await sendPasswordResetOtpEmail(student, otp);
        if (!otpEmailResult?.sent) {
            return res.status(500).json({ msg: 'OTP পাঠাতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।' });
        }
        res.json({ msg: 'আপনার ইমেইলে ওটিপি পাঠানো হয়েছে।' });

    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ msg: 'OTP পাঠাতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।' });
    }
});

// @route   POST /api/students/verify-otp
// @desc    Verify OTP
// @access  Public
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const student = await Student.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordOTPExpires: { $gt: Date.now() }
        });

        if (!student) {
            return res.status(400).json({ msg: 'ভুল ওটিপি বা ওটিপির মেয়াদ শেষ হয়ে গেছে।' });
        }

        res.json({ msg: 'ওটিপি সফলভাবে যাচাই করা হয়েছে।' });
    } catch (err) {
        console.error('Verify OTP error:', err);
        res.status(500).json({ msg: 'সার্ভার ত্রুটি।' });
    }
});

// @route   POST /api/students/reset-password
// @desc    Reset password
// @access  Public
router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const student = await Student.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordOTPExpires: { $gt: Date.now() }
        });

        if (!student) {
            return res.status(400).json({ msg: 'পাসওয়ার্ড রিসেট করা যাচ্ছে না। আবার চেষ্টা করুন।' });
        }

        student.password = newPassword;
        student.resetPasswordOTP = undefined;
        student.resetPasswordOTPExpires = undefined;
        await student.save();

        try {
            await sendPasswordResetSuccessAlert(student);
        } catch (notifyErr) {
            console.error('Password reset success email failed:', notifyErr);
        }

        res.json({ msg: 'পাসওয়ার্ড সফলভাবে রিসেট হয়েছে। এবার লগইন করুন।' });
    } catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({ msg: 'সার্ভার ত্রুটি।' });
    }
});

module.exports = router;

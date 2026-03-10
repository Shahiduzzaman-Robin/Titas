const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Student = require('../models/Student');

const router = express.Router();

// Middleware for protecting Admin routes
const protectAdmin = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'titas_secret_key');
            req.admin = await Admin.findById(decoded.id).select('-password');
            if (!req.admin) {
                return res.status(401).json({ msg: 'Not authorized as an admin' });
            }
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ msg: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ msg: 'Not authorized, no token' });
    }
};

// @route   POST /api/admin/login
// @desc    Auth admin & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const adminUser = await Admin.findOne({ username });

        if (adminUser && (await adminUser.matchPassword(password))) {
            const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET || 'titas_secret_key', {
                expiresIn: '30d',
            });

            res.json({
                _id: adminUser._id,
                username: adminUser.username,
                role: adminUser.role,
                token,
            });
        } else {
            res.status(401).json({ msg: 'Invalid username or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/admin/students
// @desc    Get all students for admin view (Pending, Approved, etc)
// @access  Private Admin
router.get('/students', protectAdmin, async (req, res) => {
    try {
        const { session, department, hall, upazila, status, search } = req.query;
        let filter = {};
        if (session) filter.session = session;
        if (department) filter.department = department;
        if (hall) filter.hall = hall;
        if (upazila) filter.upazila = upazila;
        if (status) filter.status = status;
        if (search) {
            filter.$or = [
                { nameEn: { $regex: search, $options: 'i' } },
                { nameBn: { $regex: search, $options: 'i' } },
                { mobile: { $regex: search, $options: 'i' } },
                { regNo: { $regex: search, $options: 'i' } }
            ];
        }
        const students = await Student.find(filter).sort({ createdAt: -1 });
        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/admin/students/:id
// @desc    Get single student full details for admin view
// @access  Private Admin
router.get('/students/:id', protectAdmin, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ msg: 'Student not found' });
        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/admin/students/:id
// @desc    Update single student details (Admin direct edit)
// @access  Private Admin
router.put('/students/:id', protectAdmin, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ msg: 'Student not found' });

        const updatableFields = [
            'nameEn', 'nameBn', 'mobile', 'email', 'session', 'regNo',
            'department', 'hall', 'bloodGroup', 'upazila',
            'addressEn', 'addressBn', 'organization', 'jobTitle',
            'status', 'isEmployed'
        ];

        let updateData = {};
        let changesMade = false;

        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
                changesMade = true;
            }
        });

        if (changesMade) {
            const updatedStudent = await Student.findByIdAndUpdate(
                req.params.id,
                {
                    $set: updateData,
                    $push: {
                        activities: {
                            actionTitle: 'অ্যাডমিন কর্তৃক প্রোফাইল আপডেট (Admin Edit)',
                            adminName: req.admin.username || 'Admin',
                            timestamp: new Date()
                        }
                    }
                },
                { new: true } // Return updated document, don't strictly validate entire old doc
            );
            res.json(updatedStudent);
        } else {
            res.json(student); // no changes
        }
    } catch (err) {
        console.error('Update Error:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

// @route   GET /api/admin/pending-edits-count
// @desc    Get count of pending student edits
// @access  Private Admin
router.get('/pending-edits-count', protectAdmin, async (req, res) => {
    try {
        const count = await ProfileEdit.countDocuments({ status: 'Pending' });
        res.json({ count });
    } catch (err) {
        console.error('Error fetching pending edits count:', err);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/admin/stats
// @desc    Get aggregated dashboard stats and demographics
// @access  Private Admin
router.get('/stats', protectAdmin, async (req, res) => {
    try {
        const total = await Student.countDocuments();
        const approved = await Student.countDocuments({ status: 'Approved' });
        // Count students who are explicitly Pending OR have no status set (legacy docs)
        const pending = await Student.countDocuments({ $or: [{ status: 'Pending' }, { status: { $exists: false } }, { status: null }] });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayCount = await Student.countDocuments({ createdAt: { $gte: today } });
        const rejected = await Student.countDocuments({ status: 'Rejected' });

        // This month
        const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
        const monthlyCount = await Student.countDocuments({ createdAt: { $gte: monthStart } });

        // Last month
        const lastMonthStart = new Date(); lastMonthStart.setMonth(lastMonthStart.getMonth() - 1); lastMonthStart.setDate(1); lastMonthStart.setHours(0, 0, 0, 0);
        const lastMonthEnd = new Date(); lastMonthEnd.setDate(0); lastMonthEnd.setHours(23, 59, 59, 999);
        const lastMonthCount = await Student.countDocuments({ createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } });

        // Students with profile photo
        const withPhoto = await Student.countDocuments({ photo: { $exists: true, $ne: null, $ne: '' } });

        // Gender breakdown
        const females = await Student.countDocuments({ gender: { $in: ['Female', 'মহিলা', 'female'] } });
        const males = total - females;

        // Blood group breakdown
        const bloodGroups = await Student.aggregate([
            { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Top upazila
        const upazilas = await Student.aggregate([
            { $group: { _id: '$upazila', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 6 }
        ]);

        // Hall distribution
        const halls = await Student.aggregate([
            { $group: { _id: '$hall', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Department distribution
        const departments = await Student.aggregate([
            { $group: { _id: '$department', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 8 }
        ]);

        // Sessions count
        const sessions = await Student.distinct('session');

        // Registration trend: last 7 days
        const dayLabels = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি'];
        const trend = [];
        for (let i = 6; i >= 0; i--) {
            const dayStart = new Date(); dayStart.setDate(dayStart.getDate() - i); dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(dayStart); dayEnd.setHours(23, 59, 59, 999);
            const count = await Student.countDocuments({ createdAt: { $gte: dayStart, $lte: dayEnd } });
            trend.push({ label: dayLabels[dayStart.getDay()], count });
        }

        // Approval rate
        const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

        res.json({
            total, approved, pending, rejected, todayCount, monthlyCount, lastMonthCount,
            withPhoto, approvalRate,
            males, females,
            bloodGroups, upazilas, halls, departments,
            activeSessions: sessions.length,
            trend
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/admin/students/:id/status
// @desc    Approve or Reject a student
// @access  Private Admin
router.put('/students/:id/status', protectAdmin, async (req, res) => {
    try {
        const { status } = req.body; // 'Approved' or 'Rejected'
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        if (status !== 'Approved' && status !== 'Rejected') {
            return res.status(400).json({ msg: 'Invalid status' });
        }

        student.status = status;

        // Guard: ensure activities array exists for older documents
        if (!student.activities) {
            student.activities = [];
        }

        // Log the activity
        let actionTitle = status === 'Approved' ? 'সদস্যপদ নিবন্ধন (Approved)' : 'সদস্যপদ নিবন্ধন (Rejected)';

        student.activities.push({
            actionTitle: actionTitle,
            adminName: req.admin.username,
            timestamp: new Date()
        });

        const updatedStudent = await student.save();
        res.json(updatedStudent);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// =============================================================
// PROFILE EDITS
// =============================================================
const ProfileEdit = require('../models/ProfileEdit');
const fs = require('fs');
const pathLib = require('path');

const FIELD_LABELS = {
    nameBn: 'নাম (বাংলা)', nameEn: 'নাম (ইংরেজি)', mobile: 'মোবাইল', email: 'ইমেইল',
    addressEn: 'ঠিকানা (ইংরেজি)', addressBn: 'ঠিকানা (বাংলা)', upazila: 'উপজেলা',
    bloodGroup: 'রক্তের গ্রুপ', gender: 'লিঙ্গ', organization: 'প্রতিষ্ঠান', jobTitle: 'পদবী',
    photo: 'ছবি', isEmployed: 'চাকুরীজীবী'
};

// @route   GET /api/admin/edits
// @desc    List all pending profile edit requests
// @access  Private Admin
router.get('/edits', protectAdmin, async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};
        const edits = await ProfileEdit.find(filter)
            .populate('student', 'nameBn nameEn mobile regNo session department hall photo status')
            .sort({ createdAt: -1 });
        res.json(edits);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/admin/edits/stats
// @desc    Count pending edits
// @access  Private Admin
router.get('/edits/stats', protectAdmin, async (req, res) => {
    try {
        const pending = await ProfileEdit.countDocuments({ status: 'Pending' });
        const approved = await ProfileEdit.countDocuments({ status: 'Approved' });
        const rejected = await ProfileEdit.countDocuments({ status: 'Rejected' });
        res.json({ pending, approved, rejected });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/admin/edits/:id/approve
// @desc    Approve a profile edit — apply changes to the student document
// @access  Private Admin
router.put('/edits/:id/approve', protectAdmin, async (req, res) => {
    try {
        const edit = await ProfileEdit.findById(req.params.id).populate('student');
        if (!edit) return res.status(404).json({ msg: 'Edit request not found' });
        if (edit.status !== 'Pending') return res.status(400).json({ msg: 'Edit already reviewed' });

        const student = await Student.findById(edit.student._id);
        if (!student) return res.status(404).json({ msg: 'Student not found' });

        // Apply each changed field
        for (const [field, diff] of edit.changes.entries()) {
            if (field === 'photo') {
                // Move photo from pending folder to main uploads folder
                const pendingPath = pathLib.join(__dirname, '..', diff.newValue);
                const filename = pathLib.basename(pendingPath).replace('pending-', 'student-');
                const finalPath = pathLib.join(__dirname, '..', 'uploads', filename);
                try {
                    if (fs.existsSync(pendingPath)) {
                        fs.renameSync(pendingPath, finalPath);
                        student.photo = `/uploads/${filename}`;
                    } else {
                        // already moved or missing — use as-is
                        student.photo = diff.newValue;
                    }
                } catch (e) {
                    console.error('Photo move error:', e);
                    student.photo = diff.newValue; // fallback
                }
            } else {
                student[field] = diff.newValue;
            }
        }

        // Log the activity
        if (!student.activities) student.activities = [];
        student.activities.push({
            actionTitle: 'প্রোফাইল সম্পাদনা অনুমোদিত (Edit Approved)',
            adminName: req.admin.username,
            details: Object.fromEntries(edit.changes),
            timestamp: new Date()
        });
        await student.save();

        edit.status = 'Approved';
        edit.reviewedAt = new Date();
        edit.reviewedBy = req.admin.username;
        await edit.save();

        res.json({ msg: 'Edit approved and applied', edit });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/admin/edits/:id/reject
// @desc    Reject a profile edit — do NOT apply changes
// @access  Private Admin
router.put('/edits/:id/reject', protectAdmin, async (req, res) => {
    try {
        const edit = await ProfileEdit.findById(req.params.id);
        if (!edit) return res.status(404).json({ msg: 'Edit request not found' });
        if (edit.status !== 'Pending') return res.status(400).json({ msg: 'Edit already reviewed' });

        edit.status = 'Rejected';
        edit.reviewedAt = new Date();
        edit.reviewedBy = req.admin.username;
        await edit.save();

        res.json({ msg: 'Edit rejected', edit });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

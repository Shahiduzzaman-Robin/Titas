const express = require('express');
const jwt = require('jsonwebtoken');
const ExcelJS = require('exceljs');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const AuditLog = require('../models/AuditLog');
const Student = require('../models/Student');
const { logAdminAction } = require('../utils/auditLogger');
const {
    DEFAULT_NOTIFICATION_SETTINGS,
    getNotificationSettingsSnapshot,
    isEmailConfigured,
    isBulkNoticeEmailAllowed,
    notifyStudentRegistrationStatus,
    notifyProfileEditDecision,
    saveNotificationSettings,
    sendNotificationTestEmail,
} = require('../utils/emailNotifier');
const { sendUpcomingEventReminders } = require('../utils/eventReminderService');
const { protectAdmin: protectAdminAll } = require('../middleware/auth');

const router = express.Router();

// Escape special regex characters to prevent ReDoS / NoSQL injection
const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Strict rate limiter for login: 10 attempts per 15 minutes
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { msg: 'Too many login attempts. Please try again after 15 minutes.' },
});

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
            if (req.admin.role === 'Content Admin') {
                return res.status(403).json({ msg: 'Access denied for Content Admin on this module' });
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
router.post('/login',
    loginLimiter,
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array()[0].msg });
    }

    const { username, password } = req.body;
    const normalizedUsername = String(username || '').trim();

    try {
        const adminUser = await Admin.findOne({ username: normalizedUsername });

        if (adminUser && (await adminUser.matchPassword(password))) {
            const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET || 'titas_secret_key', {
                expiresIn: process.env.JWT_EXPIRES_IN || '24h',
            });

            await logAdminAction(req, {
                admin: adminUser._id,
                adminUsername: adminUser.username,
                module: 'auth',
                action: 'login',
                targetType: 'admin-session',
                targetId: adminUser._id,
                targetLabel: adminUser.username,
                description: `Admin ${adminUser.username} logged in`,
                details: {
                    role: adminUser.role,
                },
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
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   POST /api/admin/logout
// @desc    Log admin logout event
// @access  Private Admin
router.post('/logout', protectAdmin, async (req, res) => {
    try {
        await logAdminAction(req, {
            module: 'auth',
            action: 'logout',
            targetType: 'admin-session',
            targetId: req.admin._id,
            targetLabel: req.admin.username,
            description: `Admin ${req.admin.username} logged out`,
            details: {
                role: req.admin.role,
            },
        });

        return res.json({ success: true, msg: 'Logout logged successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET /api/admin/audit-logs
// @desc    List audit logs for admin actions
// @access  Private Admin
router.get('/audit-logs', protectAdmin, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 50,
            module = '',
            action = '',
            adminUsername = '',
            search = '',
        } = req.query;

        const query = {};
        if (module) query.module = module;
        if (action) query.action = action;
        if (adminUsername) query.adminUsername = adminUsername;
        if (search) {
            const safeSearch = escapeRegex(search);
            query.$or = [
                { targetLabel: { $regex: safeSearch, $options: 'i' } },
                { description: { $regex: safeSearch, $options: 'i' } },
                { adminUsername: { $regex: safeSearch, $options: 'i' } },
            ];
        }

        const pageNumber = Math.max(1, parseInt(page, 10) || 1);
        const limitNumber = Math.min(200, Math.max(1, parseInt(limit, 10) || 50));
        const total = await AuditLog.countDocuments(query);
        const logs = await AuditLog.find(query)
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        res.json({
            logs,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                hasMore: pageNumber * limitNumber < total,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET /api/admin/email/status
// @desc    Get email notification system status
// @access  Private Admin
router.get('/email/status', protectAdmin, async (req, res) => {
    const reminderEnabled = String(process.env.EVENT_REMINDER_JOB_ENABLED || 'true').toLowerCase() !== 'false';
    const settingsSnapshot = await getNotificationSettingsSnapshot();
    return res.json({
        success: true,
        emailConfigured: isEmailConfigured(),
        allowBulkNoticeEmail: isBulkNoticeEmailAllowed(),
        settings: settingsSnapshot.settings,
        settingsUpdatedBy: settingsSnapshot.updatedBy,
        settingsUpdatedAt: settingsSnapshot.updatedAt,
        reminderJob: {
            enabled: reminderEnabled,
            intervalHours: Number(process.env.EVENT_REMINDER_JOB_INTERVAL_HOURS || 6),
            daysAhead: Number(process.env.EVENT_REMINDER_DAYS_AHEAD || 1),
        },
    });
});

// @route   PUT /api/admin/email/settings
// @desc    Persist email notification settings
// @access  Private Admin
router.put('/email/settings', protectAdmin, async (req, res) => {
    try {
        const nextSettings = req.body?.settings || {};
        const mergedSettings = { ...DEFAULT_NOTIFICATION_SETTINGS, ...nextSettings };
        const saved = await saveNotificationSettings(mergedSettings, req.admin?.username || '');

        await logAdminAction(req, {
            module: 'notifications',
            action: 'update_settings',
            targetType: 'notification-settings',
            targetId: 'default',
            targetLabel: 'Email notification settings',
            description: `Admin ${req.admin.username} updated email notification settings`,
            details: {
                settings: saved.settings,
            },
        });

        return res.json({
            success: true,
            msg: 'Email notification settings saved successfully',
            settings: saved.settings,
            updatedAt: saved.updatedAt,
            updatedBy: saved.updatedBy,
        });
    } catch (error) {
        console.error('Email settings save failed:', error);
        return res.status(500).json({ success: false, msg: 'Failed to save notification settings' });
    }
});

// @route   POST /api/admin/email/test
// @desc    Send a test email for a notification template
// @access  Private Admin
router.post('/email/test', protectAdmin, async (req, res) => {
    try {
        const to = String(req.body?.to || '').trim().toLowerCase();
        const type = String(req.body?.type || '').trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(to)) {
            return res.status(400).json({ success: false, msg: 'A valid email address is required.' });
        }

        if (!Object.prototype.hasOwnProperty.call(DEFAULT_NOTIFICATION_SETTINGS, type)) {
            return res.status(400).json({ success: false, msg: 'Unknown notification template type.' });
        }

        const result = await sendNotificationTestEmail(type, to);
        if (!result?.sent) {
            const reason = result?.reason === 'smtp-not-configured'
                ? 'SMTP is not configured.'
                : 'Failed to send test email.';
            return res.status(400).json({ success: false, msg: reason });
        }

        await logAdminAction(req, {
            module: 'notifications',
            action: 'send_test_email',
            targetType: 'notification-template',
            targetId: type,
            targetLabel: type,
            description: `Admin ${req.admin.username} sent a notification test email`,
            details: {
                type,
                recipient: to,
            },
        });

        return res.json({ success: true, msg: 'Test email sent successfully.' });
    } catch (error) {
        console.error('Test email send failed:', error);
        return res.status(500).json({ success: false, msg: 'Failed to send test email.' });
    }
});

// @route   POST /api/admin/events/reminders/send
// @desc    Send reminder emails for upcoming events to approved students
// @access  Private Admin
router.post('/events/reminders/send', protectAdmin, async (req, res) => {
    try {
        const daysAhead = Math.max(1, Math.min(14, Number(req.body?.daysAhead || req.query?.daysAhead || 1)));
        const stats = await sendUpcomingEventReminders({ daysAhead });

        await logAdminAction(req, {
            module: 'notifications',
            action: 'send_event_reminders',
            targetType: 'event-reminder-job',
            targetId: 'manual',
            targetLabel: 'Manual event reminder run',
            description: `Admin ${req.admin.username} triggered manual event reminders`,
            details: {
                daysAhead,
                remindedEvents: stats?.remindedEvents || 0,
                recipientsNotified: stats?.recipientsNotified || 0,
            },
        });

        return res.json({ success: true, ...stats });
    } catch (error) {
        console.error('Manual event reminder failed:', error);
        return res.status(500).json({ success: false, msg: 'Failed to send event reminders' });
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
            const safeSearch = escapeRegex(search);
            filter.$or = [
                { nameEn: { $regex: safeSearch, $options: 'i' } },
                { nameBn: { $regex: safeSearch, $options: 'i' } },
                { mobile: { $regex: safeSearch, $options: 'i' } },
                { regNo: { $regex: safeSearch, $options: 'i' } }
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

// @route   GET /api/admin/students/export/approved
// @desc    Export all approved students to a formatted Excel file
// @access  Private Admin
router.get('/students/export/approved', protectAdmin, async (req, res) => {
    try {
        const approvedStudents = await Student.find({ status: 'Approved' }).sort({ session: -1, department: 1, nameEn: 1 });

        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Titas Admin Panel';
        workbook.company = 'Titas DU';
        workbook.created = new Date();
        workbook.modified = new Date();

        const worksheet = workbook.addWorksheet('Approved Students', {
            views: [{ state: 'frozen', ySplit: 5 }],
        });

        const totalColumns = 20;
        const generatedAt = new Date();

        worksheet.mergeCells(1, 1, 1, totalColumns);
        worksheet.getCell('A1').value = 'Titas DU Approved Students Directory';
        worksheet.getCell('A1').font = { size: 18, bold: true, color: { argb: 'FF1F3A5F' } };
        worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(1).height = 28;

        worksheet.mergeCells(2, 1, 2, totalColumns);
        worksheet.getCell('A2').value = 'Dhaka University students from Brahmanbaria - approved member export';
        worksheet.getCell('A2').font = { size: 11, color: { argb: 'FF64748B' }, italic: true };
        worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.mergeCells(3, 1, 3, totalColumns);
        worksheet.getCell('A3').value = `Generated: ${generatedAt.toLocaleString('en-GB')} | Total Approved Students: ${approvedStudents.length}`;
        worksheet.getCell('A3').font = { size: 10, color: { argb: 'FF475569' } };
        worksheet.getCell('A3').alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.getRow(4).height = 10;

        const columns = [
            { header: 'Titas ID', key: 'titasId', width: 16 },
            { header: 'Name (Bangla)', key: 'nameBn', width: 24 },
            { header: 'Name (English)', key: 'nameEn', width: 26 },
            { header: 'Session', key: 'session', width: 14 },
            { header: 'Registration No', key: 'regNo', width: 18 },
            { header: 'Department', key: 'department', width: 30 },
            { header: 'Hall', key: 'hall', width: 26 },
            { header: 'Mobile', key: 'mobile', width: 16 },
            { header: 'Email', key: 'email', width: 28 },
            { header: 'Upazila', key: 'upazila', width: 16 },
            { header: 'Blood Group', key: 'bloodGroup', width: 14 },
            { header: 'Gender', key: 'gender', width: 12 },
            { header: 'Employed', key: 'isEmployed', width: 12 },
            { header: 'Organization', key: 'organization', width: 28 },
            { header: 'Job Title', key: 'jobTitle', width: 24 },
            { header: 'Address (English)', key: 'addressEn', width: 32 },
            { header: 'Address (Bangla)', key: 'addressBn', width: 32 },
            { header: 'Status', key: 'status', width: 12 },
            { header: 'Created At', key: 'createdAt', width: 20 },
            { header: 'Updated At', key: 'updatedAt', width: 20 },
        ];

        worksheet.columns = columns;

        const headerRow = worksheet.getRow(5);
        headerRow.values = columns.map((column) => column.header);
        headerRow.height = 22;
        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF1E3A5F' },
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            cell.border = {
                top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
                left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
                bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
                right: { style: 'thin', color: { argb: 'FFD1D5DB' } },
            };
        });

        approvedStudents.forEach((student, index) => {
            const row = worksheet.addRow({
                titasId: student.originalId ? `TITAS-${student.originalId}` : `TITAS-${student.regNo || String(student._id).slice(-6).toUpperCase()}`,
                nameBn: student.nameBn || '',
                nameEn: student.nameEn || '',
                session: student.session || '',
                regNo: student.regNo || '',
                department: student.department || '',
                hall: student.hall || '',
                mobile: student.mobile || '',
                email: student.email || '',
                upazila: student.upazila || '',
                bloodGroup: student.bloodGroup || '',
                gender: student.gender || '',
                isEmployed: student.isEmployed ? 'Yes' : 'No',
                organization: student.organization || '',
                jobTitle: student.jobTitle || '',
                addressEn: student.addressEn || '',
                addressBn: student.addressBn || '',
                status: student.status || '',
                createdAt: student.createdAt ? new Date(student.createdAt).toLocaleString('en-GB') : '',
                updatedAt: student.updatedAt ? new Date(student.updatedAt).toLocaleString('en-GB') : '',
            });

            row.height = 20;
            row.eachCell((cell) => {
                cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                    left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                    bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                    right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
                };
                if (index % 2 === 0) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFF8FAFC' },
                    };
                }
            });
        });

        worksheet.autoFilter = {
            from: { row: 5, column: 1 },
            to: { row: 5, column: totalColumns },
        };

        const filename = `titas-approved-students-${generatedAt.toISOString().slice(0, 10)}.xlsx`;

        await logAdminAction(req, {
            module: 'students',
            action: 'export_approved_students',
            targetType: 'student-export',
            targetId: 'approved',
            targetLabel: 'Approved student export',
            description: `Admin ${req.admin.username} exported approved students`,
            details: {
                count: approvedStudents.length,
                filename,
            },
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        await workbook.xlsx.write(res);
        return res.end();
    } catch (err) {
        console.error('Student export error:', err);
        return res.status(500).json({ msg: 'Failed to export approved students' });
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
            const beforeValues = {};
            Object.keys(updateData).forEach((field) => {
                beforeValues[field] = student[field];
            });

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

            await logAdminAction(req, {
                module: 'students',
                action: 'edit_profile',
                targetType: 'student',
                targetId: updatedStudent._id,
                targetLabel: updatedStudent.nameEn || updatedStudent.nameBn || updatedStudent.regNo,
                description: `Edited student profile for ${updatedStudent.nameEn || updatedStudent.nameBn}`,
                details: {
                    before: beforeValues,
                    after: updateData,
                },
            });

            res.json(updatedStudent);
        } else {
            res.json(student); // no changes
        }
    } catch (err) {
        console.error('Update Error:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

// @route   DELETE /api/admin/students/:id
// @desc    Delete a student record
// @access  Private Admin
router.delete('/students/:id', protectAdmin, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ msg: 'Student not found' });

        const deletedSnapshot = {
            nameEn: student.nameEn,
            nameBn: student.nameBn,
            regNo: student.regNo,
            session: student.session,
            department: student.department,
            status: student.status,
        };

        // Best-effort cleanup for uploaded profile photo.
        if (student.photo && typeof student.photo === 'string' && student.photo.startsWith('/uploads/')) {
            const fsLocal = require('fs');
            const pathLocal = require('path');
            const filePath = pathLocal.join(__dirname, '..', student.photo.replace(/^\//, ''));
            if (fsLocal.existsSync(filePath)) {
                fsLocal.unlinkSync(filePath);
            }
        }

        // Remove related profile edit requests if present.
        try {
            const ProfileEditModel = require('../models/ProfileEdit');
            await ProfileEditModel.deleteMany({ student: student._id });
        } catch (e) {
            // Ignore if cleanup model/file is unavailable.
        }

        await student.deleteOne();

        await logAdminAction(req, {
            module: 'students',
            action: 'delete_record',
            targetType: 'student',
            targetId: req.params.id,
            targetLabel: deletedSnapshot.nameEn || deletedSnapshot.nameBn || deletedSnapshot.regNo,
            description: `Deleted student record for ${deletedSnapshot.nameEn || deletedSnapshot.nameBn}`,
            details: deletedSnapshot,
        });

        return res.json({ success: true, msg: 'Student deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Server Error' });
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

        await logAdminAction(req, {
            module: 'students',
            action: status === 'Approved' ? 'approve_student' : 'reject_student',
            targetType: 'student',
            targetId: updatedStudent._id,
            targetLabel: updatedStudent.nameEn || updatedStudent.nameBn || updatedStudent.regNo,
            description: `${status === 'Approved' ? 'Approved' : 'Rejected'} student ${updatedStudent.nameEn || updatedStudent.nameBn}`,
            details: {
                status,
                regNo: updatedStudent.regNo,
                session: updatedStudent.session,
                department: updatedStudent.department,
            },
        });

        try {
            await notifyStudentRegistrationStatus(updatedStudent, status);
        } catch (notifyErr) {
            console.error('Registration status email notify failed:', notifyErr);
        }

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

        await logAdminAction(req, {
            module: 'students',
            action: 'approve_profile_edit',
            targetType: 'profile-edit',
            targetId: edit._id,
            targetLabel: student.nameEn || student.nameBn || student.regNo,
            description: `Approved profile edit for ${student.nameEn || student.nameBn}`,
            details: {
                studentId: student._id,
                changes: Object.fromEntries(edit.changes),
            },
        });

        try {
            await notifyProfileEditDecision(student, 'Approved');
        } catch (notifyErr) {
            console.error('Profile edit approval email notify failed:', notifyErr);
        }

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
        const edit = await ProfileEdit.findById(req.params.id).populate('student');
        if (!edit) return res.status(404).json({ msg: 'Edit request not found' });
        if (edit.status !== 'Pending') return res.status(400).json({ msg: 'Edit already reviewed' });

        edit.status = 'Rejected';
        edit.reviewedAt = new Date();
        edit.reviewedBy = req.admin.username;
        await edit.save();

        await logAdminAction(req, {
            module: 'students',
            action: 'reject_profile_edit',
            targetType: 'profile-edit',
            targetId: edit._id,
            targetLabel: edit?.student?.nameEn || edit?.student?.nameBn || String(edit.student || ''),
            description: `Rejected profile edit request ${edit._id}`,
            details: {
                studentId: edit?.student?._id || edit.student,
                changes: Object.fromEntries(edit.changes || []),
            },
        });

        try {
            if (edit.student) {
                await notifyProfileEditDecision(edit.student, 'Rejected');
            }
        } catch (notifyErr) {
            console.error('Profile edit rejection email notify failed:', notifyErr);
        }

        res.json({ msg: 'Edit rejected', edit });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// ═══════════════════════════════════════════════
// ADMIN PROFILE & SETTINGS (all admin roles)
// ═══════════════════════════════════════════════

// @route   GET /api/admin/profile
// @desc    Get current admin profile
// @access  Private (all admin roles)
router.get('/profile', protectAdminAll, async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id).select('-password');
        if (!admin) return res.status(404).json({ msg: 'Admin not found' });
        res.json({
            _id: admin._id,
            username: admin.username,
            email: admin.email || '',
            displayName: admin.displayName || '',
            role: admin.role,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   PUT /api/admin/profile
// @desc    Update admin profile (username, email, displayName)
// @access  Private (all admin roles)
router.put('/profile', protectAdminAll,
    body('username').optional().trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').optional().trim().isEmail().withMessage('Invalid email format'),
    body('displayName').optional().trim(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array()[0].msg });
        }

        try {
            const admin = await Admin.findById(req.admin._id);
            if (!admin) return res.status(404).json({ msg: 'Admin not found' });

            const { username, email, displayName } = req.body;

            if (username && username !== admin.username) {
                const existing = await Admin.findOne({ username: username.trim() });
                if (existing) return res.status(400).json({ msg: 'Username already taken' });
                admin.username = username.trim();
            }
            if (email !== undefined) admin.email = email.trim();
            if (displayName !== undefined) admin.displayName = displayName.trim();

            await admin.save();

            await logAdminAction(req, {
                module: 'admin-profile',
                action: 'update-profile',
                targetType: 'admin',
                targetId: admin._id,
                targetLabel: admin.username,
                description: `Admin ${admin.username} updated their profile`,
            });

            // Update localStorage-compatible response
            res.json({
                msg: 'Profile updated successfully',
                admin: {
                    _id: admin._id,
                    username: admin.username,
                    email: admin.email || '',
                    displayName: admin.displayName || '',
                    role: admin.role,
                },
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Server Error' });
        }
    }
);

// @route   PUT /api/admin/change-password
// @desc    Change admin password
// @access  Private (all admin roles)
router.put('/change-password', protectAdminAll,
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array()[0].msg });
        }

        try {
            const admin = await Admin.findById(req.admin._id);
            if (!admin) return res.status(404).json({ msg: 'Admin not found' });

            const isMatch = await admin.matchPassword(req.body.currentPassword);
            if (!isMatch) return res.status(400).json({ msg: 'Current password is incorrect' });

            admin.password = req.body.newPassword;
            await admin.save();

            await logAdminAction(req, {
                module: 'admin-profile',
                action: 'change-password',
                targetType: 'admin',
                targetId: admin._id,
                targetLabel: admin.username,
                description: `Admin ${admin.username} changed their password`,
            });

            res.json({ msg: 'Password changed successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Server Error' });
        }
    }
);

module.exports = router;

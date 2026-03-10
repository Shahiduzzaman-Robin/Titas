const Notice = require('../models/Notice');
const { logAdminAction } = require('../utils/auditLogger');
const { notifyStudentsAboutNewNotice } = require('../utils/emailNotifier');

// @desc    Get all active notices (Public)
// @route   GET /api/notices
// @access  Public
exports.getNotices = async (req, res) => {
    try {
        const notices = await Notice.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: notices.length, data: notices });
    } catch (error) {
        console.error('Error fetching public notices:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all notices (Admin)
// @route   GET /api/notices/all
// @access  Private/Admin
exports.getAllNotices = async (req, res) => {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: notices.length, data: notices });
    } catch (error) {
        console.error('Error fetching all notices:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create a new notice (Admin)
// @route   POST /api/notices
// @access  Private/Admin
exports.createNotice = async (req, res) => {
    console.log('--- POST /api/notices body:', req.body);
    try {
        const { text, link, priority, isActive, sendEmail, sendTestEmailTo } = req.body;
        if (!text) {
            return res.status(400).json({ success: false, message: 'Notice text is required' });
        }

        const sendEmailFlag = sendEmail === true || sendEmail === 'true';
        const testRecipient = String(sendTestEmailTo || '').trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (sendEmailFlag) {
            if (!testRecipient || !emailRegex.test(testRecipient)) {
                return res.status(400).json({ success: false, message: 'A valid single test email is required.' });
            }
        }

        const notice = await Notice.create({ text, link, priority, isActive });
        await logAdminAction(req, {
            module: 'notices',
            action: 'publish_content',
            targetType: 'notice',
            targetId: notice._id,
            targetLabel: (notice.text || '').slice(0, 80),
            description: `Published notice "${(notice.text || '').slice(0, 60)}"`,
            details: {
                priority: notice.priority,
                isActive: notice.isActive,
                link: notice.link,
                emailNotification: {
                    requested: sendEmailFlag,
                    mode: 'single',
                    recipient: testRecipient || null,
                },
            },
        });

        let notificationResult = null;
        if (sendEmailFlag) {
            try {
                notificationResult = await notifyStudentsAboutNewNotice(notice, { recipientEmail: testRecipient });
            } catch (notifyErr) {
                console.error('New notice email notify failed:', notifyErr);
            }
        }

        res.status(201).json({ success: true, data: notice, notification: notificationResult });
    } catch (error) {
        console.error('Error creating notice:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update a notice (Admin)
// @route   PUT /api/notices/:id
// @access  Private/Admin
exports.updateNotice = async (req, res) => {
    try {
        const existingNotice = await Notice.findById(req.params.id);
        if (!existingNotice) {
            return res.status(404).json({ success: false, message: 'Notice not found' });
        }

        const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        await logAdminAction(req, {
            module: 'notices',
            action: 'update_content',
            targetType: 'notice',
            targetId: notice._id,
            targetLabel: (notice.text || '').slice(0, 80),
            description: `Updated notice "${(notice.text || '').slice(0, 60)}"`,
            details: {
                before: {
                    text: existingNotice.text,
                    priority: existingNotice.priority,
                    isActive: existingNotice.isActive,
                },
                after: {
                    text: notice.text,
                    priority: notice.priority,
                    isActive: notice.isActive,
                },
            },
        });

        res.status(200).json({ success: true, data: notice });
    } catch (error) {
        console.error('Error updating notice:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete a notice (Admin)
// @route   DELETE /api/notices/:id
// @access  Private/Admin
exports.deleteNotice = async (req, res) => {
    try {
        const notice = await Notice.findByIdAndDelete(req.params.id);

        if (!notice) {
            return res.status(404).json({ success: false, message: 'Notice not found' });
        }

        await logAdminAction(req, {
            module: 'notices',
            action: 'remove_content',
            targetType: 'notice',
            targetId: notice._id,
            targetLabel: (notice.text || '').slice(0, 80),
            description: `Removed notice "${(notice.text || '').slice(0, 60)}"`,
            details: {
                priority: notice.priority,
                isActive: notice.isActive,
                link: notice.link,
            },
        });

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error('Error deleting notice:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

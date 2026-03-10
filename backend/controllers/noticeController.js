const Notice = require('../models/Notice');

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
        const { text, link, priority, isActive } = req.body;
        if (!text) {
            return res.status(400).json({ success: false, message: 'Notice text is required' });
        }

        const notice = await Notice.create({ text, link, priority, isActive });
        res.status(201).json({ success: true, data: notice });
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
        const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!notice) {
            return res.status(404).json({ success: false, message: 'Notice not found' });
        }

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

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error('Error deleting notice:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

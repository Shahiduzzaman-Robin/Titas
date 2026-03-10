const ContactMessage = require('../models/ContactMessage');
const { logAdminAction } = require('../utils/auditLogger');

// @desc    Submit a new contact message
// @route   POST /api/contact
// @access  Public
exports.submitMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const newMessage = await ContactMessage.create({
            name,
            email,
            subject,
            message
        });

        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully.',
            data: newMessage
        });
    } catch (error) {
        console.error('Contact submission error:', error);
        res.status(500).json({ success: false, message: 'Server Error. Please try again later.' });
    }
};

// @desc    Get all contact messages (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
exports.getMessages = async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: messages.length, data: messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get count of unread messages (Admin only)
// @route   GET /api/contact/unread
// @access  Private/Admin
exports.getUnreadCount = async (req, res) => {
    try {
        const count = await ContactMessage.countDocuments({ status: 'unread' });
        res.status(200).json({ success: true, count });
    } catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update message status (Admin only)
// @route   PUT /api/contact/:id/status
// @access  Private/Admin
exports.updateMessageStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['unread', 'read', 'replied'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value.' });
        }

        const existingMessage = await ContactMessage.findById(id);
        if (!existingMessage) {
            return res.status(404).json({ success: false, message: 'Message not found.' });
        }

        const message = await ContactMessage.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        await logAdminAction(req, {
            module: 'contact',
            action: 'update_message_status',
            targetType: 'contact-message',
            targetId: message._id,
            targetLabel: message.subject || message.email,
            description: `Updated contact message status to ${status}`,
            details: {
                beforeStatus: existingMessage.status,
                afterStatus: message.status,
                senderEmail: message.email,
            },
        });

        res.status(200).json({ success: true, data: message });
    } catch (error) {
        console.error('Error updating message status:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

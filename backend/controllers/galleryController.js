const GalleryImage = require('../models/GalleryImage');
const fs = require('fs');
const path = require('path');
const { logAdminAction } = require('../utils/auditLogger');

// @desc    Get all gallery images (Public)
// @route   GET /api/gallery
// @access  Public
exports.getGalleryImages = async (req, res) => {
    try {
        const images = await GalleryImage.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: images.length, data: images });
    } catch (error) {
        console.error('Error fetching gallery images:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Upload gallery image (Admin)
// @route   POST /api/gallery
// @access  Private/Admin
exports.uploadGalleryImage = async (req, res) => {
    try {
        const { title, caption, category } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload an image' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        const image = await GalleryImage.create({
            title,
            imageUrl,
            caption,
            category
        });

        await logAdminAction(req, {
            module: 'gallery',
            action: 'publish_content',
            targetType: 'gallery-image',
            targetId: image._id,
            targetLabel: image.title || image.caption || req.file.originalname,
            description: `Published gallery image "${image.title || image.caption || req.file.originalname}"`,
            details: {
                category: image.category,
                imageUrl: image.imageUrl,
            },
        });

        res.status(201).json({ success: true, data: image });
    } catch (error) {
        console.error('Error uploading gallery image:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete gallery image (Admin)
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
exports.deleteGalleryImage = async (req, res) => {
    try {
        const image = await GalleryImage.findById(req.params.id);

        if (!image) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }

        // Delete file
        const filePath = path.join(__dirname, '..', image.imageUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await image.deleteOne();

        await logAdminAction(req, {
            module: 'gallery',
            action: 'remove_content',
            targetType: 'gallery-image',
            targetId: image._id,
            targetLabel: image.title || image.caption || image.imageUrl,
            description: `Removed gallery image "${image.title || image.caption || image.imageUrl}"`,
            details: {
                category: image.category,
                imageUrl: image.imageUrl,
            },
        });

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error('Error deleting gallery image:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

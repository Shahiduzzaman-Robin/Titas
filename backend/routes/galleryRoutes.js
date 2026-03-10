const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protectAdmin, requireRoles } = require('../middleware/auth');
const allowContentAdmin = requireRoles('Super Admin', 'Admin', 'Content Admin');
const {
    getGalleryImages,
    uploadGalleryImage,
    deleteGalleryImage
} = require('../controllers/galleryController');

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `gallery-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`),
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (/jpeg|jpg|png|webp/.test(file.mimetype)) return cb(null, true);
        return cb(new Error('Images only (jpeg, jpg, png, webp)'));
    },
});

// Public Route
router.get('/', getGalleryImages);

// Admin Routes
router.post('/', protectAdmin, allowContentAdmin, upload.single('image'), uploadGalleryImage);
router.delete('/:id', protectAdmin, allowContentAdmin, deleteGalleryImage);

module.exports = router;

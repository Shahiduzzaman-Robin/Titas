const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    caption: {
        type: String
    },
    category: {
        type: String,
        default: 'General'
    }
}, { timestamps: true });

module.exports = mongoose.model('GalleryImage', galleryImageSchema);

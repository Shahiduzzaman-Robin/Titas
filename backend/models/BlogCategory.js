const mongoose = require('mongoose');

const blogCategorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },
        slug: { type: String, required: true, unique: true, trim: true },
        description: { type: String, default: '' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('BlogCategory', blogCategorySchema);

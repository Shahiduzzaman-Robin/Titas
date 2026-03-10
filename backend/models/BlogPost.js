const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, trim: true },
        content: { type: String, required: true },
        excerpt: { type: String, default: '' },
        featuredImage: { type: String, default: '' },
        author: { type: String, required: true, trim: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogCategory', required: true },
        tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlogTag' }],
        views: { type: Number, default: 0 },
        status: { type: String, enum: ['draft', 'published'], default: 'draft' },
        readingTime: { type: Number, default: 1 },
        publishedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

blogPostSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

module.exports = mongoose.model('BlogPost', blogPostSchema);

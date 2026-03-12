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
        comments: [
            {
                id: { type: String, default: () => `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` },
                name: { type: String, required: true, trim: true },
                email: { type: String, default: '', trim: true },
                text: { type: String, required: true, trim: true },
                likes: { type: Number, default: 0 },
                likedBy: [{ type: String }],
                approved: { type: Boolean, default: true },
                flagged: { type: Boolean, default: false },
                flagReason: { type: String, default: '', trim: true },
                createdAt: { type: Date, default: Date.now },
                updatedAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

blogPostSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

module.exports = mongoose.model('BlogPost', blogPostSchema);

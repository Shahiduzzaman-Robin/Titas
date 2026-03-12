const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const Admin = require('../models/Admin');
const BlogPost = require('../models/BlogPost');
const BlogCategory = require('../models/BlogCategory');
const BlogTag = require('../models/BlogTag');
const { logAdminAction } = require('../utils/auditLogger');

const router = express.Router();

const DEFAULT_CATEGORIES = [
    'Announcements',
    'Events',
    'Alumni Stories',
    'Career & Opportunities',
    'Student Life',
    'Articles',
];

const slugify = (value = '') =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

const stripHtml = (html = '') => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const calculateReadingTime = (content = '') => {
    const words = stripHtml(content).split(' ').filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 220));
};

const buildExcerpt = (content = '', maxLength = 180) => {
    const plain = stripHtml(content);
    if (plain.length <= maxLength) return plain;
    return `${plain.slice(0, maxLength).trim()}...`;
};

const generateUniqueSlug = async (Model, title, existingId = null) => {
    const base = slugify(title) || 'post';
    let slug = base;
    let counter = 1;

    while (true) {
        const existing = await Model.findOne({ slug });
        if (!existing || (existingId && String(existing._id) === String(existingId))) {
            return slug;
        }
        counter += 1;
        slug = `${base}-${counter}`;
    }
};

const seedDefaultCategories = async () => {
    for (const name of DEFAULT_CATEGORIES) {
        const slug = slugify(name);
        const exists = await BlogCategory.findOne({ slug });
        if (!exists) {
            await BlogCategory.create({ name, slug });
        }
    }
};

seedDefaultCategories().catch((err) => console.error('Category seed error:', err.message));

const { protectAdmin, requireRoles } = require('../middleware/auth');
const allowContentAdmin = requireRoles('Super Admin', 'Admin', 'Content Admin');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `blog-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`),
});

const upload = multer({
    storage,
    limits: { fileSize: 8 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (/jpeg|jpg|png|webp/.test(file.mimetype)) return cb(null, true);
        return cb(new Error('Images only (jpeg, jpg, png, webp)'));
    },
});

const parseTags = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) return parsed;
        } catch (error) {
            return value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean);
        }
    }
    return [];
};

router.get('/categories', async (req, res) => {
    try {
        const categories = await BlogCategory.find().sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.get('/tags', async (req, res) => {
    try {
        const tags = await BlogTag.find().sort({ name: 1 });
        res.json(tags);
    } catch (error) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.get('/posts/featured', async (req, res) => {
    try {
        const featured = await BlogPost.findOne({ status: 'published' })
            .populate('category', 'name slug')
            .populate('tags', 'name slug')
            .sort({ publishedAt: -1, createdAt: -1 });

        res.json(featured || null);
    } catch (error) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.get('/posts', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 6,
            search = '',
            category = '',
            status = 'published',
        } = req.query;

        const pageNumber = Math.max(1, parseInt(page, 10) || 1);
        const limitNumber = Math.min(24, Math.max(1, parseInt(limit, 10) || 6));

        const query = {};
        if (status) query.status = status;

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } },
            ];
        }

        if (category) {
            const categoryDoc = await BlogCategory.findOne({ slug: category });
            if (categoryDoc) {
                query.category = categoryDoc._id;
            } else {
                query.category = null;
            }
        }

        const total = await BlogPost.countDocuments(query);
        const posts = await BlogPost.find(query)
            .populate('category', 'name slug')
            .populate('tags', 'name slug')
            .sort({ publishedAt: -1, createdAt: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        res.json({
            posts,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                hasMore: pageNumber * limitNumber < total,
            },
        });
    } catch (error) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.get('/posts/:slug', async (req, res) => {
    try {
        const post = await BlogPost.findOne({ slug: req.params.slug, status: 'published' })
            .populate('category', 'name slug')
            .populate('tags', 'name slug');

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const related = await BlogPost.find({
            _id: { $ne: post._id },
            status: 'published',
            category: post.category?._id,
        })
            .sort({ publishedAt: -1, createdAt: -1 })
            .limit(3)
            .select('title slug excerpt featuredImage author publishedAt readingTime');

        return res.json({ post, related });
    } catch (error) {
        return res.status(500).json({ msg: 'Server Error' });
    }
});

router.post('/posts/:slug/view', async (req, res) => {
    try {
        const updated = await BlogPost.findOneAndUpdate(
            { slug: req.params.slug, status: 'published' },
            { $inc: { views: 1 } },
            { new: true }
        ).select('views');

        if (!updated) return res.status(404).json({ msg: 'Post not found' });
        return res.json({ views: updated.views });
    } catch (error) {
        return res.status(500).json({ msg: 'Server Error' });
    }
});

router.get('/admin/posts', protectAdmin, allowContentAdmin, async (req, res) => {
    try {
        const { status = '' } = req.query;
        const query = {};
        if (status) query.status = status;

        const posts = await BlogPost.find(query)
            .populate('category', 'name slug')
            .populate('tags', 'name slug')
            .sort({ updatedAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.get('/admin/posts/:id', protectAdmin, allowContentAdmin, async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id)
            .populate('category', 'name slug')
            .populate('tags', 'name slug');

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        return res.json(post);
    } catch (error) {
        return res.status(500).json({ msg: 'Server Error' });
    }
});

router.post('/admin/uploads/inline-images', protectAdmin, allowContentAdmin, upload.array('images', 10), async (req, res) => {
    try {
        const files = req.files || [];
        if (!files.length) {
            return res.status(400).json({ msg: 'At least one image file is required' });
        }

        const images = files.map((file) => ({
            url: `/uploads/${file.filename}`,
            name: file.originalname,
            size: file.size,
        }));

        return res.status(201).json({ images });
    } catch (error) {
        return res.status(500).json({ msg: error.message || 'Server Error' });
    }
});

router.post('/admin/posts', protectAdmin, allowContentAdmin, upload.single('featuredImage'), async (req, res) => {
    try {
        const { title, content, excerpt, author, category, status = 'draft' } = req.body;
        const tagIds = parseTags(req.body.tags);

        if (!title || !content || !category) {
            return res.status(400).json({ msg: 'Title, content and category are required' });
        }

        const slug = await generateUniqueSlug(BlogPost, title);
        const normalizedStatus = status === 'published' ? 'published' : 'draft';

        const post = await BlogPost.create({
            title,
            slug,
            content,
            excerpt: excerpt?.trim() || buildExcerpt(content),
            featuredImage: req.file ? `/uploads/${req.file.filename}` : '',
            author: author?.trim() || req.admin.username,
            category,
            tags: tagIds,
            status: normalizedStatus,
            readingTime: calculateReadingTime(content),
            publishedAt: normalizedStatus === 'published' ? new Date() : null,
        });

        const populated = await BlogPost.findById(post._id)
            .populate('category', 'name slug')
            .populate('tags', 'name slug');

        await logAdminAction(req, {
            module: 'blog',
            action: normalizedStatus === 'published' ? 'publish_content' : 'create_content',
            targetType: 'blog-post',
            targetId: populated._id,
            targetLabel: populated.title,
            description: `${normalizedStatus === 'published' ? 'Published' : 'Created'} blog post "${populated.title}"`,
            details: {
                status: populated.status,
                category: populated.category?.name || '',
                author: populated.author,
            },
        });

        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ msg: error.message || 'Server Error' });
    }
});

router.put('/admin/posts/:id', protectAdmin, allowContentAdmin, upload.single('featuredImage'), async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        const beforeState = {
            title: post.title,
            status: post.status,
            category: post.category,
            author: post.author,
        };

        const { title, content, excerpt, author, category, status } = req.body;
        const tagIds = parseTags(req.body.tags);

        if (title && title !== post.title) {
            post.title = title;
            post.slug = await generateUniqueSlug(BlogPost, title, post._id);
        }

        if (content !== undefined) {
            post.content = content;
            post.readingTime = calculateReadingTime(content);
            if (!excerpt) post.excerpt = buildExcerpt(content);
        }

        if (excerpt !== undefined) post.excerpt = excerpt;
        if (author !== undefined) post.author = author || req.admin.username;
        if (category) post.category = category;
        if (Array.isArray(tagIds)) post.tags = tagIds;

        if (status) {
            const normalizedStatus = status === 'published' ? 'published' : 'draft';
            if (post.status !== 'published' && normalizedStatus === 'published') {
                post.publishedAt = new Date();
            }
            if (normalizedStatus === 'draft') {
                post.publishedAt = null;
            }
            post.status = normalizedStatus;
        }

        if (req.file) {
            post.featuredImage = `/uploads/${req.file.filename}`;
        }

        await post.save();

        const updated = await BlogPost.findById(post._id)
            .populate('category', 'name slug')
            .populate('tags', 'name slug');

        const action = beforeState.status !== 'published' && updated.status === 'published'
            ? 'publish_content'
            : (beforeState.status === 'published' && updated.status !== 'published'
                ? 'unpublish_content'
                : 'update_content');

        await logAdminAction(req, {
            module: 'blog',
            action,
            targetType: 'blog-post',
            targetId: updated._id,
            targetLabel: updated.title,
            description: `${action.replace(/_/g, ' ')} for blog post "${updated.title}"`,
            details: {
                before: beforeState,
                after: {
                    title: updated.title,
                    status: updated.status,
                    category: updated.category?.name || '',
                    author: updated.author,
                },
            },
        });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ msg: error.message || 'Server Error' });
    }
});

router.delete('/admin/posts/:id', protectAdmin, allowContentAdmin, async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        const deletedSnapshot = {
            title: post.title,
            slug: post.slug,
            status: post.status,
            author: post.author,
        };

        await post.deleteOne();

        await logAdminAction(req, {
            module: 'blog',
            action: 'remove_content',
            targetType: 'blog-post',
            targetId: req.params.id,
            targetLabel: deletedSnapshot.title,
            description: `Removed blog post "${deletedSnapshot.title}"`,
            details: deletedSnapshot,
        });

        res.json({ msg: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.get('/admin/categories', protectAdmin, allowContentAdmin, async (req, res) => {
    try {
        const categories = await BlogCategory.find().sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.post('/admin/categories', protectAdmin, allowContentAdmin, async (req, res) => {
    try {
        const { name, description = '' } = req.body;
        if (!name) return res.status(400).json({ msg: 'Category name is required' });

        const slug = await generateUniqueSlug(BlogCategory, name);
        const category = await BlogCategory.create({ name, slug, description });

        await logAdminAction(req, {
            module: 'blog',
            action: 'create_category',
            targetType: 'blog-category',
            targetId: category._id,
            targetLabel: category.name,
            description: `Created blog category "${category.name}"`,
            details: {
                slug: category.slug,
                description: category.description || '',
            },
        });

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ msg: error.message || 'Server Error' });
    }
});

router.put('/admin/categories/:id', protectAdmin, allowContentAdmin, async (req, res) => {
    try {
        const category = await BlogCategory.findById(req.params.id);
        if (!category) return res.status(404).json({ msg: 'Category not found' });

        const before = {
            name: category.name,
            slug: category.slug,
            description: category.description || '',
        };

        const { name, description } = req.body;
        if (name && name !== category.name) {
            category.name = name;
            category.slug = await generateUniqueSlug(BlogCategory, name, category._id);
        }
        if (description !== undefined) category.description = description;

        await category.save();

        await logAdminAction(req, {
            module: 'blog',
            action: 'update_category',
            targetType: 'blog-category',
            targetId: category._id,
            targetLabel: category.name,
            description: `Updated blog category "${category.name}"`,
            details: {
                before,
                after: {
                    name: category.name,
                    slug: category.slug,
                    description: category.description || '',
                },
            },
        });

        res.json(category);
    } catch (error) {
        res.status(500).json({ msg: error.message || 'Server Error' });
    }
});

router.delete('/admin/categories/:id', protectAdmin, allowContentAdmin, async (req, res) => {
    try {
        const inUse = await BlogPost.countDocuments({ category: req.params.id });
        if (inUse > 0) {
            return res.status(400).json({ msg: 'Cannot delete category used by posts' });
        }

        const category = await BlogCategory.findById(req.params.id);
        await BlogCategory.findByIdAndDelete(req.params.id);

        await logAdminAction(req, {
            module: 'blog',
            action: 'delete_category',
            targetType: 'blog-category',
            targetId: req.params.id,
            targetLabel: category?.name || req.params.id,
            description: `Deleted blog category "${category?.name || req.params.id}"`,
            details: {
                slug: category?.slug || '',
            },
        });

        res.json({ msg: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.get('/admin/tags', protectAdmin, allowContentAdmin, async (req, res) => {
    try {
        const tags = await BlogTag.find().sort({ name: 1 });
        res.json(tags);
    } catch (error) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.post('/admin/tags', protectAdmin, allowContentAdmin, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ msg: 'Tag name is required' });

        const slug = await generateUniqueSlug(BlogTag, name);
        const tag = await BlogTag.create({ name, slug });

        await logAdminAction(req, {
            module: 'blog',
            action: 'create_tag',
            targetType: 'blog-tag',
            targetId: tag._id,
            targetLabel: tag.name,
            description: `Created blog tag "${tag.name}"`,
            details: {
                slug: tag.slug,
            },
        });

        res.status(201).json(tag);
    } catch (error) {
        res.status(500).json({ msg: error.message || 'Server Error' });
    }
});

router.put('/admin/tags/:id', protectAdmin, allowContentAdmin, async (req, res) => {
    try {
        const tag = await BlogTag.findById(req.params.id);
        if (!tag) return res.status(404).json({ msg: 'Tag not found' });

        const before = {
            name: tag.name,
            slug: tag.slug,
        };

        const { name } = req.body;
        if (name && name !== tag.name) {
            tag.name = name;
            tag.slug = await generateUniqueSlug(BlogTag, name, tag._id);
        }

        await tag.save();

        await logAdminAction(req, {
            module: 'blog',
            action: 'update_tag',
            targetType: 'blog-tag',
            targetId: tag._id,
            targetLabel: tag.name,
            description: `Updated blog tag "${tag.name}"`,
            details: {
                before,
                after: {
                    name: tag.name,
                    slug: tag.slug,
                },
            },
        });

        res.json(tag);
    } catch (error) {
        res.status(500).json({ msg: error.message || 'Server Error' });
    }
});

router.delete('/admin/tags/:id', protectAdmin, allowContentAdmin, async (req, res) => {
    try {
        const tag = await BlogTag.findById(req.params.id);
        await BlogPost.updateMany({}, { $pull: { tags: req.params.id } });
        await BlogTag.findByIdAndDelete(req.params.id);

        await logAdminAction(req, {
            module: 'blog',
            action: 'delete_tag',
            targetType: 'blog-tag',
            targetId: req.params.id,
            targetLabel: tag?.name || req.params.id,
            description: `Deleted blog tag "${tag?.name || req.params.id}"`,
            details: {
                slug: tag?.slug || '',
            },
        });

        res.json({ msg: 'Tag deleted successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Fetch comments for a blog post
router.get('/posts/:slug/comments', async (req, res) => {
    try {
        const post = await BlogPost.findOne({ slug: req.params.slug }).select('comments');
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.json({
            comments: post.comments || [],
            total: (post.comments || []).length,
        });
    } catch (error) {
        res.status(500).json({ msg: error.message || 'Server Error' });
    }
});

// Add a comment to a blog post
router.post('/posts/:slug/comments', async (req, res) => {
    try {
        const { name, text, email = '', action, commentId } = req.body;

        // If this is a like action routed to the same POST endpoint, handle it here
        if (action === 'like' && commentId) {
            const clientId = req.body.clientId || null;
            const postForLike = await BlogPost.findOne({ slug: req.params.slug });
            if (!postForLike) return res.status(404).json({ msg: 'Post not found' });

            const commentForLike = postForLike.comments.find((c) => (c.id && String(c.id) === String(commentId)) || (c._id && String(c._id) === String(commentId)));
            if (!commentForLike) return res.status(404).json({ msg: 'Comment not found' });

            commentForLike.likedBy = commentForLike.likedBy || [];
            if (clientId && commentForLike.likedBy.includes(String(clientId))) {
                return res.json({ msg: 'Already liked', likes: commentForLike.likes || 0, comment: commentForLike });
            }
            if (clientId) commentForLike.likedBy.push(String(clientId));

            commentForLike.likes = (commentForLike.likes || 0) + 1;
            commentForLike.updatedAt = new Date();
            await postForLike.save();

            return res.json({ msg: 'Comment liked', likes: commentForLike.likes, comment: commentForLike });
        }

        // Otherwise proceed with adding a comment

        if (!name || !String(name).trim()) {
            return res.status(400).json({ msg: 'Name is required' });
        }
        if (!text || !String(text).trim()) {
            return res.status(400).json({ msg: 'Comment text is required' });
        }

        // Sanitize inputs to prevent XSS
        const sanitize = (str) => String(str).replace(/[<>]/g, '');

        const post = await BlogPost.findOne({ slug: req.params.slug });
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const newComment = {
            id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: sanitize(name).trim(),
            email: sanitize(email).trim(),
            text: sanitize(text).trim(),
            approved: true,
            flagged: false,
            flagReason: '',
            likes: 0,
            likedBy: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        post.comments.push(newComment);
        await post.save();

        res.status(201).json({
            msg: 'Comment added successfully',
            comment: newComment,
        });
    } catch (error) {
        res.status(500).json({ msg: error.message || 'Server Error' });
    }
});

// Like a comment (increment likes)
router.post('/posts/:slug/comments/:commentId/like', async (req, res) => {
    try {
        const clientId = req.body.clientId || req.query.clientId || null;
        const post = await BlogPost.findOne({ slug: req.params.slug });
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        const comment = post.comments.find((c) => (c.id && String(c.id) === String(req.params.commentId)) || (c._id && String(c._id) === String(req.params.commentId)));
        if (!comment) return res.status(404).json({ msg: 'Comment not found' });

        // If clientId provided, prevent duplicate likes
        if (clientId) {
            comment.likedBy = comment.likedBy || [];
            if (comment.likedBy.includes(String(clientId))) {
                return res.json({ msg: 'Already liked', likes: comment.likes || 0, comment });
            }
            comment.likedBy.push(String(clientId));
        }

        comment.likes = (comment.likes || 0) + 1;
        comment.updatedAt = new Date();
        await post.save();

        res.json({ msg: 'Comment liked', likes: comment.likes, comment });
    } catch (error) {
        res.status(500).json({ msg: error.message || 'Server Error' });
    }
});

// Like a comment (alternate: accept commentId in request body)
router.post('/posts/:slug/comments/like', async (req, res) => {
    try {
        const { commentId } = req.body || {};
        if (!commentId) return res.status(400).json({ msg: 'commentId is required' });

        const post = await BlogPost.findOne({ slug: req.params.slug });
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        const comment = post.comments.find((c) => (c.id && String(c.id) === String(commentId)) || (c._id && String(c._id) === String(commentId)));
        if (!comment) return res.status(404).json({ msg: 'Comment not found' });

        comment.likes = (comment.likes || 0) + 1;
        comment.updatedAt = new Date();
        await post.save();

        res.json({ msg: 'Comment liked', likes: comment.likes, comment });
    } catch (error) {
        res.status(500).json({ msg: error.message || 'Server Error' });
    }
});

// ============================================================================
// ADMIN COMMENT MANAGEMENT ENDPOINTS
// ============================================================================

// Get all comments for a specific post (admin)
router.get('/admin/posts/:postId/comments', protectAdmin, allowContentAdmin, async (req, res) => {
    try {
        const { status = 'all' } = req.query;
        const post = await BlogPost.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        let comments = post.comments || [];

        if (status === 'pending') {
            comments = comments.filter(c => !c.approved);
        } else if (status === 'approved') {
            comments = comments.filter(c => c.approved);
        } else if (status === 'flagged') {
            comments = comments.filter(c => c.flagged);
        }

        comments = comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({
            post: {
                _id: post._id,
                title: post.title,
                slug: post.slug,
            },
            comments,
            summary: {
                total: post.comments?.length || 0,
                approved: (post.comments || []).filter(c => c.approved).length,
                pending: (post.comments || []).filter(c => !c.approved).length,
                flagged: (post.comments || []).filter(c => c.flagged).length,
            },
        });
    } catch (error) {
        res.status(500).json({ msg: error.message || 'Server Error' });
    }
});

// Get all comments across all posts (admin)
router.get('/admin/comments', protectAdmin, allowContentAdmin, async (req, res) => {
    try {
        const { status = 'all', limit = 50, page = 1 } = req.query;
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));

        const pipeline = [
            { $match: { comments: { $exists: true, $ne: [] } } },
            { $unwind: '$comments' },
        ];

        if (status === 'pending') {
            pipeline.push({ $match: { 'comments.approved': false } });
        } else if (status === 'approved') {
            pipeline.push({ $match: { 'comments.approved': true } });
        } else if (status === 'flagged') {
            pipeline.push({ $match: { 'comments.flagged': true } });
        }

        pipeline.push(
            { $sort: { 'comments.createdAt': -1 } },
            {
                $project: {
                    _id: 0,
                    postId: '$_id',
                    postTitle: '$title',
                    postSlug: '$slug',
                    comment: '$comments',
                },
            },
            { $skip: (pageNum - 1) * limitNum },
            { $limit: limitNum }
        );

        const comments = await BlogPost.aggregate(pipeline);

        const totalPipeline = [
            { $match: { comments: { $exists: true, $ne: [] } } },
            { $unwind: '$comments' },
        ];
        if (status === 'pending') {
            totalPipeline.push({ $match: { 'comments.approved': false } });
        } else if (status === 'approved') {
            totalPipeline.push({ $match: { 'comments.approved': true } });
        } else if (status === 'flagged') {
            totalPipeline.push({ $match: { 'comments.flagged': true } });
        }
        totalPipeline.push({ $count: 'total' });

        const totalResult = await BlogPost.aggregate(totalPipeline);
        const total = totalResult[0]?.total || 0;

        res.json({
            comments,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                hasMore: pageNum * limitNum < total,
            },
        });
    } catch (error) {
        res.status(500).json({ msg: error.message || 'Server Error' });
    }
});

// Delete a comment (admin)
router.delete('/admin/posts/:postId/comments/:commentId', protectAdmin, allowContentAdmin, async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const commentIndex = post.comments.findIndex(c => c.id === req.params.commentId);
        if (commentIndex === -1) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        const deletedComment = post.comments[commentIndex];
        post.comments.splice(commentIndex, 1);
        await post.save();

        await logAdminAction(req, {
            module: 'blog',
            action: 'delete_comment',
            targetType: 'blog-comment',
            targetId: req.params.commentId,
            targetLabel: `Comment by ${deletedComment.name}`,
            description: `Deleted comment on blog post "${post.title}"`,
            details: {
                postId: post._id,
                postTitle: post.title,
                authorName: deletedComment.name,
                authorEmail: deletedComment.email,
                text: deletedComment.text.substring(0, 100),
                approved: deletedComment.approved,
                flagged: deletedComment.flagged,
            },
        });

        res.json({ msg: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ msg: error.message || 'Server Error' });
    }
});

// Approve/unapprove a comment (admin)
router.patch('/admin/posts/:postId/comments/:commentId/approve', protectAdmin, allowContentAdmin, async (req, res) => {
    try {
        const { approved } = req.body;

        if (typeof approved !== 'boolean') {
            return res.status(400).json({ msg: 'Approved field must be boolean' });
        }

        const post = await BlogPost.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const comment = post.comments.find(c => c.id === req.params.commentId);
        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        const wasApproved = comment.approved;
        comment.approved = approved;
        comment.updatedAt = new Date();
        await post.save();

        await logAdminAction(req, {
            module: 'blog',
            action: 'update_comment_approval',
            targetType: 'blog-comment',
            targetId: req.params.commentId,
            targetLabel: `Comment by ${comment.name}`,
            description: `${approved ? 'Approved' : 'Unapproved'} comment on blog post "${post.title}"`,
            details: {
                postId: post._id,
                postTitle: post.title,
                before: { approved: wasApproved },
                after: { approved },
            },
        });

        res.json({
            msg: `Comment ${approved ? 'approved' : 'unapproved'} successfully`,
            comment,
        });
    } catch (error) {
        res.status(500).json({ msg: error.message || 'Server Error' });
    }
});

// Flag/unflag a comment (spam, inappropriate, etc.)
router.patch('/admin/posts/:postId/comments/:commentId/flag', protectAdmin, allowContentAdmin, async (req, res) => {
    try {
        const { flagged, flagReason = '' } = req.body;

        if (typeof flagged !== 'boolean') {
            return res.status(400).json({ msg: 'Flagged field must be boolean' });
        }

        const post = await BlogPost.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const comment = post.comments.find(c => c.id === req.params.commentId);
        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        const wasFlagged = comment.flagged;
        comment.flagged = flagged;
        comment.flagReason = flagged ? flagReason.trim() : '';
        comment.updatedAt = new Date();
        await post.save();

        await logAdminAction(req, {
            module: 'blog',
            action: flagged ? 'flag_comment' : 'unflag_comment',
            targetType: 'blog-comment',
            targetId: req.params.commentId,
            targetLabel: `Comment by ${comment.name}`,
            description: `${flagged ? 'Flagged' : 'Unflagged'} comment on blog post "${post.title}"${flagged ? ` (Reason: ${flagReason})` : ''}`,
            details: {
                postId: post._id,
                postTitle: post.title,
                before: { flagged: wasFlagged, flagReason: comment.flagReason },
                after: { flagged, flagReason },
            },
        });

        res.json({
            msg: `Comment ${flagged ? 'flagged' : 'unflagged'} successfully`,
            comment,
        });
    } catch (error) {
        res.status(500).json({ msg: error.message || 'Server Error' });
    }
});

module.exports = router;

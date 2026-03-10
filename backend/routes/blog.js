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

module.exports = router;

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const studentRoutes = require('./routes/students');
const adminRoutes = require('./routes/admin');
const blogRoutes = require('./routes/blog');
const contactRoutes = require('./routes/contactRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const eventRoutes = require('./routes/eventRoutes');
const BlogPost = require('./models/BlogPost');
const { sendUpcomingEventReminders } = require('./utils/eventReminderService');

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
}));
app.use(express.json());
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`${req.method} ${req.url} - ${res.statusCode}`);
    });
    next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const escapeHtml = (value = '') =>
    String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

app.get('/share/blog/:slug', async (req, res) => {
    try {
        const frontendOrigin = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
        const backendOrigin = (process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5002}`).replace(/\/$/, '');
        const canonicalUrl = `${frontendOrigin}/blog/${encodeURIComponent(req.params.slug)}`;

        const post = await BlogPost.findOne({ slug: req.params.slug, status: 'published' })
            .populate('category', 'name')
            .lean();

        const fallbackImage = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1400&q=80';
        const title = post?.title || 'Titas Blog';
        const description = post?.excerpt || 'Stories, updates, and opportunities from the Titas community.';
        const imageUrl = post?.featuredImage
            ? (post.featuredImage.startsWith('http') ? post.featuredImage : `${backendOrigin}${post.featuredImage}`)
            : fallbackImage;

        const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />

  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Titas" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${escapeHtml(imageUrl)}" />
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />

  <meta http-equiv="refresh" content="0;url=${escapeHtml(canonicalUrl)}" />
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
</head>
<body>
  <p>Redirecting to <a href="${escapeHtml(canonicalUrl)}">${escapeHtml(canonicalUrl)}</a>...</p>
  <script>window.location.replace(${JSON.stringify(canonicalUrl)});</script>
</body>
</html>`;

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.status(200).send(html);
    } catch (error) {
        return res.status(500).send('Unable to build share preview');
    }
});

// MongoDB// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/titas_clone')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/events', eventRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err);
    res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    const reminderEnabled = String(process.env.EVENT_REMINDER_JOB_ENABLED || 'true').toLowerCase() !== 'false';
    if (reminderEnabled) {
        const intervalHours = Number(process.env.EVENT_REMINDER_JOB_INTERVAL_HOURS || 6);
        const daysAhead = Number(process.env.EVENT_REMINDER_DAYS_AHEAD || 1);
        const intervalMs = Math.max(1, intervalHours) * 60 * 60 * 1000;

        setTimeout(async () => {
            try {
                const stats = await sendUpcomingEventReminders({ daysAhead });
                console.log('Initial event reminder job completed:', stats);
            } catch (error) {
                console.error('Initial event reminder job failed:', error.message);
            }
        }, 15000);

        setInterval(async () => {
            try {
                const stats = await sendUpcomingEventReminders({ daysAhead });
                console.log('Scheduled event reminder job completed:', stats);
            } catch (error) {
                console.error('Scheduled event reminder job failed:', error.message);
            }
        }, intervalMs);
    }
});

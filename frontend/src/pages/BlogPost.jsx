import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { Calendar, User, Tag, Eye, Facebook, Linkedin, MessageCircle, Clock3, ArrowLeft, ArrowRight } from 'lucide-react';
import '../styles/Blog.css';

const API_BASE = `${API_BASE_URL}/api/blog`;
const BACKEND_BASE = (import.meta.env.VITE_BACKEND_URL || API_BASE_URL).replace(/\/$/, '');

const formatDate = (value) => {
    if (!value) return 'Draft';
    return new Date(value).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [related, setRelated] = useState([]);
    const [adjacentPosts, setAdjacentPosts] = useState({ previous: null, next: null });
    const [comments, setComments] = useState([]);
    const [commentForm, setCommentForm] = useState({ name: '', text: '' });
    const [loading, setLoading] = useState(true);
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_BASE}/posts/${slug}`);
                setPost(res.data?.post || null);
                setRelated(res.data?.related || []);

                try {
                    const listRes = await axios.get(`${API_BASE}/posts`, {
                        params: { page: 1, limit: 100 },
                    });

                    const allPosts = listRes.data?.posts || [];
                    const index = allPosts.findIndex((item) => item.slug === slug);
                    setAdjacentPosts({
                        previous: index >= 0 ? allPosts[index + 1] || null : null,
                        next: index > 0 ? allPosts[index - 1] || null : null,
                    });
                } catch (listErr) {
                    setAdjacentPosts({ previous: null, next: null });
                }

                await axios.post(`${API_BASE}/posts/${slug}/view`);

                // Fetch comments for the post
                try {
                    const commentsRes = await axios.get(`${API_BASE}/posts/${slug}/comments`);
                    setComments(commentsRes.data?.comments || []);
                } catch (commErr) {
                    setComments([]);
                }
            } catch (error) {
                console.error('Failed to fetch post:', error);
                setPost(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    useEffect(() => {
        if (post) {
            // Update Document Title
            document.title = `${post.title} | Titas Blog`;

            // Update Open Graph Meta Tags dynamically for client-side scraping
            const ogTitle = document.getElementById('og-title');
            const ogDesc = document.getElementById('og-description');
            const ogImage = document.getElementById('og-image');
            const ogUrl = document.getElementById('og-url');

            if (ogTitle) ogTitle.setAttribute('content', post.title);
            if (ogDesc) ogDesc.setAttribute('content', post.excerpt || 'Read this post on Titas Community Hub.');
            if (ogImage && post.featuredImage) {
                ogImage.setAttribute('content', `${API_BASE_URL}${post.featuredImage}`);
            }
            if (ogUrl) ogUrl.setAttribute('content', window.location.href);

            // Cleanup function to reset title when component unmounts
            return () => {
                document.title = 'Titas | Dhaka University';
            };
        }
    }, [post]);

    const authorInitial = useMemo(() => {
        if (!post?.author) return 'T';
        const clean = String(post.author).trim();
        return clean ? clean.charAt(0).toUpperCase() : 'T';
    }, [post]);

    const shareUrl = window.location.href;
    const sharePreviewUrl = `${BACKEND_BASE}/share/blog/${encodeURIComponent(slug || '')}`;
    const shareTitle = post ? encodeURIComponent(post.title) : '';

    const shareLinks = [
        {
            label: 'Facebook',
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sharePreviewUrl)}`,
            icon: <Facebook size={16} />,
        },
        {
            label: 'LinkedIn',
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(sharePreviewUrl)}`,
            icon: <Linkedin size={16} />,
        },
        {
            label: 'WhatsApp',
            href: `https://api.whatsapp.com/send?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`,
            icon: <MessageCircle size={16} />,
        },
    ];

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const name = commentForm.name.trim();
        const text = commentForm.text.trim();
        if (!name || !text) return;

        setSubmittingComment(true);
        try {
            const res = await axios.post(`${API_BASE}/posts/${slug}/comments`, {
                name,
                text,
            });

            const newComment = res.data?.comment || {
                id: `comment-${Date.now()}`,
                name,
                text,
                createdAt: new Date().toISOString(),
            };

            setComments((prev) => [newComment, ...prev]);
            setCommentForm({ name: '', text: '' });
        } catch (error) {
            console.error('Failed to submit comment:', error);
            alert(error.response?.data?.msg || 'Failed to post comment. Please try again.');
        } finally {
            setSubmittingComment(false);
        }
    };

    if (loading) {
        return <div className="container blog-post-feedback">Loading post...</div>;
    }

    if (!post) {
        return <div className="container blog-post-feedback">Post not found.</div>;
    }

    return (
        <div className="blog-post-page">
            <div className="container blog-post-layout">
                <article className="blog-post-shell">
                    <header className="post-header-card modern-surface">
                        <div className="blog-post-topbar">
                            <Link to="/blog" className="blog-back-link">
                                <ArrowLeft size={16} /> Back to stories
                            </Link>
                            <span className="post-category-pill">{post.category?.name || 'General'}</span>
                        </div>

                        <h1>{post.title}</h1>

                        {!!post.excerpt && <p className="blog-post-excerpt">{post.excerpt}</p>}

                        <div className="post-meta-row modern">
                            <span><User size={14} /> {post.author}</span>
                            <span><Calendar size={14} /> {formatDate(post.publishedAt)}</span>
                            <span><Clock3 size={14} /> {post.readingTime} min read</span>
                            <span><Eye size={14} /> {post.views || 0} views</span>
                        </div>

                        <img
                            src={post.featuredImage ? `${API_BASE_URL}${post.featuredImage}` : 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1400&q=80'}
                            alt={post.title}
                            className="blog-post-cover"
                        />
                    </header>

                    <section className="post-content-card modern-surface">
                        <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post.content }} />

                        <div className="post-support-meta">
                            <div className="post-taxonomy">
                                <span className="taxonomy-label">Category:</span>
                                <span className="taxonomy-chip">{post.category?.name || 'General'}</span>
                            </div>

                            {!!(post.tags || []).length && (
                                <div className="post-taxonomy">
                                    <Tag size={16} />
                                    {(post.tags || []).map((tag) => (
                                        <span key={tag._id} className="taxonomy-chip">#{tag.name}</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="share-wrap">
                            <h4>Share this article</h4>
                            <div className="share-buttons">
                                {shareLinks.map((item) => (
                                    <button key={item.label} onClick={() => window.open(item.href, '_blank', 'noopener,noreferrer')}>
                                        {item.icon}
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="author-box modern-surface">
                            <div className="author-avatar">{authorInitial}</div>
                            <div>
                                <p className="author-label">Written by</p>
                                <h4>{post.author}</h4>
                                <p>
                                    {post.author} shares insights, updates, and practical perspectives to support students and community members.
                                </p>
                            </div>
                        </div>
                    </section>
                </article>

                {(adjacentPosts.previous || adjacentPosts.next) && (
                    <section className="post-nav-grid">
                        {adjacentPosts.previous ? (
                            <Link to={`/blog/${adjacentPosts.previous.slug}`} className="post-nav-card modern-surface">
                                <span>Previous Post</span>
                                <h4>{adjacentPosts.previous.title}</h4>
                            </Link>
                        ) : <div />}
                        {adjacentPosts.next ? (
                            <Link to={`/blog/${adjacentPosts.next.slug}`} className="post-nav-card modern-surface align-right">
                                <span>Next Post</span>
                                <h4>{adjacentPosts.next.title}</h4>
                                <ArrowRight size={16} />
                            </Link>
                        ) : <div />}
                    </section>
                )}

                <section className="comments-wrap modern-surface">
                    <div className="comments-header">
                        <h3>Comments</h3>
                        <span>{comments.length} discussion{comments.length > 1 ? 's' : ''}</span>
                    </div>

                    <form className="comment-form" onSubmit={handleCommentSubmit}>
                        <input
                            type="text"
                            value={commentForm.name}
                            onChange={(e) => setCommentForm((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Your name"
                        />
                        <textarea
                            value={commentForm.text}
                            onChange={(e) => setCommentForm((prev) => ({ ...prev, text: e.target.value }))}
                            placeholder="Write a thoughtful comment..."
                            rows={4}
                        />
                        <button type="submit" disabled={submittingComment}>
                            {submittingComment ? 'Posting...' : 'Post Comment'}
                        </button>
                    </form>

                    <div className="comment-list">
                        {comments.map((item) => (
                            <article key={item.id} className="comment-item">
                                <div className="comment-avatar">{String(item.name || 'U').charAt(0).toUpperCase()}</div>
                                <div>
                                    <div className="comment-meta">
                                        <strong>{item.name}</strong>
                                        <span>{formatDate(item.createdAt)}</span>
                                    </div>
                                    <p>{item.text}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>

            {related.length > 0 && (
                <section className="container related-posts-wrap">
                    <div className="related-posts-header">
                        <h3>Related Posts</h3>
                        <Link to="/blog" className="related-view-all">View all stories</Link>
                    </div>
                    <div className="posts-grid">
                        {related.map((item) => (
                            <article key={item._id} className="blog-card modern-surface">
                                <div className="blog-card-image-wrap">
                                    <img
                                        src={item.featuredImage ? `${API_BASE_URL}${item.featuredImage}` : 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80'}
                                        alt={item.title}
                                        className="blog-card-image"
                                    />
                                </div>
                                <div className="blog-card-body">
                                    <h3>{item.title}</h3>
                                    <p>{item.excerpt}</p>
                                    <Link to={`/blog/${item.slug}`} className="read-more-btn">Read More</Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default BlogPost;

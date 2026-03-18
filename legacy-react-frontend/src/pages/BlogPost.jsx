import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import CustomSelect from '../components/CustomSelect';
import { API_BASE_URL } from '../constants';
import { Calendar, User, Tag, Eye, Facebook, Linkedin, MessageCircle, Clock3, ArrowLeft, ArrowRight } from 'lucide-react';
import '../styles/Blog.css';

const API_BASE = `${API_BASE_URL}/api/blog`;
const BACKEND_BASE = (import.meta.env.VITE_BACKEND_URL || API_BASE_URL).replace(/\/$/, '');

const formatDate = (value, withTime = false) => {
    if (!value) return 'Draft';
    try {
        const d = new Date(value);
        if (withTime) {
            return d.toLocaleString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });
        }
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch (e) {
        return String(value);
    }
};

const timeAgo = (value) => {
    if (!value) return '';
    try {
        const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;
        const days = Math.floor(hours / 24);
        return `${days}d`;
    } catch (e) {
        return '';
    }
};

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [related, setRelated] = useState([]);
    const [adjacentPosts, setAdjacentPosts] = useState({ previous: null, next: null });
    const [comments, setComments] = useState([]);
    const [sortBy, setSortBy] = useState('relevant'); // 'relevant', 'newest', 'oldest'
    const [commentForm, setCommentForm] = useState({ name: '', text: '' });
    const [loading, setLoading] = useState(true);
    const [submittingComment, setSubmittingComment] = useState(false);
    const mainInputRef = useRef(null);
    const viewCountedFor = useRef(null);

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

                if (viewCountedFor.current !== slug) {
                    await axios.post(`${API_BASE}/posts/${slug}/view`);
                    viewCountedFor.current = slug;
                }

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

    const sortedComments = useMemo(() => {
        const items = [...comments];
        if (sortBy === 'relevant') {
            return items.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        } else if (sortBy === 'newest') {
            return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'oldest') {
            return items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
        return items;
    }, [comments, sortBy]);

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

    const handleCommentSubmit = async ({ name, text }) => {
        if (!text || !text.trim()) return null;
        const author = (name && name.trim()) || 'You';
        setSubmittingComment(true);
        try {
            const res = await axios.post(`${API_BASE}/posts/${slug}/comments`, {
                name: author,
                text,
            });

            const newComment = res.data?.comment || {
                id: `comment-${Date.now()}`,
                name: author,
                text,
                createdAt: new Date().toISOString(),
                likes: 0,
                likedBy: [],
            };

            setComments((prev) => [newComment, ...prev]);
            return newComment;
        } catch (error) {
            console.error('Failed to submit comment:', error);
            return null;
        } finally {
            setSubmittingComment(false);
        }
    };

    const handlePost = async () => {
        const el = mainInputRef.current;
        const text = el?.innerText?.trim() || '';
        if (!text) return;
        const created = await handleCommentSubmit({ name: commentForm.name, text });
        if (created) {
            if (el) el.innerText = '';
        }
    };

    const getClientId = () => {
        try {
            let id = localStorage.getItem('titas_client_id');
            if (!id) {
                id = `c_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
                localStorage.setItem('titas_client_id', id);
            }
            return id;
        } catch (e) {
            return null;
        }
    };

    const clientId = getClientId();

    const handleLike = async (commentIdOrObj) => {
        const commentId = typeof commentIdOrObj === 'string' ? commentIdOrObj : (commentIdOrObj?.id || commentIdOrObj?._id);
        if (!commentId) return;
        const clientId = getClientId();
        try {
            // Optimistically toggle locally then notify server
            setComments((prev) => prev.map((c) => {
                const cid = c.id || c._id;
                if (String(cid) !== String(commentId)) return c;
                const likedBy = Array.isArray(c.likedBy) ? [...c.likedBy] : [];
                const already = clientId && likedBy.includes(clientId);
                if (already) {
                    // unlike
                    const idx = likedBy.indexOf(clientId);
                    if (idx >= 0) likedBy.splice(idx, 1);
                    return { ...c, likes: Math.max(0, (c.likes || 0) - 1), likedBy };
                }
                // like
                likedBy.push(clientId);
                return { ...c, likes: (c.likes || 0) + 1, likedBy };
            }));

            const res = await axios.post(`${API_BASE}/posts/${slug}/comments`, { action: 'like', commentId, clientId });
            const updatedComment = res.data?.comment;
            if (updatedComment) {
                setComments((prev) => prev.map((c) => (String(c.id || c._id) === String(commentId) ? { ...c, likes: updatedComment.likes, likedBy: updatedComment.likedBy || [] } : c)));
            }
            // Persist local hint to quickly disable UI if server accepted the like
            try {
                const likedSet = JSON.parse(localStorage.getItem('titas_liked_comments') || '[]');
                if (!likedSet.includes(commentId)) {
                    likedSet.push(commentId);
                    localStorage.setItem('titas_liked_comments', JSON.stringify(likedSet));
                }
            } catch (e) {}
        } catch (err) {
            console.error('Like failed', err);
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
                                    loading="lazy"
                                    decoding="async"
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
                        <div className="comments-header-left">
                            <h3>Comments</h3>
                            <span>{comments.length} discussion{comments.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="comments-sorting">
                            <CustomSelect 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value)}
                                options={[
                                    { value: 'relevant', label: 'Most Relevant' },
                                    { value: 'newest', label: 'Newest' },
                                    { value: 'oldest', label: 'Oldest' }
                                ]}
                                className="sorting-custom-select"
                                required
                            />
                        </div>
                    </div>

                    <div className="comment-form-fb">
                        <div className="comment-form-avatar">
                            {String(commentForm.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="comment-form-main">
                            <div className="comment-form-bubble">
                                <div
                                    ref={mainInputRef}
                                    contentEditable
                                    className="comment-form-input"
                                    data-placeholder="Write a comment..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handlePost();
                                        }
                                    }}
                                />
                                <div className="comment-form-divider" />
                                <div className="comment-form-footer">
                                    <div className="comment-form-actions">
                                        {/* Actions could be added here in the future (Emojis, Photos, etc.) */}
                                    </div>
                                    <button 
                                        className="comment-post-btn"
                                        onClick={() => handlePost()}
                                    >
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="comment-list-fb">
                        {sortedComments.map((item) => {
                            const cid = item.id || item._id;
                            const likedByServer = item.likedBy || [];
                            const isLiked = clientId && likedByServer.includes(clientId);
                            return (
                                <article key={cid} className="comment-item-fb">
                                    <div className="comment-avatar-fb">
                                        {String(item.name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="comment-content-fb">
                                        <div className="comment-bubble-fb">
                                            <span className="comment-author-fb">{item.name}</span>
                                            <p className="comment-text-fb">{item.text}</p>
                                            
                                            {(item.likes > 0 || isLiked) && (
                                                <div 
                                                    className="comment-reaction-badge"
                                                    onClick={() => handleLike(item)}
                                                >
                                                    <span className="reaction-icon">❤️</span>
                                                    <span className="reaction-count">{item.likes || 0}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="comment-meta-fb">
                                            <button 
                                                className={`meta-action-btn ${isLiked ? 'active' : ''}`}
                                                onClick={() => handleLike(item)}
                                            >
                                                {isLiked ? 'Loved' : 'Love'}
                                            </button>
                                            <span className="meta-dot">•</span>
                                            <span className="comment-time-fb">{timeAgo(item.createdAt)}</span>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
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
                                        loading="lazy"
                                        decoding="async"
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

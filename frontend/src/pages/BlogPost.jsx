import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { Calendar, User, Tag, Eye, Facebook, Linkedin, MessageCircle, Clock3, ArrowLeft } from 'lucide-react';
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_BASE}/posts/${slug}`);
                setPost(res.data?.post || null);
                setRelated(res.data?.related || []);
                await axios.post(`${API_BASE}/posts/${slug}/view`);
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

    if (loading) {
        return <div className="container blog-post-feedback">Loading post...</div>;
    }

    if (!post) {
        return <div className="container blog-post-feedback">Post not found.</div>;
    }

    return (
        <div className="blog-post-page">
            <div className="container blog-post-layout">
                <article className="blog-post-article glass-panel">
                    <header className="blog-post-header">
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
                            <span><Eye size={14} /> {post.views || 0} views</span>
                            <span><Clock3 size={14} /> {post.readingTime} min read</span>
                        </div>
                    </header>

                    <img
                        src={post.featuredImage ? `${API_BASE_URL}${post.featuredImage}` : 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1400&q=80'}
                        alt={post.title}
                        className="blog-post-cover"
                    />

                    {!!(post.tags || []).length && (
                        <div className="blog-post-tags">
                            <Tag size={16} />
                            {(post.tags || []).map((tag) => (
                                <span key={tag._id}>#{tag.name}</span>
                            ))}
                        </div>
                    )}

                    <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post.content }} />

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
                </article>
            </div>

            {related.length > 0 && (
                <section className="container related-posts-wrap">
                    <div className="related-posts-header">
                        <h3>Related Posts</h3>
                        <Link to="/blog" className="related-view-all">View all stories</Link>
                    </div>
                    <div className="posts-grid">
                        {related.map((item) => (
                            <article key={item._id} className="blog-card glass-panel">
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
                                    <Link to={`/blog/${item.slug}`} className="read-more-link">Read More</Link>
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

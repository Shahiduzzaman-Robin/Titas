import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { Search, Calendar, User } from 'lucide-react';
import '../styles/Blog.css';

const API_BASE = `${API_BASE_URL}/api/blog`;

const formatDate = (value) => {
    if (!value) return 'Draft';
    return new Date(value).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const Blog = () => {
    const [featuredPost, setFeaturedPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const [recentPosts, setRecentPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(false);

    const filters = useMemo(
        () => ({ search: searchTerm.trim(), category: selectedCategory }),
        [searchTerm, selectedCategory]
    );

    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const [categoryRes, featuredRes, recentRes] = await Promise.all([
                    axios.get(`${API_BASE}/categories`),
                    axios.get(`${API_BASE}/posts/featured`),
                    axios.get(`${API_BASE}/posts`, {
                        params: { page: 1, limit: 5 },
                    }),
                ]);

                setCategories(categoryRes.data || []);
                setFeaturedPost(featuredRes.data || null);
                setRecentPosts(recentRes.data?.posts || []);
            } catch (error) {
                console.error('Failed to fetch blog metadata:', error);
            }
        };

        fetchMeta();
    }, []);

    useEffect(() => {
        setPage(1);
        setPosts([]);
    }, [filters]);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_BASE}/posts`, {
                    params: {
                        page,
                        limit: 6,
                        search: filters.search,
                        category: filters.category,
                    },
                });

                const incoming = res.data?.posts || [];
                setPosts((prev) => (page === 1 ? incoming : [...prev, ...incoming]));
                setHasMore(Boolean(res.data?.pagination?.hasMore));
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [page, filters]);

    return (
        <div className="blog-page">
            <section className="blog-hero container">
                <p className="blog-kicker">Titas Community Blog</p>
                <h1 className="blog-title">Thoughts, stories and updates from our community</h1>
                <p className="blog-subtitle bn-text">
                    শিক্ষার্থী জীবন, কমিউনিটি ইভেন্ট, ক্যারিয়ার গাইডলাইন এবং অনুপ্রেরণামূলক গল্প - সবকিছু এক জায়গায়।
                </p>
            </section>

            {featuredPost && (
                <section className="container featured-post-wrap">
                    <article className="featured-post-card modern-surface">
                        <div className="featured-image-wrapper">
                            <img
                                src={featuredPost.featuredImage ? `${API_BASE_URL}${featuredPost.featuredImage}` : 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80'}
                                alt={featuredPost.title}
                                className="featured-post-image"
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                        <div className="featured-post-content">
                            <span className="post-category-pill">{featuredPost.category?.name || 'General'}</span>
                            <h2>{featuredPost.title}</h2>
                            <p>{featuredPost.excerpt}</p>
                            <div className="card-footer">
                                <div className="post-meta-row">
                                    <span><User size={14} /> {featuredPost.author}</span>
                                    <span><Calendar size={14} /> {formatDate(featuredPost.publishedAt)}</span>
                                </div>
                                <Link to={`/blog/${featuredPost.slug}`} className="read-more-btn">Read More</Link>
                            </div>
                        </div>
                    </article>
                </section>
            )}

            <section className="container blog-layout">
                <main className="blog-main">
                    <div className="posts-headline-row">
                        <h2>Latest Posts</h2>
                        {selectedCategory && (
                            <button className="clear-filter-btn" onClick={() => setSelectedCategory('')}>
                                Clear Filter
                            </button>
                        )}
                    </div>

                    <div className="posts-grid">
                        {posts.map((post) => (
                            <article key={post._id} className="blog-card modern-surface">
                                <div className="blog-card-image-wrap">
                                    <img
                                        src={post.featuredImage ? `${API_BASE_URL}${post.featuredImage}` : 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80'}
                                        alt={post.title}
                                        className="blog-card-image"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                                <div className="blog-card-body">
                                    <span className="post-category-pill subtle">{post.category?.name || 'General'}</span>
                                    <h3>{post.title}</h3>
                                    <p>{post.excerpt}</p>
                                    <div className="card-footer">
                                        <div className="post-meta-row compact">
                                            <span><User size={13} /> {post.author}</span>
                                            <span><Calendar size={13} /> {formatDate(post.publishedAt)}</span>
                                        </div>
                                        <Link to={`/blog/${post.slug}`} className="read-more-btn">Read More</Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {!loading && posts.length === 0 && (
                        <div className="empty-state">No blog posts found for the selected filter.</div>
                    )}

                    {hasMore && (
                        <div className="load-more-wrap">
                            <button className="load-more-btn" onClick={() => setPage((p) => p + 1)} disabled={loading}>
                                {loading ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </main>

                <aside className="blog-sidebar">
                    <div className="sidebar-card modern-surface">
                        <h3>Search</h3>
                        <div className="search-box">
                            <Search size={16} />
                            <input
                                type="text"
                                placeholder="Search posts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="sidebar-card modern-surface">
                        <h3>Categories</h3>
                        <div className="category-list">
                            <button
                                className={`category-item ${selectedCategory === '' ? 'active' : ''}`}
                                onClick={() => setSelectedCategory('')}
                            >
                                All Posts
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category._id}
                                    className={`category-item ${selectedCategory === category.slug ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(category.slug)}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="sidebar-card modern-surface">
                        <h3>Recent Posts</h3>
                        <div className="recent-post-list">
                            {recentPosts.map((post) => (
                                <Link key={post._id} to={`/blog/${post.slug}`} className="recent-post-item">
                                    <img
                                        src={post.featuredImage ? `${API_BASE_URL}${post.featuredImage}` : 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=240&q=80'}
                                        alt={post.title}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <div>
                                        <p>{post.title}</p>
                                        <span>{formatDate(post.publishedAt)}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>
            </section>
        </div>
    );
};

export default Blog;

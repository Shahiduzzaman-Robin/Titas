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
                const [categoryRes, featuredRes] = await Promise.all([
                    axios.get(`${API_BASE}/categories`),
                    axios.get(`${API_BASE}/posts/featured`),
                ]);

                setCategories(categoryRes.data || []);
                setFeaturedPost(featuredRes.data || null);
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
            <section className="blog-hero container glass-panel">
                <div>
                    <p className="blog-kicker">Titas Community Hub</p>
                    <h1 className="blog-title bn-text">কমিউনিটির গল্প, ঘোষণাপত্র আর শিক্ষার্থীদের অনুপ্রেরণা</h1>
                    <p className="blog-subtitle bn-text">
                        তিতাস ব্লগে পাবেন ইভেন্ট আপডেট, এলামনাই স্টোরি, ক্যারিয়ার গাইডলাইন এবং শিক্ষার্থীদের বিভিন্ন উদ্যোগের পূর্ণ কভারেজ।
                    </p>
                </div>
            </section>

            {featuredPost && (
                <section className="container featured-post-wrap">
                    <article className="featured-post-card">
                        <div className="featured-image-wrapper">
                            <img
                                src={featuredPost.featuredImage ? `${API_BASE_URL}${featuredPost.featuredImage}` : 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80'}
                                alt={featuredPost.title}
                                className="featured-post-image"
                            />
                        </div>
                        <div className="featured-post-content">
                            <span className="post-category-pill">{featuredPost.category?.name || 'General'}</span>
                            <h2>{featuredPost.title}</h2>
                            <p>{featuredPost.excerpt}</p>
                            <div className="post-meta-row">
                                <span><User size={14} /> {featuredPost.author}</span>
                                <span><Calendar size={14} /> {formatDate(featuredPost.publishedAt)}</span>
                                <span>{featuredPost.readingTime} min read</span>
                            </div>
                            <Link to={`/blog/${featuredPost.slug}`} className="btn-primary">Read Featured Story</Link>
                        </div>
                    </article>
                </section>
            )}

            <section className="container blog-toolbar">
                <div className="search-box glass-panel">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search posts, stories, announcements..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="category-filter-scroll">
                    <button
                        className={`filter-chip ${selectedCategory === '' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('')}
                    >
                        All
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category._id}
                            className={`filter-chip ${selectedCategory === category.slug ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category.slug)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </section>

            <section className="container posts-grid-wrap">
                <div className="posts-grid">
                    {posts.map((post) => (
                        <article key={post._id} className="blog-card glass-panel">
                            <div className="blog-card-image-wrap">
                                <img
                                    src={post.featuredImage ? `${API_BASE_URL}${post.featuredImage}` : 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80'}
                                    alt={post.title}
                                    className="blog-card-image"
                                />
                            </div>
                            <div className="blog-card-body">
                                <span className="post-category-pill subtle">{post.category?.name || 'General'}</span>
                                <h3>{post.title}</h3>
                                <p>{post.excerpt}</p>
                                <div className="post-meta-row compact">
                                    <span>{post.author}</span>
                                    <span>{formatDate(post.publishedAt)}</span>
                                </div>
                                <Link to={`/blog/${post.slug}`} className="read-more-link">Read More</Link>
                            </div>
                        </article>
                    ))}
                </div>

                {!loading && posts.length === 0 && (
                    <div className="empty-state">No blog posts found for the selected filter.</div>
                )}

                {hasMore && (
                    <div className="load-more-wrap">
                        <button className="btn-outline" onClick={() => setPage((p) => p + 1)} disabled={loading}>
                            {loading ? 'Loading...' : 'Load More Posts'}
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Blog;

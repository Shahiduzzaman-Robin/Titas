import Link from 'next/link';
import axios from 'axios';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';
import BlogClient from '../../components/BlogClient';
import '../../styles/Blog.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const API_BASE = `${API_BASE_URL}/api/blog`;

const formatDate = (value) => {
    if (!value) return 'Draft';
    return new Date(value).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

export const metadata = {
    title: 'Blog | Titas Community Hub',
    description: 'Thoughts, stories and updates from our community at Dhaka University.',
};

export default async function BlogPage({ searchParams }) {
    const params = await searchParams;
    const searchTerm = params.search || '';
    const selectedCategory = params.category || '';
    const page = parseInt(params.page || '1', 10);

    let posts = [];
    let featuredPost = null;
    let recentPosts = [];
    let categories = [];
    let pagination = {};

    try {
        const [categoryRes, featuredRes, recentRes, postsRes] = await Promise.all([
            axios.get(`${API_BASE}/categories`),
            axios.get(`${API_BASE}/posts/featured`),
            axios.get(`${API_BASE}/posts`, { params: { page: 1, limit: 5 } }),
            axios.get(`${API_BASE}/posts`, {
                params: {
                    page,
                    limit: 6,
                    search: searchTerm,
                    category: selectedCategory,
                },
            }),
        ]);

        categories = categoryRes.data || [];
        featuredPost = featuredRes.data || null;
        recentPosts = recentRes.data?.posts || [];
        posts = postsRes.data?.posts || [];
        pagination = postsRes.data?.pagination || {};
    } catch (error) {
        console.error('Failed to fetch blog data:', error);
    }

    return (
        <div className="blog-page">
            <section className="blog-hero container">
                <p className="blog-kicker">Titas Community Blog</p>
                <h1 className="blog-title">Thoughts, stories and updates from our community</h1>
                <p className="blog-subtitle bn-text">
                    শিক্ষার্থী জীবন, কমিউনিটি ইভেন্ট, ক্যারিয়ার গাইডলাইন এবং অনুপ্রেরণামূলক গল্প - সবকিছু এক জায়গায়।
                </p>
            </section>

            {featuredPost && !searchTerm && !selectedCategory && (
                <section className="container featured-post-wrap">
                    <article className="featured-post-card modern-surface">
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
                            <div className="card-footer">
                                <div className="post-meta-row">
                                    <span><User size={14} /> {featuredPost.author}</span>
                                    <span><Calendar size={14} /> {formatDate(featuredPost.publishedAt)}</span>
                                </div>
                                <Link href={`/blog/${featuredPost.slug}`} className="read-more-btn">Read More</Link>
                            </div>
                        </div>
                    </article>
                </section>
            )}

            <BlogClient 
                initialPosts={posts} 
                categories={categories} 
                recentPosts={recentPosts} 
                initialPagination={pagination}
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                apiBaseUrl={API_BASE_URL}
            />
        </div>
    );
}

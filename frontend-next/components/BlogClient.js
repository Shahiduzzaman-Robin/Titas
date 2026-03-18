'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Search, Calendar, User, X } from 'lucide-react';

const formatDate = (value) => {
    if (!value) return 'Draft';
    return new Date(value).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

export default function BlogClient({ 
    initialPosts, 
    categories, 
    recentPosts, 
    initialPagination, 
    searchTerm: initialSearch, 
    selectedCategory: initialCategory,
    apiBaseUrl 
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [posts, setPosts] = useState(initialPosts);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(initialPagination?.hasMore || false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [search, setSearch] = useState(initialSearch);

    // Update URL when filters change
    const updateFilters = (newSearch, newCategory) => {
        const params = new URLSearchParams(searchParams);
        if (newSearch) params.set('search', newSearch);
        else params.delete('search');
        
        if (newCategory) params.set('category', newCategory);
        else params.delete('category');
        
        params.delete('page'); // Reset page on filter change
        
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    // When props from server change (due to URL update), reset local state
    useEffect(() => {
        setPosts(initialPosts);
        setPage(1);
        setHasMore(initialPagination?.hasMore || false);
    }, [initialPosts, initialPagination]);

    const handleLoadMore = async () => {
        setLoadingMore(true);
        const nextPage = page + 1;
        try {
            const res = await axios.get(`${apiBaseUrl}/api/blog/posts`, {
                params: {
                    page: nextPage,
                    limit: 6,
                    search: search,
                    category: initialCategory,
                },
            });
            const incoming = res.data?.posts || [];
            setPosts((prev) => [...prev, ...incoming]);
            setPage(nextPage);
            setHasMore(Boolean(res.data?.pagination?.hasMore));
        } catch (error) {
            console.error('Failed to load more posts:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    return (
        <section className="container blog-layout">
            <main className="blog-main">
                <div className="posts-headline-row">
                    <h2>{initialSearch || initialCategory ? 'Filtered Results' : 'Latest Posts'}</h2>
                    {initialCategory && (
                        <button className="clear-filter-btn" onClick={() => updateFilters(search, '')}>
                            <X size={14} /> Clear Category
                        </button>
                    )}
                </div>

                <div className={`posts-grid ${isPending ? 'opacity-50' : ''}`}>
                    {posts.map((post, index) => (
                        <article 
                            key={post._id} 
                            className="blog-card modern-surface animate-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <Link href={`/blog/${post.slug}`} className="card-link">
                                <div className="blog-card-image-wrap">
                                    <img
                                        src={post.featuredImage ? `${apiBaseUrl}${post.featuredImage}` : 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80'}
                                        alt={post.title}
                                        className="blog-card-image"
                                    />
                                </div>
                                <div className="blog-card-body">
                                    <span className="post-category-pill glass-pill">{post.category?.name || 'General'}</span>
                                    <h3>{post.title}</h3>
                                    <p>{post.excerpt}</p>
                                    <div className="card-footer">
                                        <div className="post-meta-row compact">
                                            <span><User size={13} /> {post.author}</span>
                                            <span><Calendar size={13} /> {formatDate(post.publishedAt)}</span>
                                        </div>
                                        <span className="read-more-btn">Read More</span>
                                    </div>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="empty-state">No blog posts found.</div>
                )}

                {hasMore && (
                    <div className="load-more-wrap">
                        <button 
                            className="load-more-btn" 
                            onClick={handleLoadMore} 
                            disabled={loadingMore || isPending}
                        >
                            {loadingMore ? 'Loading...' : 'Load More'}
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
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') updateFilters(search, initialCategory);
                            }}
                        />
                    </div>
                </div>

                <div className="sidebar-card modern-surface">
                    <h3>Categories</h3>
                    <div className="category-list">
                        <button
                            className={`category-item ${initialCategory === '' ? 'active' : ''}`}
                            onClick={() => updateFilters(search, '')}
                        >
                            All Posts
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category._id}
                                className={`category-item ${initialCategory === category.slug ? 'active' : ''}`}
                                onClick={() => updateFilters(search, category.slug)}
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
                            <Link key={post._id} href={`/blog/${post.slug}`} className="recent-post-item">
                                <img
                                    src={post.featuredImage ? `${apiBaseUrl}${post.featuredImage}` : 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=240&q=80'}
                                    alt={post.title}
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
    );
}

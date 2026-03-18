import Link from 'next/link';
import axios from 'axios';
import { Calendar, User, Tag, Eye, Clock3, ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import CommentSection from '../../../components/CommentSection';
import ViewCounter from '../../../components/ViewCounter';
import '../../../styles/Blog.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const API_BASE = `${API_BASE_URL}/api/blog`;

const formatDate = (value) => {
    if (!value) return 'Draft';
    return new Date(value).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

export async function generateMetadata({ params }) {
    const { slug } = await params;
    try {
        const res = await axios.get(`${API_BASE}/posts/${slug}`);
        const post = res.data?.post;
        if (!post) return { title: 'Post Not Found' };

        return {
            title: `${post.title} | Titas Blog`,
            description: post.excerpt || 'Read this post on Titas Community Hub.',
            openGraph: {
                title: post.title,
                description: post.excerpt,
                images: [
                    {
                        url: post.featuredImage ? `${API_BASE_URL}${post.featuredImage}` : 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80',
                    },
                ],
            },
        };
    } catch (error) {
        return { title: 'Titas Blog' };
    }
}

export default async function BlogPostPage({ params }) {
    const { slug } = await params;

    let post = null;
    let related = [];
    let comments = [];
    let adjacentPosts = { previous: null, next: null };

    try {
        const res = await axios.get(`${API_BASE}/posts/${slug}`);
        post = res.data?.post || null;
        related = res.data?.related || [];

        // Fetch comments
        try {
            const commentsRes = await axios.get(`${API_BASE}/posts/${slug}/comments`);
            comments = commentsRes.data?.comments || [];
        } catch (e) {}

        // Fetch adjacent posts
        try {
            const listRes = await axios.get(`${API_BASE}/posts`, {
                params: { page: 1, limit: 100 },
            });
            const allPosts = listRes.data?.posts || [];
            const index = allPosts.findIndex((item) => item.slug === slug);
            adjacentPosts = {
                previous: index >= 0 ? allPosts[index + 1] || null : null,
                next: index > 0 ? allPosts[index - 1] || null : null,
            };
        } catch (e) {}
    } catch (error) {
        console.error('Failed to fetch blog post:', error);
    }

    if (!post) {
        return <div className="container blog-post-feedback">Post not found.</div>;
    }

    return (
        <div className="blog-post-page">
            <ViewCounter slug={slug} apiBaseUrl={API_BASE_URL} />
            
            <div className="container blog-post-layout">
                <article className="blog-post-shell">
                    <header className="post-header-card modern-surface">
                        <div className="blog-post-topbar">
                            <Link href="/blog" className="blog-back-link">
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

                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify({
                                    '@context': 'https://schema.org',
                                    '@type': 'BlogPosting',
                                    headline: post.title,
                                    image: post.featuredImage ? `${API_BASE_URL}${post.featuredImage}` : 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1400&q=80',
                                    author: {
                                        '@type': 'Person',
                                        name: post.author,
                                    },
                                    datePublished: post.publishedAt,
                                    dateModified: post.updatedAt || post.publishedAt,
                                    description: post.excerpt,
                                }),
                            }}
                        />
                        <div style={{ position: 'relative', width: '100%', height: '400px' }}>
                            <Image
                                src={post.featuredImage ? `${API_BASE_URL}${post.featuredImage}` : 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1400&q=80'}
                                alt={post.title}
                                className="blog-post-cover"
                                fill
                                priority
                                style={{ objectFit: 'cover', borderRadius: '12px' }}
                            />
                        </div>
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
                            <Link href={`/blog/${adjacentPosts.previous.slug}`} className="post-nav-card modern-surface">
                                <span>Previous Post</span>
                                <h4>{adjacentPosts.previous.title}</h4>
                            </Link>
                        ) : <div />}
                        {adjacentPosts.next ? (
                            <Link href={`/blog/${adjacentPosts.next.slug}`} className="post-nav-card modern-surface align-right">
                                <span>Next Post</span>
                                <h4>{adjacentPosts.next.title}</h4>
                                <ArrowRight size={16} />
                            </Link>
                        ) : <div />}
                    </section>
                )}

                <CommentSection slug={slug} initialComments={comments} apiBaseUrl={API_BASE_URL} />
            </div>

            {related.length > 0 && (
                <section className="container related-posts-wrap">
                    <div className="related-posts-header">
                        <h3>Related Posts</h3>
                        <Link href="/blog" className="related-view-all">View all stories</Link>
                    </div>
                    <div className="posts-grid">
                        {related.map((item) => (
                            <article key={item._id} className="blog-card modern-surface">
                                <div className="blog-card-image-wrap">
                                    <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                                        <Image
                                            src={item.featuredImage ? `${API_BASE_URL}${item.featuredImage}` : 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80'}
                                            alt={item.title}
                                            className="blog-card-image"
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                </div>
                                <div className="blog-card-body">
                                    <h3>{item.title}</h3>
                                    <p>{item.excerpt}</p>
                                    <Link href={`/blog/${item.slug}`} className="read-more-btn">Read More</Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

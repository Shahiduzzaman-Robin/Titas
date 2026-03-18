'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { Edit3, Trash2, PlusCircle, Upload, CheckCircle, AlertCircle, Eye, Search, Filter } from 'lucide-react';
import AdminNavbar from './AdminNavbar';
import CustomSelect from './CustomSelect';
import 'react-quill-new/dist/quill.snow.css';
import '../styles/Admin.css';
import ReactDOM from 'react-dom';

// React 19 findDOMNode shim for legacy libraries
if (typeof window !== 'undefined' && !ReactDOM.findDOMNode) {
    ReactDOM.findDOMNode = (instance) => {
        if (!instance) return null;
        if (instance instanceof HTMLElement) return instance;
        return instance.el || null;
    };
}

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(async () => {
    const { default: RQ } = await import('react-quill-new');
    return function QuillComponent({ forwardedRef, ...props }) {
        return <RQ ref={forwardedRef} {...props} />;
    };
}, { ssr: false });

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const API = `${API_BASE_URL}/api/blog`;

const initialForm = {
    id: null,
    title: '',
    author: '',
    category: '',
    tags: [],
    excerpt: '',
    content: '',
    status: 'draft',
    featuredImageFile: null,
    featuredImage: '',
};

const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean'],
    ]
};

export default function AdminBlogClient() {
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const [comments, setComments] = useState([]);
    const [filteredComments, setFilteredComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [commentPagination, setCommentPagination] = useState({ page: 1, limit: 20, total: 0, hasMore: false });
    const [selectedComments, setSelectedComments] = useState(new Set());
    const [actionInProgress, setActionInProgress] = useState(false);
    const [expandedComment, setExpandedComment] = useState(null);
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [authError, setAuthError] = useState('');
    const quillRef = useRef(null);
    const inlineImageInputRef = useRef(null);

    const [token, setToken] = useState(null);

    useEffect(() => {
        const t = localStorage.getItem('admin_token');
        if (!t) {
            router.push('/login');
        } else {
            setToken(t);
        }
    }, [router]);

    useEffect(() => {
        if (!token) return;
        setAuthError('');
        fetchAll();
    }, [token]);

    useEffect(() => {
        if (!form.featuredImageFile) {
            setImagePreviewUrl('');
            return;
        }
        const objectUrl = URL.createObjectURL(form.featuredImageFile);
        setImagePreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [form.featuredImageFile]);

    useEffect(() => {
        if (activeTab === 'comments' && token) {
            fetchComments();
        }
    }, [activeTab, filterStatus, commentPagination.page, token]);

    useEffect(() => {
        const filtered = comments.filter((item) => {
            const searchLower = searchTerm.toLowerCase();
            const name = String(item.comment?.name || '').toLowerCase();
            const email = String(item.comment?.email || '').toLowerCase();
            const text = String(item.comment?.text || '').toLowerCase();
            const postTitle = String(item.postTitle || '').toLowerCase();
            return (
                name.includes(searchLower) ||
                email.includes(searchLower) ||
                text.includes(searchLower) ||
                postTitle.includes(searchLower)
            );
        });
        setFilteredComments(filtered);
    }, [searchTerm, comments]);

    const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);
    const featuredImagePreviewSrc = imagePreviewUrl || (form.featuredImage ? `${API_BASE_URL}${form.featuredImage}` : '');
    const categoryOptions = categories.map((category) => ({ label: category.name, value: category._id }));
    const statusOptions = [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
    ];

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [postRes, categoryRes, tagRes] = await Promise.all([
                axios.get(`${API}/admin/posts`, { headers }),
                axios.get(`${API}/admin/categories`, { headers }),
                axios.get(`${API}/admin/tags`, { headers }),
            ]);

            setPosts(postRes.data || []);
            setCategories(categoryRes.data || []);
            setTags(tagRes.data || []);

            if (!form.category && (categoryRes.data || []).length > 0) {
                setForm((prev) => ({ ...prev, category: categoryRes.data[0]._id }));
            }
        } catch (error) {
            console.error('Failed loading blog admin data:', error);
            const status = error?.response?.status;
            if (status === 401 || status === 403) {
                setAuthError('Authentication issue. Please login again.');
                localStorage.removeItem('admin_token');
                router.push('/login');
                return;
            }
            setAuthError('Unable to load blog data.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setForm(initialForm);
        setImagePreviewUrl('');
    };

    const onTagToggle = (tagId) => {
        setForm((prev) => ({
            ...prev,
            tags: prev.tags.includes(tagId) ? prev.tags.filter((item) => item !== tagId) : [...prev.tags, tagId],
        }));
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.content || !form.category) {
            window.alert('Title, content and category are required.');
            return;
        }

        const payload = new FormData();
        payload.append('title', form.title);
        payload.append('author', form.author);
        payload.append('category', form.category);
        payload.append('tags', JSON.stringify(form.tags));
        payload.append('excerpt', form.excerpt);
        payload.append('content', form.content);
        payload.append('status', form.status);
        if (form.featuredImageFile) payload.append('featuredImage', form.featuredImageFile);

        try {
            if (form.id) {
                await axios.put(`${API}/admin/posts/${form.id}`, payload, { headers });
            } else {
                await axios.post(`${API}/admin/posts`, payload, { headers });
            }
            resetForm();
            await fetchAll();
        } catch (error) {
            window.alert(error.response?.data?.msg || 'Failed to save post');
        }
    };

    const onEditPost = (post) => {
        const fullPost = posts.find((item) => item._id === post._id) || post;
        const categoryId = typeof fullPost.category === 'object' ? (fullPost.category?._id || '') : (fullPost.category || '');
        const tagIds = Array.isArray(fullPost.tags)
            ? fullPost.tags.map((t) => (typeof t === 'object' ? (t._id || t.id) : t)).filter(Boolean)
            : [];

        setForm({
            id: fullPost._id,
            title: fullPost.title || '',
            author: fullPost.author || '',
            category: categoryId,
            tags: tagIds,
            excerpt: fullPost.excerpt || '',
            content: fullPost.content || '',
            status: fullPost.status || 'draft',
            featuredImage: fullPost.featuredImage || '',
            featuredImageFile: null,
        });
        setActiveTab('posts');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const onDeletePost = async (postId) => {
        if (!window.confirm('Delete this post?')) return;
        try {
            await axios.delete(`${API}/admin/posts/${postId}`, { headers });
            await fetchAll();
        } catch (error) {
            window.alert(error.response?.data?.msg || 'Failed to delete post');
        }
    };

    const fetchComments = async () => {
        try {
            setCommentsLoading(true);
            const response = await axios.get(`${API}/admin/comments`, {
                params: {
                    status: filterStatus,
                    page: commentPagination.page,
                    limit: commentPagination.limit,
                },
                headers,
            });
            setComments(response.data.comments || []);
            setCommentPagination(prev => ({
                ...prev,
                total: response.data.pagination?.total || 0,
                hasMore: response.data.pagination?.hasMore || false,
            }));
            setSelectedComments(new Set());
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setCommentsLoading(false);
        }
    };

    const approveComment = async (postId, commentId, currentApproved) => {
        try {
            setActionInProgress(true);
            await axios.patch(
                `${API}/admin/posts/${postId}/comments/${commentId}/approve`,
                { approved: !currentApproved },
                { headers }
            );
            fetchComments();
        } catch (error) {
            console.error('Error updating approval status:', error);
        } finally {
            setActionInProgress(false);
        }
    };

    const toggleSelectComment = (commentId) => {
        const newSelected = new Set(selectedComments);
        if (newSelected.has(commentId)) {
            newSelected.delete(commentId);
        } else {
            newSelected.add(commentId);
        }
        setSelectedComments(newSelected);
    };

    return (
        <div className="admin-layout">
            <AdminNavbar active="blog" />
            <div className="admin-main">
                <div className="admin-page-header">
                    <h1 className="bn-text">ব্লগ ম্যানেজমেন্ট</h1>
                    <p>Posts, categories, and tags management</p>
                </div>

                {authError && (
                    <div style={{ marginBottom: '1rem', padding: '0.7rem 0.9rem', borderRadius: '10px', border: '1px solid #fed7aa', background: '#fff7ed', color: '#9a3412', fontSize: '0.85rem' }}>
                        {authError}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <button className={`btn-outline ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>Posts</button>
                    <button className={`btn-outline ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>Categories</button>
                    <button className={`btn-outline ${activeTab === 'tags' ? 'active' : ''}`} onClick={() => setActiveTab('tags')}>Tags</button>
                    <button className={`btn-outline ${activeTab === 'comments' ? 'active' : ''}`} onClick={() => setActiveTab('comments')}>মন্তব্য</button>
                </div>

                {activeTab === 'posts' && (
                    <>
                        <div className="admin-card" style={{ marginBottom: '1rem' }}>
                            <h3 style={{ marginBottom: '0.8rem' }}>{form.id ? 'Edit Post' : 'Create New Post'}</h3>
                            <form onSubmit={handlePostSubmit} style={{ display: 'grid', gap: '0.8rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '0.8rem' }}>
                                    <input className="form-input" name="title" value={form.title} onChange={handleChange} placeholder="Post title" />
                                    <input className="form-input" name="author" value={form.author} onChange={handleChange} placeholder="Author name" />
                                    <CustomSelect
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        options={categoryOptions}
                                        placeholder="Select category"
                                    />
                                    <CustomSelect
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                        options={statusOptions}
                                        placeholder="Select status"
                                    />
                                </div>
                                <textarea className="form-input" name="excerpt" value={form.excerpt} onChange={handleChange} rows={3} placeholder="Short excerpt" />
                                <div>
                                    <div style={{ marginBottom: '0.4rem', fontWeight: 600, color: '#334155' }}>Tags</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {tags.map((tag) => (
                                            <label key={tag._id} style={{ display: 'inline-flex', gap: '0.3rem', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '999px', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                                                <input type="checkbox" checked={form.tags.includes(tag._id)} onChange={() => onTagToggle(tag._id)} />
                                                {tag.name}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ marginBottom: '0.4rem', fontWeight: 600, color: '#334155' }}>Content</div>
                                    <ReactQuill
                                        forwardedRef={quillRef}
                                        theme="snow"
                                        value={form.content}
                                        onChange={(val) => setForm(f => ({ ...f, content: val }))}
                                        modules={quillModules}
                                    />
                                </div>
                                <div className="admin-blog-upload-wrap">
                                    <label htmlFor="blog-featured-image" className="admin-blog-upload-box">
                                        {featuredImagePreviewSrc ? (
                                            <div className="admin-blog-upload-preview">
                                                <img src={featuredImagePreviewSrc} alt="Featured preview" className="admin-blog-upload-image" />
                                                <div className="admin-blog-upload-overlay bn-text">{form.featuredImageFile ? 'ছবি পরিবর্তন করুন' : 'Featured image loaded'}</div>
                                            </div>
                                        ) : (
                                            <div className="admin-blog-upload-placeholder">
                                                <Upload size={24} />
                                                <p className="bn-text">Click to upload featured image</p>
                                            </div>
                                        )}
                                    </label>
                                    <input id="blog-featured-image" type="file" accept="image/*" className="admin-blog-upload-input" onChange={(e) => setForm({ ...form, featuredImageFile: e.target.files?.[0] || null })} />
                                </div>
                                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                                    <button className="btn-primary" type="submit">{form.id ? 'Update Post' : 'Create Post'}</button>
                                    <button className="btn-outline" type="button" onClick={resetForm}>Reset</button>
                                </div>
                            </form>
                        </div>

                        <div className="admin-card" style={{ padding: 0 }}>
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Title</th><th>Category</th><th>Status</th><th>Views</th><th>Updated</th><th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading && <tr><td colSpan={6} style={{ textAlign: 'center', padding: '1rem' }}>Loading...</td></tr>}
                                        {!loading && posts.map((post) => (
                                            <tr key={post._id}>
                                                <td>{post.title}</td>
                                                <td>{post.category?.name || '-'}</td>
                                                <td>{post.status}</td>
                                                <td>{post.views || 0}</td>
                                                <td>{new Date(post.updatedAt).toLocaleDateString()}</td>
                                                <td>
                                                    <button className="action-btn" onClick={() => onEditPost(post)}><Edit3 size={14} /></button>
                                                    <button className="action-btn reject" onClick={() => onDeletePost(post._id)}><Trash2 size={14} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'categories' && (
                    <div className="admin-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                            <h3>Manage Categories</h3>
                            <button className="btn-primary" onClick={async () => {
                                const name = window.prompt('Category name');
                                if (!name) return;
                                try {
                                    await axios.post(`${API}/admin/categories`, { name }, { headers });
                                    await fetchAll();
                                } catch (error) {
                                    window.alert(error.response?.data?.msg || 'Failed to create category');
                                }
                            }}><PlusCircle size={16} /> Add Category</button>
                        </div>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                            {categories.map((item) => (
                                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.6rem 0.8rem' }}>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                                        <div style={{ color: '#64748b', fontSize: '0.8rem' }}>/{item.slug}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                        <button className="action-btn" onClick={async () => {
                                            const name = window.prompt('Update category name', item.name);
                                            if (!name) return;
                                            try {
                                                await axios.put(`${API}/admin/categories/${item._id}`, { name }, { headers });
                                                await fetchAll();
                                            } catch (error) {
                                                window.alert(error.response?.data?.msg || 'Failed to update category');
                                            }
                                        }}><Edit3 size={14} /></button>
                                        <button className="action-btn reject" onClick={async () => {
                                            if (!window.confirm('Delete this category?')) return;
                                            try {
                                                await axios.delete(`${API}/admin/categories/${item._id}`, { headers });
                                                await fetchAll();
                                            } catch (error) {
                                                window.alert(error.response?.data?.msg || 'Failed to delete category');
                                            }
                                        }}><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'tags' && (
                    <div className="admin-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                            <h3>Manage Tags</h3>
                            <button className="btn-primary" onClick={async () => {
                                const name = window.prompt('Tag name');
                                if (!name) return;
                                try {
                                    await axios.post(`${API}/admin/tags`, { name }, { headers });
                                    await fetchAll();
                                } catch (error) {
                                    window.alert(error.response?.data?.msg || 'Failed to create tag');
                                }
                            }}><PlusCircle size={16} /> Add Tag</button>
                        </div>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                            {tags.map((item) => (
                                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.6rem 0.8rem' }}>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                                        <div style={{ color: '#64748b', fontSize: '0.8rem' }}>/{item.slug}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                        <button className="action-btn" onClick={async () => {
                                            const name = window.prompt('Update tag name', item.name);
                                            if (!name) return;
                                            try {
                                                await axios.put(`${API}/admin/tags/${item._id}`, { name }, { headers });
                                                await fetchAll();
                                            } catch (error) {
                                                window.alert(error.response?.data?.msg || 'Failed to update tag');
                                            }
                                        }}><Edit3 size={14} /></button>
                                        <button className="action-btn reject" onClick={async () => {
                                            if (!window.confirm('Delete this tag?')) return;
                                            try {
                                                await axios.delete(`${API}/admin/tags/${item._id}`, { headers });
                                                await fetchAll();
                                            } catch (error) {
                                                window.alert(error.response?.data?.msg || 'Failed to delete tag');
                                            }
                                        }}><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'comments' && (
                    <>
                        <div className="admin-card" style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                <div className="admin-search-wrapper" style={{ flex: 1, minWidth: '200px' }}>
                                    <Search size={14} className="search-icon" />
                                    <input className="admin-search-input bn-text" placeholder="Search comments..."
                                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                                <div style={{ minWidth: '150px' }}>
                                    <CustomSelect
                                        name="commentFilter"
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        options={[
                                            { label: 'All Comments', value: 'all' },
                                            { label: 'Pending', value: 'pending' },
                                            { label: 'Approved', value: 'approved' },
                                            { label: 'Flagged', value: 'flagged' }
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>

                        {commentsLoading ? (
                            <div className="admin-card bn-text" style={{ textAlign: 'center' }}>Loading comments...</div>
                        ) : filteredComments.length === 0 ? (
                            <div className="admin-card bn-text" style={{ textAlign: 'center' }}>No comments found.</div>
                        ) : (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {filteredComments.map((item) => (
                                    <div key={item.comment?._id || item.comment?.id} className="admin-card" style={{ borderLeft: `4px solid ${item.comment?.approved ? '#16a34a' : '#d97706'}` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                            <div className="bn-text" style={{ fontWeight: 600 }}>{item.comment?.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(item.comment?.createdAt).toLocaleString()}</div>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.6rem' }}>{item.comment?.email}</div>
                                        <div className="bn-text" style={{ fontSize: '0.95rem', marginBottom: '0.8rem', whiteSpace: 'pre-wrap' }}>{item.comment?.text}</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                                Post: <a href={`/blog/${item.postSlug}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1a1a2e', fontWeight: 600 }}>{item.postTitle}</a>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className={`action-btn ${item.comment?.approved ? 'reject' : ''}`} onClick={() => approveComment(item.postId, item.comment?._id || item.comment?.id, item.comment?.approved)}>
                                                    <CheckCircle size={14} /> {item.comment?.approved ? 'Reject' : 'Approve'}
                                                </button>
                                                <button className="action-btn reject" onClick={async () => {
                                                    if (!window.confirm('Delete this comment?')) return;
                                                    try {
                                                        await axios.delete(`${API}/admin/posts/${item.postId}/comments/${item.comment?._id || item.comment?.id}`, { headers });
                                                        fetchComments();
                                                    } catch (error) {
                                                        window.alert('Failed to delete comment');
                                                    }
                                                }}><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

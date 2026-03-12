import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import ReactQuill, { Quill } from 'react-quill';
import { Edit3, Trash2, PlusCircle, Upload, Maximize2, AlignLeft, AlignCenter, AlignRight, CheckCircle, AlertCircle, Eye, Search, Filter } from 'lucide-react';
import AdminNavbar from '../components/AdminNavbar';
import CustomSelect from '../components/CustomSelect';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import '../styles/Admin.css';

// Register Quill modules
if (typeof window !== 'undefined') {
    window.Quill = Quill;
}
Quill.register('modules/imageResize', ImageResize);

const API = `${API_BASE_URL}/api/blog`;
const BACKEND_ORIGIN = API_BASE_URL;

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
    ],
    imageResize: {
        modules: ['Resize', 'DisplaySize', 'Toolbar']
    },
};

const AdminBlog = () => {
    const navigate = useNavigate();
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
    const [inlineUploading, setInlineUploading] = useState(false);
    const [authError, setAuthError] = useState('');
    const quillRef = useRef(null);
    const inlineImageInputRef = useRef(null);

    const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');
    const token = localStorage.getItem('admin_token') || adminUser?.token || '';

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
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

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [form.featuredImageFile]);

    useEffect(() => {
        if (activeTab === 'comments') {
            fetchComments();
        }
    }, [activeTab, filterStatus, commentPagination.page]);

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
    const featuredImagePreviewSrc = imagePreviewUrl || (form.featuredImage ? `${BACKEND_ORIGIN}${form.featuredImage}` : '');
    const categoryOptions = categories.map((category) => ({ label: category.name, value: category._id }));
    const statusOptions = [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
    ];

    const openInlineImagePicker = () => {
        inlineImageInputRef.current?.click();
    };

    const insertInlineImages = (imageUrls = [], atIndex) => {
        const quill = quillRef.current?.getEditor();
        if (!quill || imageUrls.length === 0) return;

        quill.focus();
        let cursor = atIndex;

        imageUrls.forEach((url) => {
            const finalUrl = url.startsWith('http') ? url : `${BACKEND_ORIGIN}${url}`;
            quill.insertEmbed(cursor, 'image', finalUrl, 'user');
            cursor += 1;
            quill.insertText(cursor, '\n', 'user');
            cursor += 1;
        });

        setTimeout(() => {
            quill.setSelection(cursor, 0, 'user');
        }, 100);
    };

    const onInlineImagesSelected = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const quill = quillRef.current?.getEditor();
        const range = quill?.getSelection();
        const savedIndex = range ? range.index : (quill?.getLength() || 0);

        const payload = new FormData();
        files.forEach((file) => payload.append('images', file));

        setInlineUploading(true);
        try {
            const res = await axios.post(`${API}/admin/uploads/inline-images`, payload, {
                headers: {
                    ...headers,
                },
            });
            const urls = (res.data?.images || []).map((item) => item.url).filter(Boolean);
            insertInlineImages(urls, savedIndex);
        } catch (error) {
            window.alert(error.response?.data?.msg || 'Failed to upload inline images');
        } finally {
            setInlineUploading(false);
            e.target.value = '';
        }
    };

    const quillModulesWithHandlers = useMemo(
        () => ({
            ...quillModules,
            toolbar: {
                container: quillModules.toolbar,
                handlers: {
                    image: openInlineImagePicker,
                },
            },
        }),
        []
    );

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
                setAuthError('Authentication issue detected on blog endpoints. Please login again if actions fail.');
                return;
            }
            setAuthError('Unable to load blog data right now. Please try again.');
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
        // Find existing post to ensure we have all fields
        const fullPost = posts.find((item) => item._id === post._id) || post;

        // Extract IDs for category and tags
        const categoryId = typeof fullPost.category === 'object' ? (fullPost.category?._id || '') : (fullPost.category || '');
        const tagIds = Array.isArray(fullPost.tags)
            ? fullPost.tags.map((t) => (typeof t === 'object' ? (t._id || t.id) : t)).filter(Boolean)
            : [];

        // Set form state with all fields explicitly
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

        // Ensure we are on the posts tab so the form is visible
        setActiveTab('posts');

        // Scroll to the top where the form is located
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

    const createCategory = async () => {
        const name = window.prompt('Category name');
        if (!name) return;
        try {
            await axios.post(`${API}/admin/categories`, { name }, { headers });
            await fetchAll();
        } catch (error) {
            window.alert(error.response?.data?.msg || 'Failed to create category');
        }
    };

    const editCategory = async (item) => {
        const name = window.prompt('Update category name', item.name);
        if (!name) return;
        try {
            await axios.put(`${API}/admin/categories/${item._id}`, { name }, { headers });
            await fetchAll();
        } catch (error) {
            window.alert(error.response?.data?.msg || 'Failed to update category');
        }
    };

    const deleteCategory = async (id) => {
        if (!window.confirm('Delete this category?')) return;
        try {
            await axios.delete(`${API}/admin/categories/${id}`, { headers });
            await fetchAll();
        } catch (error) {
            window.alert(error.response?.data?.msg || 'Failed to delete category');
        }
    };

    const createTag = async () => {
        const name = window.prompt('Tag name');
        if (!name) return;
        try {
            await axios.post(`${API}/admin/tags`, { name }, { headers });
            await fetchAll();
        } catch (error) {
            window.alert(error.response?.data?.msg || 'Failed to create tag');
        }
    };

    const editTag = async (item) => {
        const name = window.prompt('Update tag name', item.name);
        if (!name) return;
        try {
            await axios.put(`${API}/admin/tags/${item._id}`, { name }, { headers });
            await fetchAll();
        } catch (error) {
            window.alert(error.response?.data?.msg || 'Failed to update tag');
        }
    };

    const deleteTag = async (id) => {
        if (!window.confirm('Delete this tag?')) return;
        try {
            await axios.delete(`${API}/admin/tags/${id}`, { headers });
            await fetchAll();
        } catch (error) {
            window.alert(error.response?.data?.msg || 'Failed to delete tag');
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

    const deleteComment = async (postId, commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;
        try {
            setActionInProgress(true);
            await axios.delete(`${API}/admin/posts/${postId}/comments/${commentId}`, { headers });
            fetchComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
        } finally {
            setActionInProgress(false);
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

    const flagComment = async (postId, commentId, flagged) => {
        let flagReason = '';
        if (!flagged) {
            flagReason = prompt('Enter reason for flagging (spam, inappropriate, etc.):') || '';
            if (!flagReason.trim()) return;
        }
        try {
            setActionInProgress(true);
            await axios.patch(
                `${API}/admin/posts/${postId}/comments/${commentId}/flag`,
                { flagged: !flagged, flagReason: flagReason.trim() },
                { headers }
            );
            fetchComments();
        } catch (error) {
            console.error('Error flagging comment:', error);
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

    const bulkDeleteComments = async () => {
        if (selectedComments.size === 0) return;
        if (!window.confirm(`Delete ${selectedComments.size} comment(s)?`)) return;
        try {
            setActionInProgress(true);
            const commentsToDelete = comments.filter((item) => selectedComments.has(item.comment?.id));
            for (const item of commentsToDelete) {
                await axios.delete(`${API}/admin/posts/${item.postId}/comments/${item.comment?.id}`, { headers });
            }
            fetchComments();
        } catch (error) {
            console.error('Error bulk deleting:', error);
        } finally {
            setActionInProgress(false);
        }
    };

    const formatCommentDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
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
                    <button className="btn-outline" onClick={() => setActiveTab('posts')}>Posts</button>
                    <button className="btn-outline" onClick={() => setActiveTab('categories')}>Categories</button>
                    <button className="btn-outline" onClick={() => setActiveTab('tags')}>Tags</button>
                    <button className="btn-outline" onClick={() => setActiveTab('comments')}>মন্তব্য</button>
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
                                        required={true}
                                    />
                                    <CustomSelect
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                        options={statusOptions}
                                        placeholder="Select status"
                                        required={true}
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
                                    <input
                                        type="file"
                                        ref={inlineImageInputRef}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        multiple
                                        onChange={onInlineImagesSelected}
                                    />
                                    <ReactQuill
                                        ref={quillRef}
                                        theme="snow"
                                        value={form.content}
                                        modules={quillModulesWithHandlers}
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
                                                <span>PNG, JPG, JPEG, WEBP</span>
                                            </div>
                                        )}
                                    </label>
                                    <input
                                        id="blog-featured-image"
                                        type="file"
                                        accept="image/*"
                                        className="admin-blog-upload-input"
                                        onChange={(e) => setForm({ ...form, featuredImageFile: e.target.files?.[0] || null })}
                                    />
                                    {form.featuredImageFile && (
                                        <p className="admin-blog-upload-filename">Selected: {form.featuredImageFile.name}</p>
                                    )}
                                </div>

                                {featuredImagePreviewSrc && (
                                    <div className="admin-image-preview">
                                        <p className="admin-image-preview-text">{form.featuredImageFile ? 'Selected image preview' : 'Current featured image'}</p>
                                    </div>
                                )}

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
                                            <th>Title</th>
                                            <th>Category</th>
                                            <th>Status</th>
                                            <th>Views</th>
                                            <th>Updated</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading && <tr><td colSpan={6} style={{ textAlign: 'center', padding: '1rem' }}>Loading...</td></tr>}
                                        {!loading && posts.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: '1rem' }}>No posts yet</td></tr>}
                                        {!loading && posts.map((post) => (
                                            <tr key={post._id}>
                                                <td>{post.title}</td>
                                                <td>{post.category?.name || '-'}</td>
                                                <td>{post.status}</td>
                                                <td>{post.views || 0}</td>
                                                <td>{new Date(post.updatedAt).toLocaleDateString()}</td>
                                                <td>
                                                    <button className="action-btn" onClick={() => onEditPost(post)} title="Edit"><Edit3 size={14} /></button>
                                                    <button className="action-btn reject" onClick={() => onDeletePost(post._id)} title="Delete"><Trash2 size={14} /></button>
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
                            <button className="btn-primary" onClick={createCategory}><PlusCircle size={16} /> Add Category</button>
                        </div>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                            {categories.map((item) => (
                                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.6rem 0.8rem' }}>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                                        <div style={{ color: '#64748b', fontSize: '0.8rem' }}>/{item.slug}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                        <button className="action-btn" onClick={() => editCategory(item)}><Edit3 size={14} /></button>
                                        <button className="action-btn reject" onClick={() => deleteCategory(item._id)}><Trash2 size={14} /></button>
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
                            <button className="btn-primary" onClick={createTag}><PlusCircle size={16} /> Add Tag</button>
                        </div>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                            {tags.map((item) => (
                                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.6rem 0.8rem' }}>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                                        <div style={{ color: '#64748b', fontSize: '0.8rem' }}>/{item.slug}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                        <button className="action-btn" onClick={() => editTag(item)}><Edit3 size={14} /></button>
                                        <button className="action-btn reject" onClick={() => deleteTag(item._id)}><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'comments' && (
                    <>
                        <div className="admin-card blog-comments-toolbar-card">
                            <div className="blog-comments-toolbar-row">
                                <div className="blog-comments-search-wrap">
                                    <Search size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search comments by name, email, or text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="blog-comments-filter-wrap">
                                    <Filter size={18} />
                                    <select value={filterStatus} onChange={(e) => {
                                        setFilterStatus(e.target.value);
                                        setCommentPagination(prev => ({ ...prev, page: 1 }));
                                    }}>
                                        <option value="all">All Comments</option>
                                        <option value="pending">Pending Approval</option>
                                        <option value="approved">Approved</option>
                                        <option value="flagged">Flagged</option>
                                    </select>
                                </div>
                                {selectedComments.size > 0 && (
                                    <button className="blog-comments-bulk-delete" onClick={bulkDeleteComments} disabled={actionInProgress}>
                                        Delete ({selectedComments.size})
                                    </button>
                                )}
                            </div>
                            <div className="blog-comments-stats-row">
                                <span>Total: {commentPagination.total}</span>
                                {filterStatus === 'pending' && <span className="blog-comments-chip pending">Pending Review</span>}
                                {filterStatus === 'flagged' && <span className="blog-comments-chip flagged">Flagged as Spam</span>}
                            </div>
                        </div>

                        {commentsLoading && <div className="blog-comments-loading">Loading comments...</div>}

                        {!commentsLoading && filteredComments.length === 0 && (
                            <div className="admin-card blog-comments-empty-state">
                                <p>No comments found.</p>
                            </div>
                        )}

                        <div className="blog-comments-list">
                            {filteredComments.map((item) => {
                                const comment = item.comment;
                                const isSelected = selectedComments.has(comment?.id);
                                const isExpanded = expandedComment === comment?.id;
                                return (
                                    <div
                                        key={comment?.id}
                                        className={`blog-comment-item ${!comment?.approved ? 'pending' : ''} ${comment?.flagged ? 'flagged' : ''}`}
                                    >
                                        <div className="blog-comment-header">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleSelectComment(comment?.id)}
                                                disabled={actionInProgress}
                                            />
                                            <div className="blog-comment-meta">
                                                <strong>{comment?.name}</strong>
                                                {comment?.email && <span className="blog-comment-email">{comment.email}</span>}
                                                <span className="blog-comment-date">{formatCommentDate(comment?.createdAt)}</span>
                                            </div>
                                            <div className="blog-comment-badges">
                                                {!comment?.approved && <span className="blog-comments-chip pending">Pending</span>}
                                                {comment?.flagged && <span className="blog-comments-chip flagged">Flagged</span>}
                                            </div>
                                        </div>
                                        <div className="blog-comment-post-link">
                                            <Eye size={14} />
                                            <a href={`/blog/${item.postSlug}`} target="_blank" rel="noopener noreferrer">
                                                {item.postTitle}
                                            </a>
                                        </div>
                                        <div className="blog-comment-text">
                                            {isExpanded ? (
                                                <p>{comment?.text}</p>
                                            ) : (
                                                <p>{comment?.text?.substring(0, 150)}...</p>
                                            )}
                                            {comment?.text?.length > 150 && (
                                                <button
                                                    className="blog-comment-expand-btn"
                                                    onClick={() => setExpandedComment(isExpanded ? null : comment?.id)}
                                                >
                                                    {isExpanded ? 'Show Less' : 'Show More'}
                                                </button>
                                            )}
                                        </div>
                                        {comment?.flagged && comment?.flagReason && (
                                            <div className="blog-comment-flag-reason">
                                                <strong>Flag Reason:</strong> {comment.flagReason}
                                            </div>
                                        )}
                                        <div className="blog-comment-actions">
                                            <button
                                                className={`blog-comment-btn ${comment?.approved ? 'secondary' : 'primary'}`}
                                                onClick={() => approveComment(item.postId, comment?.id, comment?.approved)}
                                                disabled={actionInProgress}
                                            >
                                                <CheckCircle size={16} />
                                                {comment?.approved ? 'Unapprove' : 'Approve'}
                                            </button>
                                            <button
                                                className={`blog-comment-btn ${comment?.flagged ? 'secondary' : ''}`}
                                                onClick={() => flagComment(item.postId, comment?.id, comment?.flagged)}
                                                disabled={actionInProgress}
                                            >
                                                <AlertCircle size={16} />
                                                {comment?.flagged ? 'Unflag' : 'Flag'}
                                            </button>
                                            <button
                                                className="blog-comment-btn danger"
                                                onClick={() => deleteComment(item.postId, comment?.id)}
                                                disabled={actionInProgress}
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {!commentsLoading && filteredComments.length > 0 && (
                            <div className="blog-comments-pagination">
                                <button
                                    disabled={commentPagination.page === 1 || commentsLoading}
                                    onClick={() => setCommentPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                >
                                    Previous
                                </button>
                                <span>Page {commentPagination.page} of {Math.ceil(commentPagination.total / commentPagination.limit) || 1}</span>
                                <button
                                    disabled={!commentPagination.hasMore || commentsLoading}
                                    onClick={() => setCommentPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminBlog;

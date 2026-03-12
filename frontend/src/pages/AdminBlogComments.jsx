import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { Trash2, CheckCircle, AlertCircle, Eye, Search, Filter } from 'lucide-react';
import AdminNavbar from '../components/AdminNavbar';
import '../styles/Admin.css';

const API = `${API_BASE_URL}/api/blog`;

const getErrorMessage = (error, fallback) => {
    return (
        error?.response?.data?.msg ||
        error?.response?.data?.message ||
        error?.message ||
        fallback
    );
};

const AdminBlogComments = () => {
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [filteredComments, setFilteredComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, hasMore: false });
    const [selectedComments, setSelectedComments] = useState(new Set());
    const [actionInProgress, setActionInProgress] = useState(false);
    const [authError, setAuthError] = useState('');
    const [expandedComment, setExpandedComment] = useState(null);

    let adminUser = {};
    try {
        adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');
    } catch (error) {
        adminUser = {};
    }
    const token = localStorage.getItem('admin_token') || adminUser?.token || '';

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        setAuthError('');
        fetchComments();
    }, [token, filterStatus, pagination.page]);

    const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API}/admin/comments`, {
                params: {
                    status: filterStatus,
                    page: pagination.page,
                    limit: pagination.limit,
                },
                headers,
            });

            setComments(response.data.comments || []);
            setPagination({
                ...pagination,
                total: response.data.pagination?.total || 0,
                hasMore: response.data.pagination?.hasMore || false,
            });
            setSelectedComments(new Set());
        } catch (error) {
            console.error('Error fetching comments:', error);
            const status = error?.response?.status;
            if (status === 401 || status === 403) {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                navigate('/login');
                return;
            }
            setAuthError(getErrorMessage(error, 'Failed to fetch comments'));
        } finally {
            setLoading(false);
        }
    };

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

    const deleteComment = async (postId, commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            setActionInProgress(true);
            await axios.delete(`${API}/admin/posts/${postId}/comments/${commentId}`, { headers });
            fetchComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
            setAuthError(getErrorMessage(error, 'Failed to delete comment'));
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
            setAuthError(getErrorMessage(error, 'Failed to update comment'));
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
            setAuthError(getErrorMessage(error, 'Failed to flag comment'));
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

    const bulkDelete = async () => {
        if (selectedComments.size === 0) return;
        if (!window.confirm(`Delete ${selectedComments.size} comment(s)?`)) return;

        try {
            setActionInProgress(true);
            // Find comments to delete and make individual delete calls
            const commentsToDelete = comments.filter((item) => selectedComments.has(item.comment?.id));
            for (const item of commentsToDelete) {
                await axios.delete(`${API}/admin/posts/${item.postId}/comments/${item.comment?.id}`, {
                    headers,
                });
            }
            fetchComments();
        } catch (error) {
            console.error('Error bulk deleting:', error);
            setAuthError('Failed to delete some comments');
        } finally {
            setActionInProgress(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    return (
        <div className="admin-layout">
            <AdminNavbar active="blog-comments" />
            <div className="admin-main">
                <div className="admin-page-header">
                    <h1 className="bn-text">ব্লগ মন্তব্য ব্যবস্থাপনা</h1>
                    <p>Approve, flag, and moderate comments from one place.</p>
                </div>

                {authError && <div className="blog-comments-error-banner">{authError}</div>}

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
                                setPagination({ ...pagination, page: 1 });
                            }}>
                                <option value="all">All Comments</option>
                                <option value="pending">Pending Approval</option>
                                <option value="approved">Approved</option>
                                <option value="flagged">Flagged</option>
                            </select>
                        </div>

                        {selectedComments.size > 0 && (
                            <button className="blog-comments-bulk-delete" onClick={bulkDelete} disabled={actionInProgress}>
                                Delete ({selectedComments.size})
                            </button>
                        )}
                    </div>

                    <div className="blog-comments-stats-row">
                        <span>Total: {pagination.total}</span>
                        {filterStatus === 'pending' && <span className="blog-comments-chip pending">Pending Review</span>}
                        {filterStatus === 'flagged' && <span className="blog-comments-chip flagged">Flagged as Spam</span>}
                    </div>
                </div>

                {loading && <div className="blog-comments-loading">Loading comments...</div>}

                {!loading && filteredComments.length === 0 && (
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
                                className={`blog-comment-item ${!comment?.approved ? 'pending' : ''} ${
                                    comment?.flagged ? 'flagged' : ''
                                }`}
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
                                        {comment?.email && (
                                            <span className="blog-comment-email">{comment.email}</span>
                                        )}
                                        <span className="blog-comment-date">{formatDate(comment?.createdAt)}</span>
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
                                            onClick={() =>
                                                setExpandedComment(isExpanded ? null : comment?.id)
                                            }
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
                                        onClick={() =>
                                            approveComment(item.postId, comment?.id, comment?.approved)
                                        }
                                        disabled={actionInProgress}
                                        title={comment?.approved ? 'Unapprove Comment' : 'Approve Comment'}
                                    >
                                        <CheckCircle size={16} />
                                        {comment?.approved ? 'Unapprove' : 'Approve'}
                                    </button>

                                    <button
                                        className={`blog-comment-btn ${comment?.flagged ? 'secondary' : ''}`}
                                        onClick={() =>
                                            flagComment(item.postId, comment?.id, comment?.flagged)
                                        }
                                        disabled={actionInProgress}
                                        title={comment?.flagged ? 'Unflag Comment' : 'Flag as Spam'}
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

                {!loading && filteredComments.length > 0 && (
                    <div className="blog-comments-pagination">
                        <button
                            disabled={pagination.page === 1 || loading}
                            onClick={() =>
                                setPagination({ ...pagination, page: pagination.page - 1 })
                            }
                        >
                            Previous
                        </button>
                        <span>
                            Page {pagination.page} of{' '}
                            {Math.ceil(pagination.total / pagination.limit) || 1}
                        </span>
                        <button
                            disabled={!pagination.hasMore || loading}
                            onClick={() =>
                                setPagination({ ...pagination, page: pagination.page + 1 })
                            }
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBlogComments;

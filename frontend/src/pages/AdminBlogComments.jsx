import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { Trash2, CheckCircle, AlertCircle, Eye, Search, Filter } from 'lucide-react';
import AdminNavbar from '../components/AdminNavbar';
import '../styles/Admin.css';

const API = `${API_BASE_URL}/api/blog`;

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

    const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');
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
            setAuthError(error.response?.data?.msg || 'Failed to fetch comments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const filtered = comments.filter((item) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                item.comment?.name?.toLowerCase().includes(searchLower) ||
                item.comment?.email?.toLowerCase().includes(searchLower) ||
                item.comment?.text?.toLowerCase().includes(searchLower) ||
                item.postTitle?.toLowerCase().includes(searchLower)
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
            setAuthError(error.response?.data?.msg || 'Failed to delete comment');
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
            setAuthError(error.response?.data?.msg || 'Failed to update comment');
        } finally {
            setActionInProgress(false);
        }
    };

    const flagComment = async (postId, commentId, flagged, reason = '') => {
        const flagReason = flagged ? prompt('Enter reason for flagging (spam, inappropriate, etc.):') || '' : '';
        if (flagged && !flagReason) return;

        try {
            setActionInProgress(true);
            await axios.patch(
                `${API}/admin/posts/${postId}/comments/${commentId}/flag`,
                { flagged: !flagged, flagReason: flagReason },
                { headers }
            );
            fetchComments();
        } catch (error) {
            console.error('Error flagging comment:', error);
            setAuthError(error.response?.data?.msg || 'Failed to flag comment');
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
        <div className="admin-container">
            <AdminNavbar active="blog-comments" />
            <div className="admin-panel">
                <div className="admin-header">
                    <h1>ব্লগ মন্তব্য ব্যবস্থাপনা</h1>
                </div>

                {authError && <div className="error-banner">{authError}</div>}

                <div className="admin-controls">
                    <div className="control-group">
                        <div className="search-box">
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder="Search comments by name, email, or text..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="control-group">
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
                        <button className="bulk-action-btn danger" onClick={bulkDelete} disabled={actionInProgress}>
                            Delete ({selectedComments.size})
                        </button>
                    )}
                </div>

                <div className="comments-stats">
                    <span>Total: {pagination.total}</span>
                    {filterStatus === 'pending' && <span className="pending-badge">Pending Review</span>}
                    {filterStatus === 'flagged' && <span className="flagged-badge">Flagged as Spam</span>}
                </div>

                {loading && <div className="loading-spinner">Loading comments...</div>}

                {!loading && filteredComments.length === 0 && (
                    <div className="empty-state">
                        <p>No comments found.</p>
                    </div>
                )}

                <div className="comments-list">
                    {filteredComments.map((item) => {
                        const comment = item.comment;
                        const isSelected = selectedComments.has(comment?.id);
                        const isExpanded = expandedComment === comment?.id;

                        return (
                            <div
                                key={comment?.id}
                                className={`comment-item ${!comment?.approved ? 'pending' : ''} ${
                                    comment?.flagged ? 'flagged' : ''
                                }`}
                            >
                                <div className="comment-header">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleSelectComment(comment?.id)}
                                        disabled={actionInProgress}
                                    />
                                    <div className="comment-meta">
                                        <strong>{comment?.name}</strong>
                                        {comment?.email && (
                                            <span className="comment-email">{comment.email}</span>
                                        )}
                                        <span className="comment-date">{formatDate(comment?.createdAt)}</span>
                                    </div>
                                    <div className="comment-badges">
                                        {!comment?.approved && <span className="badge pending">Pending</span>}
                                        {comment?.flagged && <span className="badge flagged">Flagged</span>}
                                    </div>
                                </div>

                                <div className="comment-post-info">
                                    <Eye size={14} />
                                    <a href={`/blog/${item.postSlug}`} target="_blank" rel="noopener noreferrer">
                                        {item.postTitle}
                                    </a>
                                </div>

                                <div className="comment-text">
                                    {isExpanded ? (
                                        <p>{comment?.text}</p>
                                    ) : (
                                        <p>{comment?.text?.substring(0, 150)}...</p>
                                    )}
                                    {comment?.text?.length > 150 && (
                                        <button
                                            className="expand-btn"
                                            onClick={() =>
                                                setExpandedComment(isExpanded ? null : comment?.id)
                                            }
                                        >
                                            {isExpanded ? 'Show Less' : 'Show More'}
                                        </button>
                                    )}
                                </div>

                                {comment?.flagged && comment?.flagReason && (
                                    <div className="flag-reason">
                                        <strong>Flag Reason:</strong> {comment.flagReason}
                                    </div>
                                )}

                                <div className="comment-actions">
                                    <button
                                        className={`action-btn ${comment?.approved ? 'secondary' : 'primary'}`}
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
                                        className={`action-btn ${comment?.flagged ? 'secondary' : ''}`}
                                        onClick={() =>
                                            flagComment(item.postId, comment?.id, comment?.flagged, comment?.flagReason)
                                        }
                                        disabled={actionInProgress}
                                        title={comment?.flagged ? 'Unflag Comment' : 'Flag as Spam'}
                                    >
                                        <AlertCircle size={16} />
                                        {comment?.flagged ? 'Unflag' : 'Flag'}
                                    </button>

                                    <button
                                        className="action-btn danger"
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
                    <div className="pagination">
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

'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import axios from 'axios';
import CustomSelect from './CustomSelect';

const timeAgo = (value) => {
    if (!value) return '';
    try {
        const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;
        const days = Math.floor(hours / 24);
        return `${days}d`;
    } catch (e) {
        return '';
    }
};

export default function CommentSection({ slug, initialComments, apiBaseUrl }) {
    const [comments, setComments] = useState(initialComments || []);
    const [sortBy, setSortBy] = useState('relevant');
    const [commentText, setCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const mainInputRef = useRef(null);
    const [clientId, setClientId] = useState(null);

    useEffect(() => {
        const getClientId = () => {
            try {
                let id = localStorage.getItem('titas_client_id');
                if (!id) {
                    id = `c_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
                    localStorage.setItem('titas_client_id', id);
                }
                setClientId(id);
            } catch (e) {
                console.error('LocalStorage not available');
            }
        };
        getClientId();
    }, []);

    const sortedComments = useMemo(() => {
        const items = [...comments];
        if (sortBy === 'relevant') {
            return items.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        } else if (sortBy === 'newest') {
            return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'oldest') {
            return items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
        return items;
    }, [comments, sortBy]);

    const handlePost = async () => {
        const text = mainInputRef.current?.innerText?.trim() || '';
        if (!text) return;

        setSubmittingComment(true);
        try {
            const res = await axios.post(`${apiBaseUrl}/api/blog/posts/${slug}/comments`, {
                name: 'You', // In a real app, this would be the logged-in user
                text,
            });

            const newComment = res.data?.comment || {
                id: `comment-${Date.now()}`,
                name: 'You',
                text,
                createdAt: new Date().toISOString(),
                likes: 0,
                likedBy: [],
            };

            setComments((prev) => [newComment, ...prev]);
            if (mainInputRef.current) mainInputRef.current.innerText = '';
        } catch (error) {
            console.error('Failed to submit comment:', error);
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleLike = async (comment) => {
        if (!clientId) return;
        const commentId = comment.id || comment._id;

        try {
            // Optimistic update
            setComments((prev) => prev.map((c) => {
                const cid = c.id || c._id;
                if (String(cid) !== String(commentId)) return c;
                const likedBy = Array.isArray(c.likedBy) ? [...c.likedBy] : [];
                const already = likedBy.includes(clientId);
                if (already) {
                    const idx = likedBy.indexOf(clientId);
                    if (idx >= 0) likedBy.splice(idx, 1);
                    return { ...c, likes: Math.max(0, (c.likes || 0) - 1), likedBy };
                }
                likedBy.push(clientId);
                return { ...c, likes: (c.likes || 0) + 1, likedBy };
            }));

            const res = await axios.post(`${apiBaseUrl}/api/blog/posts/${slug}/comments`, { 
                action: 'like', 
                commentId, 
                clientId 
            });
            
            if (res.data?.comment) {
                const updated = res.data.comment;
                setComments(prev => prev.map(c => 
                    String(c.id || c._id) === String(commentId) 
                    ? { ...c, likes: updated.likes, likedBy: updated.likedBy || [] } 
                    : c
                ));
            }
        } catch (err) {
            console.error('Like failed', err);
        }
    };

    return (
        <section className="comments-wrap modern-surface">
            <div className="comments-header">
                <div className="comments-header-left">
                    <h3>Comments</h3>
                    <span>{comments.length} discussion{comments.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="comments-sorting">
                    <CustomSelect 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        options={[
                            { value: 'relevant', label: 'Most Relevant' },
                            { value: 'newest', label: 'Newest' },
                            { value: 'oldest', label: 'Oldest' }
                        ]}
                        className="sorting-custom-select"
                        required
                    />
                </div>
            </div>

            <div className="comment-form-fb">
                <div className="comment-form-avatar">
                    U
                </div>
                <div className="comment-form-main">
                    <div className="comment-form-bubble">
                        <div
                            ref={mainInputRef}
                            contentEditable
                            className="comment-form-input"
                            data-placeholder="Write a comment..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handlePost();
                                }
                            }}
                        />
                        <div className="comment-form-divider" />
                        <div className="comment-form-footer">
                            <div className="comment-form-actions" />
                            <button 
                                className="comment-post-btn"
                                onClick={handlePost}
                                disabled={submittingComment}
                            >
                                {submittingComment ? '...' : 'Post'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="comment-list-fb">
                {sortedComments.map((item) => {
                    const cid = item.id || item._id;
                    const likedByServer = item.likedBy || [];
                    const isLiked = clientId && likedByServer.includes(clientId);
                    return (
                        <article key={cid} className="comment-item-fb">
                            <div className="comment-avatar-fb">
                                {String(item.name || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div className="comment-content-fb">
                                <div className="comment-bubble-fb">
                                    <span className="comment-author-fb">{item.name}</span>
                                    <p className="comment-text-fb">{item.text}</p>
                                    {(item.likes > 0 || isLiked) && (
                                        <div 
                                            className="comment-reaction-badge"
                                            onClick={() => handleLike(item)}
                                        >
                                            <span className="reaction-icon">❤️</span>
                                            <span className="reaction-count">{item.likes || 0}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="comment-meta-fb">
                                    <button 
                                        className={`meta-action-btn ${isLiked ? 'active' : ''}`}
                                        onClick={() => handleLike(item)}
                                    >
                                        {isLiked ? 'Loved' : 'Love'}
                                    </button>
                                    <span className="meta-dot">•</span>
                                    <span className="comment-time-fb">{timeAgo(item.createdAt)}</span>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

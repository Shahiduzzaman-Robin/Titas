'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, CheckCircle, Search, Clock } from 'lucide-react';
import AdminNavbar from './AdminNavbar';
import '../styles/Admin.css';
import '../styles/AdminMessages.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function AdminMessagesClient() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => { fetchMessages(); }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('admin_token');
            const res = await axios.get(`${API_BASE_URL}/api/contact`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) setMessages(res.data.data);
        } catch (error) { console.error('Failed to fetch messages:', error); }
        finally { setLoading(false); }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('admin_token');
            await axios.put(`${API_BASE_URL}/api/contact/${id}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
            setMessages(messages.map(m => m._id === id ? { ...m, status: newStatus } : m));
        } catch (error) { console.error('Failed to update status:', error); }
    };

    const displayedMessages = messages
        .filter(m => filter === 'all' || m.status === filter)
        .filter(m => {
            const query = searchQuery.toLowerCase();
            return (m.name || '').toLowerCase().includes(query) || (m.subject || '').toLowerCase().includes(query) || (m.email || '').toLowerCase().includes(query);
        });

    const unreadCount = messages.filter(m => m.status === 'unread').length;

    return (
        <div className="admin-layout">
            <AdminNavbar active="messages" />
            <div className="admin-messages-page">
                <div className="messages-header-wrap">
                    <div className="header-info"><h2 className="bn-text">ইনবক্স / বার্তা</h2><p className="en-text text-muted">Manage contact form submissions</p></div>
                    <div className="stats-badges">
                        <div className="stat-badge unread-badge"><span className="count">{unreadCount}</span><span className="label bn-text">নতুন</span></div>
                        <div className="stat-badge total-badge"><span className="count">{messages.length}</span><span className="label bn-text">সর্বমোট</span></div>
                    </div>
                </div>

                <div className="controls-bar glass-panel">
                    <div className="search-box"><Search size={18} className="text-muted" /><input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /></div>
                    <div className="filter-tabs bn-text">
                        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>সকল</button>
                        <button className={filter === 'unread' ? 'active unread-tab' : ''} onClick={() => setFilter('unread')}>অপঠিত</button>
                        <button className={filter === 'read' ? 'active' : ''} onClick={() => setFilter('read')}>পঠিত</button>
                    </div>
                </div>

                <div className="messages-feed">
                    {loading ? (
                        <div className="loading-state"><p className="bn-text">বার্তা লোড হচ্ছে...</p></div>
                    ) : displayedMessages.length > 0 ? (
                        displayedMessages.map(msg => (
                            <div key={msg._id} className={`message-card ${msg.status === 'unread' ? 'is-unread' : ''}`}>
                                <div className="msg-header">
                                    <div className="sender-info"><div className="avatar">{msg.name?.charAt(0).toUpperCase()}</div><div><h4 className="bn-text">{msg.name}</h4><span className="en-text text-muted text-sm">{msg.email}</span></div></div>
                                    <div className="time-info text-muted"><Clock size={14} /><span className="text-sm">{new Date(msg.createdAt).toLocaleDateString()}</span></div>
                                </div>
                                <div className="msg-body"><h5 className="bn-text msg-subject">{msg.subject}</h5><p className="bn-text msg-text">{msg.message}</p></div>
                                <div className="msg-actions">
                                    <span className={`status-chip ${msg.status}`}>{msg.status}</span>
                                    <div className="action-buttons">
                                        {msg.status === 'unread' && <button onClick={() => updateStatus(msg._id, 'read')} className="action-btn mark-read"><CheckCircle size={16} /> Mark as Read</button>}
                                        {msg.status !== 'replied' && <button onClick={() => updateStatus(msg._id, 'replied')} className="action-btn mark-replied"><Mail size={16} /> Mark as Replied</button>}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (<div className="empty-state"><Mail size={48} /><h4 className="bn-text">কোনো বার্তা পাওয়া যায়নি</h4></div>)}
                </div>
            </div>
        </div>
    );
}

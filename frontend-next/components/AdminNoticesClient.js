'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Check, X, AlertCircle } from 'lucide-react';
import AdminNavbar from './AdminNavbar';
import '../styles/Admin.css';
import '../styles/AdminNotices.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function AdminNoticesClient() {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        text: '', link: '', priority: 'normal', isActive: true, sendEmail: false, testEmail: ''
    });

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('admin_token');
            const res = await axios.get(`${API_BASE_URL}/api/notices/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) setNotices(res.data.data);
        } catch (error) { console.error('Failed to fetch notices:', error); }
        finally { setLoading(false); }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const openAddModal = () => {
        setFormData({ text: '', link: '', priority: 'normal', isActive: true, sendEmail: false, testEmail: '' });
        setEditMode(false); setCurrentId(null); setShowModal(true);
    };

    const openEditModal = (notice) => {
        setFormData({ text: notice.text, link: notice.link || '', priority: notice.priority, isActive: notice.isActive, sendEmail: false, testEmail: '' });
        setEditMode(true); setCurrentId(notice._id); setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('admin_token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            if (editMode) {
                await axios.put(`${API_BASE_URL}/api/notices/${currentId}`, formData, config);
            } else {
                await axios.post(`${API_BASE_URL}/api/notices`, formData, config);
            }
            fetchNotices(); setShowModal(false);
        } catch (error) { console.error('Submit error:', error); alert('Failed to save notice.'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this notice?')) return;
        try {
            const token = localStorage.getItem('admin_token');
            await axios.delete(`${API_BASE_URL}/api/notices/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setNotices(notices.filter(n => n._id !== id));
        } catch (error) { console.error('Delete error:', error); }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            const token = localStorage.getItem('admin_token');
            await axios.put(`${API_BASE_URL}/api/notices/${id}`, { isActive: !currentStatus }, { headers: { Authorization: `Bearer ${token}` } });
            setNotices(notices.map(n => n._id === id ? { ...n, isActive: !currentStatus } : n));
        } catch (error) { console.error('Toggle error:', error); }
    };

    return (
        <div className="admin-layout">
            <AdminNavbar active="notices" />
            <div className="admin-notices-content">
                <div className="notices-header">
                    <div className="header-info">
                        <h2 className="bn-text">জরুরী নোটিশ ম্যানেজমেন্ট</h2>
                        <p className="en-text text-muted">Manage the scrolling ticker board</p>
                    </div>
                    <button className="btn-modern-primary" onClick={openAddModal}><Plus size={18} /> Add New Notice</button>
                </div>

                <div className="notices-table-container glass-panel">
                    {loading ? (
                        <div className="loading-state">Loading notices...</div>
                    ) : notices.length === 0 ? (
                        <div className="empty-state"><AlertCircle size={48} className="text-muted" style={{ opacity: 0.3 }} /><h4 className="bn-text mt-4">কোনো নোটিশ নেই</h4></div>
                    ) : (
                        <table className="notices-table">
                            <thead><tr className="en-text"><th>Status</th><th>Notice Text</th><th>Tag</th><th>Actions</th></tr></thead>
                            <tbody>
                                {notices.map(notice => (
                                    <tr key={notice._id} className={!notice.isActive ? 'is-inactive' : ''}>
                                        <td className="status-cell"><button className={`toggle-btn ${notice.isActive ? 'active' : 'inactive'}`} onClick={() => toggleStatus(notice._id, notice.isActive)}>{notice.isActive ? <Check size={16} /> : <X size={16} />}</button></td>
                                        <td className="text-cell bn-text"><p className="notice-text">{notice.text}</p>{notice.link && <a href={notice.link} target="_blank" rel="noreferrer" className="notice-link en-text text-sm">Has Link 🔗</a>}</td>
                                        <td className="tag-cell"><span className={`priority-tag ${notice.priority}`}>{notice.priority}</span></td>
                                        <td className="actions-cell"><button className="action-icon edit" onClick={() => openEditModal(notice)}><Edit2 size={16} /></button><button className="action-icon delete" onClick={() => handleDelete(notice._id)}><Trash2 size={16} /></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel">
                        <div className="modal-header">
                            <h3 className="bn-text">{editMode ? 'নোটিশ সম্পাদনা' : 'নতুন নোটিশ তৈরি'}</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="notice-form">
                            <div className="form-group"><label className="bn-text">নোটিশের টেক্সট *</label><textarea name="text" required className="modal-input bn-text" value={formData.text} onChange={handleInputChange} rows="3" /></div>
                            <div className="form-group"><label className="en-text">Link / URL (Optional)</label><input type="url" name="link" className="modal-input en-text" value={formData.link} onChange={handleInputChange} /></div>
                            <div className="form-row">
                                <div className="form-group"><label className="en-text">Priority Tag</label><select name="priority" className="modal-input en-text" value={formData.priority} onChange={handleInputChange}><option value="normal">Normal</option><option value="new">New</option><option value="urgent">Urgent</option></select></div>
                                <div className="form-group checkbox-group"><label className="checkbox-label"><input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} /><span className="bn-text font-bold">সক্রিয় (Active)</span></label></div>
                            </div>
                            {!editMode && (
                                <div className="notice-email-options">
                                    <label className="checkbox-label"><input type="checkbox" name="sendEmail" checked={formData.sendEmail} onChange={handleInputChange} /><span className="bn-text font-bold">এই নোটিশের ইমেইল পাঠাবো</span></label>
                                    {formData.sendEmail && <div className="form-group"><label className="en-text">Test Student Email *</label><input type="email" name="testEmail" required={formData.sendEmail} className="modal-input en-text" value={formData.testEmail} onChange={handleInputChange} /></div>}
                                </div>
                            )}
                            <div className="modal-actions"><button type="button" className="btn-modern-secondary" onClick={() => setShowModal(false)}>Cancel</button><button type="submit" className="btn-modern-submit">{editMode ? 'Update' : 'Publish'}</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

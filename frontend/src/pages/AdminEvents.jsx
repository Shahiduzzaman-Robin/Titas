import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, AlertCircle, Calendar, MapPin } from 'lucide-react';
import { API_BASE_URL } from '../constants';
import AdminNavbar from '../components/AdminNavbar';
import '../styles/AdminNotices.css';

const AdminEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        date: '',
        location: '',
        description: '',
        link: ''
    });

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('admin_token');
            const res = await axios.get(`${API_BASE_URL}/api/events/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setEvents(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const openAddModal = () => {
        setFormData({ title: '', date: '', location: '', description: '', link: '' });
        setEditMode(false);
        setShowModal(true);
    };

    const openEditModal = (event) => {
        setFormData({
            title: event.title,
            date: event.date.split('T')[0],
            location: event.location,
            description: event.description || '',
            link: event.link || ''
        });
        setEditMode(true);
        setCurrentId(event._id);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('admin_token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            if (editMode) {
                await axios.put(`${API_BASE_URL}/api/events/${currentId}`, formData, config);
            } else {
                await axios.post(`${API_BASE_URL}/api/events`, formData, config);
            }
            fetchEvents();
            setShowModal(false);
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this event?')) return;
        try {
            const token = localStorage.getItem('admin_token');
            await axios.delete(`${API_BASE_URL}/api/events/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchEvents();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    return (
        <div className="admin-layout">
            <AdminNavbar active="events" />
            <div className="admin-notices-content">
                <div className="notices-header">
                    <div className="header-info">
                        <h2 className="bn-text">ইভেন্ট ম্যানেজমেন্ট</h2>
                        <p className="en-text text-muted">Manage upcoming events and activities</p>
                    </div>
                    <button className="btn-modern-primary" onClick={openAddModal}>
                        <Plus size={18} /> Add Event
                    </button>
                </div>

                <div className="notices-table-container glass-panel">
                    {loading ? (
                        <div className="loading-state">Loading events...</div>
                    ) : events.length === 0 ? (
                        <div className="empty-state">
                            <AlertCircle size={48} className="text-muted" style={{ opacity: 0.3 }} />
                            <h4 className="bn-text mt-4">কোনো ইভেন্ট পাওয়া যায়নি</h4>
                        </div>
                    ) : (
                        <table className="notices-table">
                            <thead>
                                <tr className="en-text">
                                    <th>Date</th>
                                    <th>Event Details</th>
                                    <th>Location</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map(event => (
                                    <tr key={event._id}>
                                        <td className="en-text font-bold" style={{ width: '120px' }}>
                                            {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td>
                                            <div className="bn-text font-bold">{event.title}</div>
                                            <div className="bn-text text-sm text-muted">{event.description}</div>
                                        </td>
                                        <td>
                                            <div className="en-text text-sm flex items-center gap-1"><MapPin size={14} /> {event.location}</div>
                                        </td>
                                        <td className="actions-cell">
                                            <button className="action-icon edit" onClick={() => openEditModal(event)}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="action-icon delete" onClick={() => handleDelete(event._id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
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
                            <h3 className="bn-text">{editMode ? 'ইভেন্ট সম্পাদন' : 'নতুন ইভেন্ট যোগ করুন'}</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="notice-form">
                            <div className="form-group">
                                <label className="bn-text">ইভেন্ট শিরোনাম *</label>
                                <input type="text" name="title" required className="modal-input bn-text" value={formData.title} onChange={handleInputChange} />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="en-text">Date *</label>
                                    <input type="date" name="date" required className="modal-input" value={formData.date} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label className="bn-text">স্থান (Location) *</label>
                                    <input type="text" name="location" required className="modal-input bn-text" value={formData.location} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="bn-text">বিবরণ</label>
                                <textarea name="description" className="modal-input bn-text" value={formData.description} onChange={handleInputChange} rows="3" />
                            </div>

                            <div className="form-group">
                                <label className="en-text">Link (Optional)</label>
                                <input type="url" name="link" className="modal-input en-text" value={formData.link} onChange={handleInputChange} placeholder="https://..." />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-modern-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-modern-submit">{editMode ? 'Update' : 'Publish'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminEvents;

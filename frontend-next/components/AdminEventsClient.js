'use client';

import { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, AlertCircle, MapPin, Users } from 'lucide-react';
import AdminNavbar from './AdminNavbar';
import '../styles/Admin.css';
import '../styles/AdminNotices.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function AdminEventsClient() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showRsvpModal, setShowRsvpModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [rsvpRows, setRsvpRows] = useState([]);
    const [rsvpSummary, setRsvpSummary] = useState({ total: 0, going: 0, notGoing: 0, checkedIn: 0, absent: 0 });
    const [rsvpLoading, setRsvpLoading] = useState(false);
    const [rsvpSearch, setRsvpSearch] = useState('');
    const [responseFilter, setResponseFilter] = useState('all');
    const [attendanceFilter, setAttendanceFilter] = useState('all');

    const [formData, setFormData] = useState({ title: '', date: '', location: '', description: '', link: '', rsvpEnabled: true, capacity: 0, rsvpDeadline: '' });

    useEffect(() => { fetchEvents(); }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('admin_token');
            const res = await axios.get(`${API_BASE_URL}/api/events/all`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) setEvents(res.data.data);
        } catch (error) { console.error('Failed to fetch events:', error); }
        finally { setLoading(false); }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const openAddModal = () => {
        setFormData({ title: '', date: '', location: '', description: '', link: '', rsvpEnabled: true, capacity: 0, rsvpDeadline: '' });
        setEditMode(false); setShowModal(true);
    };

    const openEditModal = (event) => {
        setFormData({
            title: event.title, date: event.date.split('T')[0], location: event.location,
            description: event.description || '', link: event.link || '', rsvpEnabled: event.rsvpEnabled !== false,
            capacity: Number(event.capacity || 0), rsvpDeadline: event.rsvpDeadline ? event.rsvpDeadline.split('T')[0] : ''
        });
        setEditMode(true); setCurrentId(event._id); setShowModal(true);
    };

    const openRsvpModal = async (event) => {
        setSelectedEvent(event); setShowRsvpModal(true); setRsvpLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            const res = await axios.get(`${API_BASE_URL}/api/events/${event._id}/rsvps`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success) { setRsvpRows(res.data.data.rsvps || []); setRsvpSummary(res.data.data.summary || { total: 0, going: 0, notGoing: 0, checkedIn: 0, absent: 0 }); }
        } catch (error) { console.error('Failed to fetch RSVPs:', error); }
        finally { setRsvpLoading(false); }
    };

    const updateAttendance = async (rsvpId, attendanceStatus) => {
        if (!selectedEvent?._id) return;
        try {
            const token = localStorage.getItem('admin_token');
            await axios.patch(`${API_BASE_URL}/api/events/${selectedEvent._id}/rsvps/${rsvpId}/attendance`, { attendanceStatus }, { headers: { Authorization: `Bearer ${token}` } });
            const nextRows = rsvpRows.map((item) => (item._id === rsvpId ? { ...item, attendanceStatus, checkedInAt: attendanceStatus === 'checked_in' ? new Date().toISOString() : null } : item));
            setRsvpRows(nextRows);
            setRsvpSummary((prev) => ({ ...prev, checkedIn: nextRows.filter((item) => item.attendanceStatus === 'checked_in').length, absent: nextRows.filter((item) => item.attendanceStatus === 'absent').length }));
        } catch (error) { console.error('Failed to update attendance:', error); }
    };

    const filteredRsvpRows = useMemo(() => {
        const keyword = rsvpSearch.trim().toLowerCase();
        return rsvpRows.filter((row) => {
            const matchesResponse = responseFilter === 'all' || row.response === responseFilter;
            const matchesAttendance = attendanceFilter === 'all' || (row.attendanceStatus || 'pending') === attendanceFilter;
            const haystack = [row.fullName, row.email, row.phone, row.department, row.session].filter(Boolean).join(' ').toLowerCase();
            return matchesResponse && matchesAttendance && (!keyword || haystack.includes(keyword));
        });
    }, [rsvpRows, rsvpSearch, responseFilter, attendanceFilter]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('admin_token');
            const payload = { ...formData, capacity: Number(formData.capacity || 0), rsvpDeadline: formData.rsvpDeadline || null };
            const config = { headers: { Authorization: `Bearer ${token}` } };
            if (editMode) await axios.put(`${API_BASE_URL}/api/events/${currentId}`, payload, config);
            else await axios.post(`${API_BASE_URL}/api/events`, payload, config);
            fetchEvents(); setShowModal(false);
        } catch (error) { console.error('Submit error:', error); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this event?')) return;
        try {
            const token = localStorage.getItem('admin_token');
            await axios.delete(`${API_BASE_URL}/api/events/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchEvents();
        } catch (error) { console.error('Delete error:', error); }
    };

    return (
        <div className="admin-layout">
            <AdminNavbar active="events" />
            <div className="admin-notices-content">
                <div className="notices-header">
                    <div className="header-info"><h2 className="bn-text">ইভেন্ট ম্যানেজমেন্ট</h2><p className="en-text text-muted">Manage events and activities</p></div>
                    <button className="btn-modern-primary" onClick={openAddModal}><Plus size={18} /> Add Event</button>
                </div>

                <div className="notices-table-container glass-panel">
                    {loading ? (
                        <div className="loading-state">Loading events...</div>
                    ) : events.length === 0 ? (
                        <div className="empty-state"><AlertCircle size={48} className="text-muted" style={{ opacity: 0.3 }} /><h4 className="bn-text mt-4">কোনো ইভেন্ট পাওয়া যায়নি</h4></div>
                    ) : (
                        <table className="notices-table">
                            <thead><tr className="en-text"><th>Date</th><th>Event Details</th><th>Location</th><th>Registration</th><th>Actions</th></tr></thead>
                            <tbody>
                                {events.map(event => (
                                    <tr key={event._id}>
                                        <td className="en-text font-bold" style={{ width: '120px' }}>{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                        <td><div className="bn-text font-bold">{event.title}</div><div className="bn-text text-sm text-muted">{event.description}</div></td>
                                        <td><div className="en-text text-sm flex items-center gap-1"><MapPin size={14} /> {event.location}</div></td>
                                        <td><button className="btn-outline-modern" onClick={() => openRsvpModal(event)}><Users size={14} /> {event?.rsvpSummary?.going || 0} Going</button></td>
                                        <td className="actions-cell">
                                            <button className="action-icon edit" onClick={() => openEditModal(event)}><Edit2 size={16} /></button>
                                            <button className="action-icon delete" onClick={() => handleDelete(event._id)}><Trash2 size={16} /></button>
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
                            <div className="form-group"><label className="bn-text">ইভেন্ট শিরোনাম *</label><input type="text" name="title" required className="modal-input bn-text" value={formData.title} onChange={handleInputChange} /></div>
                            <div className="form-row">
                                <div className="form-group"><label className="en-text">Date *</label><input type="date" name="date" required className="modal-input" value={formData.date} onChange={handleInputChange} /></div>
                                <div className="form-group"><label className="bn-text">স্থান (Location) *</label><input type="text" name="location" required className="modal-input bn-text" value={formData.location} onChange={handleInputChange} /></div>
                            </div>
                            <div className="form-group"><label className="bn-text">বিবরণ</label><textarea name="description" className="modal-input bn-text" value={formData.description} onChange={handleInputChange} rows="3" /></div>
                            <div className="form-group"><label className="en-text">Link (Optional)</label><input type="url" name="link" className="modal-input en-text" value={formData.link} onChange={handleInputChange} /></div>
                            <div className="form-row">
                                <div className="form-group"><label className="en-text">Capacity (0=Unltd)</label><input type="number" min="0" name="capacity" className="modal-input" value={formData.capacity} onChange={handleInputChange} /></div>
                                <div className="form-group"><label className="en-text">RSVP Deadline</label><input type="date" name="rsvpDeadline" className="modal-input" value={formData.rsvpDeadline} onChange={handleInputChange} /></div>
                            </div>
                            <div className="checkbox-group"><label className="checkbox-label en-text"><input type="checkbox" name="rsvpEnabled" checked={formData.rsvpEnabled} onChange={(e) => setFormData((prev) => ({ ...prev, rsvpEnabled: e.target.checked }))} /> Enable registration</label></div>
                            <div className="modal-actions"><button type="button" className="btn-modern-secondary" onClick={() => setShowModal(false)}>Cancel</button><button type="submit" className="btn-modern-submit">{editMode ? 'Update' : 'Publish'}</button></div>
                        </form>
                    </div>
                </div>
            )}

            {showRsvpModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel" style={{ maxWidth: '980px' }}>
                        <div className="modal-header">
                            <h3 className="bn-text">Registration ও Attendance</h3>
                            <button className="close-btn" onClick={() => setShowRsvpModal(false)}><X size={20} /></button>
                        </div>
                        <div className="rsvp-toolbar">
                            <input type="text" className="modal-input" placeholder="Search..." value={rsvpSearch} onChange={(e) => setRsvpSearch(e.target.value)} />
                            <select className="modal-input" value={responseFilter} onChange={(e) => setResponseFilter(e.target.value)}><option value="all">All Responses</option><option value="going">Going</option></select>
                        </div>
                        {rsvpLoading ? (
                            <div className="loading-state">Loading...</div>
                        ) : (
                            <div className="notices-table-container">
                                <table className="notices-table">
                                    <thead><tr className="en-text"><th>Name</th><th>Contact</th><th>Response</th><th>Attendance</th></tr></thead>
                                    <tbody>
                                        {filteredRsvpRows.map((row) => (
                                            <tr key={row._id}>
                                                <td><div className="bn-text font-bold">{row.fullName}</div><div className="en-text text-sm text-muted">{row.department} ({row.session})</div></td>
                                                <td className="en-text text-sm"><div>{row.email}</div><div>{row.phone}</div></td>
                                                <td><span className={`status-pill ${row.response === 'going' ? 'good' : 'off'}`}>{row.response}</span></td>
                                                <td><select className="modal-input" value={row.attendanceStatus || 'pending'} onChange={(e) => updateAttendance(row._id, e.target.value)}><option value="pending">Pending</option><option value="checked_in">Checked In</option><option value="absent">Absent</option></select></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

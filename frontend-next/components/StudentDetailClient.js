'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Pencil, Trash2, CheckCircle, XCircle, Clock, X } from 'lucide-react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import CustomSelect from './CustomSelect';
import { departmentOptions, sessionOptions, hallOptions, bloodGroupOptions, upazilaOptions, genderOptions } from '../lib/constants';
import '../styles/Admin.css';
import '../styles/AdminStudentDetail.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function StudentDetailClient() {
    const { id } = useParams();
    const router = useRouter();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const [saving, setSaving] = useState(false);
    const [showAll, setShowAll] = useState(false);
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
        if (id && token) {
            axios.get(`${API_BASE_URL}/api/admin/students/${id}`, { headers: { Authorization: `Bearer ${token}` } })
                .then(r => setStudent(r.data))
                .catch((err) => {
                    const status = err?.response?.status;
                    if (status === 401 || status === 403) {
                        localStorage.removeItem('admin_token');
                        localStorage.removeItem('admin_user');
                        router.push('/login');
                        return;
                    }
                    router.push('/admin/students');
                })
                .finally(() => setLoading(false));
        }
    }, [id, token, router]);

    const handleStatus = async (newStatus) => {
        try {
            await axios.put(`${API_BASE_URL}/api/admin/students/${id}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
            setStudent(prev => ({ ...prev, status: newStatus }));
        } catch (err) { console.error(err); }
    };

    const openEditModal = () => {
        setEditForm({ ...student });
        setIsEditModalOpen(true);
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? true : false) : value
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await axios.put(`${API_BASE_URL}/api/admin/students/${id}`, editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudent(res.data);
            setIsEditModalOpen(false);
        } catch (err) {
            console.error(err);
            alert('Error updating student');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteStudent = async () => {
        const confirmed = window.confirm('আপনি কি নিশ্চিতভাবে এই শিক্ষার্থীকে মুছে ফেলতে চান? এই কাজটি আর ফিরিয়ে আনা যাবে না।');
        if (!confirmed) return;

        try {
            await axios.delete(`${API_BASE_URL}/api/admin/students/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            router.push('/admin/students');
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.msg || 'Delete failed';
            alert(msg);
        }
    };

    if (loading) return (
        <div className="admin-layout">
            <AdminNavbar active="students" />
            <div style={{ textAlign: 'center', padding: '5rem', color: '#64748b' }}>লোডিং...</div>
        </div>
    );

    if (!student) return null;

    const statusKey = (student.status || 'Pending').toLowerCase();
    const statusBn = { approved: 'অনুমোদিত', pending: 'অপেক্ষমাণ', rejected: 'প্রত্যাখ্যাত' }[statusKey];

    const activities = student.activities || [];
    const displayedActivities = showAll ? activities : activities.slice(0, 3);

    return (
        <div className="admin-layout">
            <AdminNavbar active="students" />
            <div className="admin-main">
                <div className="asd-topbar">
                    <div className="asd-topbar-left">
                        <button className="asd-back-btn" onClick={() => router.push('/admin/students')}>
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <h1 className="asd-name">
                                {student.nameEn} <span className="bn-text asd-name-bn">({student.nameBn})</span>
                            </h1>
                            <div className="asd-meta">
                                <span>ID: {student.regNo}</span>
                                <span className="asd-dot">·</span>
                                <span>{student.session}</span>
                                <span className="asd-dot">·</span>
                                <span>{student.department}</span>
                            </div>
                        </div>
                    </div>
                    <div className="asd-topbar-right">
                        <button className="asd-action-btn edit" onClick={openEditModal}><Pencil size={15} /> <span className="bn-text">সম্পাদনা করুন</span></button>
                        <button className="asd-action-btn delete" onClick={handleDeleteStudent} title="শিক্ষার্থী মুছে ফেলুন"><Trash2 size={15} /></button>
                    </div>
                </div>

                <div className="asd-tabs">
                    <button className={`asd-tab bn-text ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>প্রোফাইল পর্যালোচনা</button>
                    <button className={`asd-tab bn-text ${activeTab === 'id' ? 'active' : ''}`} onClick={() => setActiveTab('id')}>ডিজিটাল স্টুডেন্ট আইডি</button>
                </div>

                {activeTab === 'profile' && (
                    <div className="asd-grid">
                        <div className="asd-left">
                            <div className="asd-card asd-photo-card">
                                {student.photo
                                    ? <img src={`${API_BASE_URL}${student.photo}`} alt="profile" className="asd-photo" />
                                    : <div className="asd-photo-placeholder">👤</div>
                                }
                                <span className={`status-badge ${statusKey} bn-text`}>{statusBn}</span>
                                <div className="asd-titas-id">TITAS-{student.regNo}</div>

                                <div className="asd-status-actions">
                                    {student.status !== 'Approved' && (
                                        <button className="asd-status-btn approve bn-text" onClick={() => handleStatus('Approved')}>
                                            <CheckCircle size={14} /> অনুমোদন করুন
                                        </button>
                                    )}
                                    {student.status !== 'Rejected' && (
                                        <button className="asd-status-btn reject bn-text" onClick={() => handleStatus('Rejected')}>
                                            <XCircle size={14} /> প্রত্যাখ্যাত করুন
                                        </button>
                                    )}
                                    {student.status === 'Approved' && (
                                        <button className="asd-status-btn revert bn-text" onClick={() => handleStatus('Pending')}>
                                            <Clock size={14} /> অপেক্ষমাণে ফেরান
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="asd-card">
                                <div className="asd-card-title bn-text">যোগাযোগের তথ্য</div>
                                <div className="asd-field">
                                    <div className="asd-field-label">মোবাইল</div>
                                    <div className="asd-field-value">{student.mobile}</div>
                                </div>
                                {student.email && (
                                    <div className="asd-field">
                                        <div className="asd-field-label">ইমেইল</div>
                                        <div className="asd-field-value">{student.email}</div>
                                    </div>
                                )}
                            </div>

                            <div className="asd-card">
                                <div className="asd-card-title bn-text">চাকরির তথ্য</div>
                                <div className="asd-field">
                                    <div className="asd-field-label">প্রতিষ্ঠান / দপ্তর এর নাম</div>
                                    <div className="asd-field-value">{student.organization || '—'}</div>
                                </div>
                                <div className="asd-field">
                                    <div className="asd-field-label">পদবী</div>
                                    <div className="asd-field-value">{student.jobTitle || '—'}</div>
                                </div>
                            </div>

                            {student.activities && student.activities.length > 0 && (
                                <div className="asd-card">
                                    <div className="asd-card-title bn-text">অ্যাক্টিভিটি লগ</div>
                                    <div className="asd-activities">
                                        {displayedActivities.map((act, idx) => {
                                            const d = new Date(act.timestamp);
                                            const timeStr = d.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
                                            const dateStr = d.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });

                                            const detailsObj = act.details && typeof act.details === 'object'
                                                ? (act.details instanceof Map ? Object.fromEntries(act.details) : act.details)
                                                : null;

                                            return (
                                                <div key={idx} className="asd-activity-item">
                                                    <div className="asd-activity-icon"></div>
                                                    <div className="asd-activity-content">
                                                        <div className="asd-activity-title bn-text">{act.actionTitle}</div>
                                                        <div className="asd-activity-meta bn-text">
                                                            <span>{act.adminName || 'Admin'}</span>
                                                            <span className="asd-dot">·</span>
                                                            <span>{dateStr} {timeStr}</span>
                                                        </div>
                                                        {detailsObj && Object.keys(detailsObj).length > 0 && (
                                                            <div className="asd-activity-details bn-text">
                                                                {Object.entries(detailsObj).map(([key, diff], i) => (
                                                                    <div key={i} className="asd-diff-item">
                                                                        <span className="asd-diff-key">{key}:</span>
                                                                        <span className="asd-diff-old">{diff.oldValue || '—'}</span>
                                                                        <ArrowLeft size={10} style={{ transform: 'rotate(180deg)' }} />
                                                                        <span className="asd-diff-new">{diff.newValue}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {!showAll && activities.length > 3 && (
                                            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                                                <button
                                                    onClick={() => setShowAll(true)}
                                                    className="bn-text"
                                                    style={{ background: '#f1f5f9', border: 'none', color: '#64748b', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                                                >
                                                    পুরানো রেকর্ড দেখুন (See {activities.length - 3} More)
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="asd-right">
                            <div className="asd-card">
                                <div className="asd-card-title bn-text">একাডেমিক তথ্য</div>
                                <div className="asd-field">
                                    <div className="asd-field-label">সেশন</div>
                                    <div className="asd-field-value">{student.session}</div>
                                </div>
                                <div className="asd-field">
                                    <div className="asd-field-label">ডিপার্টমেন্ট / ইন্সটিটিউট</div>
                                    <div className="asd-field-value">{student.department}</div>
                                </div>
                                <div className="asd-field">
                                    <div className="asd-field-label">রেজিস্ট্রেশন নম্বর</div>
                                    <div className="asd-field-value">{student.regNo}</div>
                                </div>
                            </div>

                            <div className="asd-card">
                                <div className="asd-card-title bn-text">আবাসিক তথ্য</div>
                                <div className="asd-field">
                                    <div className="asd-field-label">হল</div>
                                    <div className="asd-field-value">{student.hall || '—'}</div>
                                </div>
                                <div className="asd-field">
                                    <div className="asd-field-label">উপজেলা</div>
                                    <div className="asd-field-value">{student.upazila || '—'}</div>
                                </div>
                                <div className="asd-field">
                                    <div className="asd-field-label">রক্তের গ্রুপ</div>
                                    <div className="asd-field-value">{student.bloodGroup || '—'}</div>
                                </div>
                            </div>

                            <div className="asd-card">
                                <div className="asd-card-title bn-text">ঠিকানা</div>
                                <div className="asd-field">
                                    <div className="asd-field-label">বর্তমান ঠিকানা</div>
                                    <div className="asd-field-value">{student.addressEn || '—'}</div>
                                </div>
                                <div className="asd-field">
                                    <div className="asd-field-label">বর্তমান ঠিকানা (বাংলা)</div>
                                    <div className="asd-field-value">{student.addressBn || '—'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'id' && (
                    <div className="asd-id-tab">
                        <div className="asd-id-card-wrapper">
                            <div className="asd-id-front">
                                <div className="bn-text" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                    আইডি কার্ড প্রিভিউ শীঘ্রই আসছে...
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {isEditModalOpen && editForm && (
                <div className="edit-modal-overlay">
                    <div className="edit-modal">
                        <div className="edit-modal-header">
                            <h2 className="bn-text">শিক্ষার্থীর তথ্য সম্পাদনা</h2>
                            <button className="close-btn" onClick={() => setIsEditModalOpen(false)}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="edit-modal-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="bn-text">নাম (বাংলা)</label>
                                    <input type="text" name="nameBn" value={editForm.nameBn} onChange={handleEditChange} required className="bn-text" />
                                </div>
                                <div className="form-group">
                                    <label className="bn-text">নাম (ইংরেজি)</label>
                                    <input type="text" name="nameEn" value={editForm.nameEn} onChange={handleEditChange} required />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="bn-text">ডিপার্টমেন্ট</label>
                                    <CustomSelect name="department" value={editForm.department} onChange={handleEditChange} options={departmentOptions} placeholder="ডিপার্টমেন্ট নির্বাচন করুন" />
                                </div>
                                <div className="form-group">
                                    <label className="bn-text">সেশন</label>
                                    <CustomSelect name="session" value={editForm.session} onChange={handleEditChange} options={sessionOptions} placeholder="সেশন নির্বাচন করুন" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="bn-text">হল</label>
                                    <CustomSelect name="hall" value={editForm.hall} onChange={handleEditChange} options={hallOptions} placeholder="হল নির্বাচন করুন" />
                                </div>
                                <div className="form-group">
                                    <label className="bn-text">রেজিস্ট্রেশন নম্বর</label>
                                    <input type="text" name="regNo" value={editForm.regNo} onChange={handleEditChange} required />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="bn-text">মোবাইল নম্বর</label>
                                    <input type="text" name="mobile" value={editForm.mobile} onChange={handleEditChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="bn-text">ইমেইল</label>
                                    <input type="email" name="email" value={editForm.email} onChange={handleEditChange} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="bn-text">উপজেলা</label>
                                    <CustomSelect name="upazila" value={editForm.upazila} onChange={handleEditChange} options={upazilaOptions} placeholder="উপজেলা নির্বাচন করুন" />
                                </div>
                                <div className="form-group">
                                    <label className="bn-text">রক্তের গ্রুপ</label>
                                    <CustomSelect name="bloodGroup" value={editForm.bloodGroup} onChange={handleEditChange} options={bloodGroupOptions} placeholder="রক্তের গ্রুপ নির্বাচন করুন" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="bn-text">ঠিকানা (বাংলা)</label>
                                    <input type="text" name="addressBn" value={editForm.addressBn} onChange={handleEditChange} className="bn-text" />
                                </div>
                                <div className="form-group">
                                    <label className="bn-text">ঠিকানা (ইংরেজি)</label>
                                    <input type="text" name="addressEn" value={editForm.addressEn} onChange={handleEditChange} />
                                </div>
                            </div>

                            <div className="form-group checkbox-group" style={{ flexDirection: 'row', alignItems: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
                                <input type="checkbox" id="isEmployedEdit" name="isEmployed" checked={editForm.isEmployed} onChange={handleEditChange} />
                                <label htmlFor="isEmployedEdit" className="bn-text" style={{ margin: 0, marginLeft: '0.5rem' }}>এই শিক্ষার্থী কি চাকরিজীবী?</label>
                            </div>

                            {editForm.isEmployed && (
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="bn-text">প্রতিষ্ঠান / দপ্তরের নাম</label>
                                        <input type="text" name="organization" value={editForm.organization || ''} onChange={handleEditChange} className="bn-text" />
                                    </div>
                                    <div className="form-group">
                                        <label className="bn-text">পদবী (Job Title)</label>
                                        <input type="text" name="jobTitle" value={editForm.jobTitle || ''} onChange={handleEditChange} className="bn-text" />
                                    </div>
                                </div>
                            )}

                            <div className="edit-modal-actions">
                                <button type="button" className="cancel-btn bn-text" onClick={() => setIsEditModalOpen(false)}>বাতিল</button>
                                <button type="submit" className="save-btn bn-text" disabled={saving}>
                                    {saving ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সেভ করুন'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

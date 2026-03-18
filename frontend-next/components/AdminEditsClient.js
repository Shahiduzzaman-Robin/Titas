'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import '../styles/Admin.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const FIELD_LABELS = {
    nameBn: 'নাম (বাংলা)', nameEn: 'নাম (ইংরেজি)', mobile: 'মোবাইল', email: 'ইমেইল',
    addressEn: 'ঠিকানা (ইংরেজি)', addressBn: 'ঠিকানা (বাংলা)', upazila: 'উপজেলা',
    bloodGroup: 'রক্তের গ্রুপ', gender: 'লিঙ্গ', organization: 'প্রতিষ্ঠান', jobTitle: 'পদবী',
    photo: 'প্রোফাইল ছবি'
};

const EditCard = ({ edit, onApprove, onReject }) => {
    const [expanded, setExpanded] = useState(true);
    const s = edit.student;
    const statusKey = (edit.status || 'Pending').toLowerCase();
    const statusStyle = {
        pending: { bg: '#f1f5f9', color: '#475569', label: 'অপেক্ষমাণ' },
        approved: { bg: '#f1f5f9', color: '#475569', label: 'অনুমোদিত' },
        rejected: { bg: '#f1f5f9', color: '#475569', label: 'প্রত্যাখ্যাত' },
    }[statusKey] || {};

    const changes = edit.changes instanceof Map ? Object.fromEntries(edit.changes) : edit.changes;

    return (
        <div style={{
            background: '#fff', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            border: '1px solid #f1f5f9', marginBottom: '1rem', overflow: 'hidden'
        }}>
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '1rem 1.25rem', borderBottom: expanded ? '1px solid #f1f5f9' : 'none',
                cursor: 'pointer', background: '#fafafa'
            }} onClick={() => setExpanded(e => !e)}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {s?.photo
                        ? <img src={`${API_BASE_URL}${s.photo}`} alt="" style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }} />
                        : <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>👤</div>
                    }
                    <div>
                        <div style={{ fontWeight: 700, color: '#1a1a2e', fontSize: '0.95rem' }}>{s?.nameEn}</div>
                        <div className="bn-text" style={{ fontSize: '0.8rem', color: '#64748b' }}>{s?.nameBn} · {s?.session} · {s?.department}</div>
                    </div>
                    <div>
                        <span style={{
                            padding: '0.2rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem',
                            fontWeight: 600, background: statusStyle.bg, color: statusStyle.color
                        }} className="bn-text">{statusStyle.label}</span>
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                            {Object.keys(changes).length} টি পরিবর্তন
                        </span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {new Date(edit.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    {expanded ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
                </div>
            </div>

            {expanded && (
                <div style={{ padding: '1.25rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{
                            display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '0',
                            border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden'
                        }}>
                            <div style={{ background: '#f8fafc', padding: '0.6rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>ক্ষেত্র</div>
                            <div style={{ background: '#f8fafc', padding: '0.6rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>আগে (পুরনো)</div>
                            <div style={{ background: '#f8fafc', padding: '0.6rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' }}>পরে (নতুন)</div>

                            {Object.entries(changes).map(([field, diff], i) => (
                                <React.Fragment key={field}>
                                    <div style={{ padding: '0.65rem 1rem', fontSize: '0.82rem', color: '#475569', fontWeight: 600, borderRight: '1px solid #e2e8f0', borderBottom: i < Object.keys(changes).length - 1 ? '1px solid #f1f5f9' : 'none', background: '#fafbfc' }} className="bn-text">
                                        {FIELD_LABELS[field] || field}
                                    </div>
                                    <div style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', color: '#64748b', borderRight: '1px solid #e2e8f0', borderBottom: i < Object.keys(changes).length - 1 ? '1px solid #f1f5f9' : 'none', background: '#fafbfc' }} className="bn-text">
                                        {field === 'photo' && diff.oldValue ? (
                                            <img src={`${API_BASE_URL}${diff.oldValue}`} alt="Old" style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '4px', border: '1px solid #e2e8f0' }} />
                                        ) : (
                                            <span style={{ textDecoration: 'line-through' }}>{diff.oldValue || '—'}</span>
                                        )}
                                    </div>
                                    <div style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', color: '#1a1a2e', fontWeight: 600, borderBottom: i < Object.keys(changes).length - 1 ? '1px solid #f1f5f9' : 'none', background: '#fff' }} className="bn-text">
                                        {field === 'photo' && diff.newValue ? (
                                            <img src={`${API_BASE_URL}${diff.newValue}`} alt="New" style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '4px', border: '1px solid #e2e8f0' }} />
                                        ) : (
                                            <span>{diff.newValue || '—'}</span>
                                        )}
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {edit.status !== 'Pending' && (
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                            Reviewed by <strong>{edit.reviewedBy}</strong> on {new Date(edit.reviewedAt).toLocaleString()}
                        </div>
                    )}

                    {edit.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={() => onApprove(edit._id)} style={{
                                flex: 1, padding: '0.6rem 1rem', background: '#1a1a2e', color: '#fff',
                                border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                            }} className="bn-text">
                                <CheckCircle size={16} /> অনুমোদন করুন — পরিবর্তন সক্রিয় হবে
                            </button>
                            <button onClick={() => onReject(edit._id)} style={{
                                flex: 1, padding: '0.6rem 1rem', background: '#f1f5f9', color: '#475569',
                                border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                            }} className="bn-text">
                                <XCircle size={16} /> প্রত্যাখ্যাত করুন
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

import React from 'react';

export default function AdminEditsClient() {
    const [edits, setEdits] = useState([]);
    const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Pending');
    const [toast, setToast] = useState(null);
    const router = useRouter();
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
        if (token) fetchAll();
    }, [filter, token]);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [editsRes, statsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/admin/edits?status=${filter}`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_BASE_URL}/api/admin/edits/stats`, { headers: { Authorization: `Bearer ${token}` } }),
            ]);
            setEdits(editsRes.data);
            setStats(statsRes.data);
        } catch (err) {
            const status = err?.response?.status;
            if (status === 401 || status === 403) {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                router.push('/login');
                return;
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (msg, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3000);
    };

    const handleApprove = async (id) => {
        try {
            await axios.put(`${API_BASE_URL}/api/admin/edits/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
            showToast('পরিবর্তন অনুমোদিত এবং সক্রিয়!', true);
            fetchAll();
        } catch (err) {
            showToast('ত্রুটি হয়েছে', false);
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.put(`${API_BASE_URL}/api/admin/edits/${id}/reject`, {}, { headers: { Authorization: `Bearer ${token}` } });
            showToast('পরিবর্তন প্রত্যাখ্যাত হয়েছে', false);
            fetchAll();
        } catch (err) {
            showToast('ত্রুটি হয়েছে', false);
        }
    };

    return (
        <div className="admin-layout">
            <AdminNavbar active="edits" />

            {toast && (
                <div style={{
                    position: 'fixed', top: '5rem', right: '1.5rem', zIndex: 9999,
                    padding: '0.75rem 1.25rem', borderRadius: '10px', fontWeight: 600,
                    background: toast.ok ? '#dcfce7' : '#fee2e2',
                    color: toast.ok ? '#15803d' : '#dc2626',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                }} className="bn-text">{toast.msg}</div>
            )}

            <div className="admin-main">
                <div className="admin-page-header">
                    <div>
                        <h1 className="bn-text">অপেক্ষমাণ সম্পাদনা</h1>
                        <p className="bn-text">শিক্ষার্থীদের প্রোফাইল পরিবর্তনের অনুরোধ</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
                    {[
                        { key: 'Pending', label: 'অপেক্ষমাণ', count: stats.pending, icon: <Clock size={16} /> },
                        { key: 'Approved', label: 'অনুমোদিত', count: stats.approved, icon: <CheckCircle size={16} /> },
                        { key: 'Rejected', label: 'প্রত্যাখ্যাত', count: stats.rejected, icon: <XCircle size={16} /> },
                    ].map(item => {
                        const isActive = filter === item.key;
                        return (
                            <button key={item.key} onClick={() => setFilter(item.key)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.75rem 0',
                                    border: 'none',
                                    borderBottom: isActive ? '2px solid #1a1a2e' : '2px solid transparent',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    color: isActive ? '#1a1a2e' : '#64748b',
                                    fontWeight: isActive ? 600 : 500,
                                    transition: 'all 0.2s',
                                    marginBottom: '-1px'
                                }}>
                                {item.icon}
                                <span className="bn-text" style={{ fontSize: '0.9rem' }}>{item.label}</span>
                                <span style={{
                                    fontSize: '0.75rem', fontWeight: 700,
                                    background: isActive ? '#f1f5f9' : '#f8fafc',
                                    color: isActive ? '#1a1a2e' : '#94a3b8',
                                    padding: '0.1rem 0.5rem', borderRadius: '10px'
                                }}>{item.count}</span>
                            </button>
                        );
                    })}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }} className="bn-text">লোডিং...</div>
                ) : edits.length === 0 ? (
                    <div style={{
                        background: '#fff', borderRadius: '14px', padding: '3rem',
                        textAlign: 'center', color: '#94a3b8', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                    }} className="bn-text">
                        {filter === 'Pending' ? 'কোনো অনুমোদনের অপেক্ষায় নেই।' : 'কোনো ইতিহাস পাওয়া যায়নি।'}
                    </div>
                ) : (
                    edits.map(edit => (
                        <EditCard key={edit._id} edit={edit} onApprove={handleApprove} onReject={handleReject} />
                    ))
                )}
            </div>
        </div>
    );
}

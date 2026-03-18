'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Eye, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import CustomSelect from './CustomSelect';
import '../styles/Admin.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const SESSIONS = ['সর্ব সেশন', '2024-2025', '2023-2024', '2022-2023', '2021-2022', '2020-2021', '2019-2020', '2018-2019', '2017-2018'];
const STATUSES = ['সর্ব স্ট্যাটাস', 'Pending', 'Approved', 'Rejected'];

function StudentsList() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialStatus = searchParams.get('status') || '';

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [filters, setFilters] = useState({
        session: '', department: '', hall: '', upazila: '',
        status: initialStatus,
        search: ''
    });
    const [departments, setDepartments] = useState([]);
    const [halls, setHalls] = useState([]);
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
        if (token) fetchStudents();
    }, [filters, token]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.session) params.session = filters.session;
            if (filters.department) params.department = filters.department;
            if (filters.hall) params.hall = filters.hall;
            if (filters.upazila) params.upazila = filters.upazila;
            if (filters.status) params.status = filters.status;
            if (filters.search) params.search = filters.search;

            const res = await axios.get(`${API_BASE_URL}/api/admin/students`, { 
                headers: { Authorization: `Bearer ${token}` }, 
                params 
            });
            setStudents(res.data);
            
            // Extract unique values for filters if not already set or whenever data changes
            const depts = [...new Set(res.data.map(s => s.department).filter(Boolean))];
            const hl = [...new Set(res.data.map(s => s.hall).filter(Boolean))];
            setDepartments(depts);
            setHalls(hl);
        } catch (err) {
            const status = err?.response?.status;
            if (status === 401 || status === 403) {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                router.push('/login');
                return;
            }
            console.error('Failed to fetch students:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (studentId, newStatus) => {
        try {
            await axios.put(`${API_BASE_URL}/api/admin/students/${studentId}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
            fetchStudents();
        } catch (err) {
            console.error(err);
        }
    };

    const handleExportApproved = async () => {
        setExporting(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/students/export/approved`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            const contentDisposition = res.headers['content-disposition'] || '';
            const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
            const filename = filenameMatch?.[1] || `titas-approved-students.xlsx`;

            const blob = new Blob([res.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (err) {
            console.error('Failed to export students:', err);
            window.alert('Approved students export failed.');
        } finally {
            setExporting(false);
        }
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return {
            date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        };
    };

    const getTitasId = (i) => `TITAS-${String(students.length - i).padStart(4, '0')}`;

    const statusLabels = { approved: 'অনুমোদিত', pending: 'অপেক্ষমাণ', rejected: 'প্রত্যাখ্যাত' };

    // Summary counts
    const counts = {
        total: students.length,
        approved: students.filter(s => s.status === 'Approved').length,
        pending: students.filter(s => s.status === 'Pending').length,
        rejected: students.filter(s => s.status === 'Rejected').length
    };

    return (
        <div className="admin-layout">
            <AdminNavbar active="students" />
            <div className="admin-main">
                <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 className="bn-text">শিক্ষার্থী তালিকা</h1>
                        <p className="bn-text">সকল নিবন্ধিত শিক্ষার্থীদের তথ্য</p>
                    </div>
                    <button
                        onClick={handleExportApproved}
                        disabled={exporting}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.5rem 1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: exporting ? 'not-allowed' : 'pointer', color: '#475569', opacity: exporting ? 0.7 : 1 }}
                    >
                        <Download size={16} /> {exporting ? 'Exporting...' : 'Export'}
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
                    {[
                        { label: 'মোট', key: '', count: counts.total, icon: null },
                        { label: 'অনুমোদিত', key: 'Approved', count: counts.approved, icon: <CheckCircle size={16} /> },
                        { label: 'অপেক্ষমাণ', key: 'Pending', count: counts.pending, icon: <Clock size={16} /> },
                        { label: 'প্রত্যাখ্যাত', key: 'Rejected', count: counts.rejected, icon: <XCircle size={16} /> },
                    ].map(item => {
                        const isActive = filters.status === item.key;
                        return (
                            <button key={item.label} onClick={() => setFilters({ ...filters, status: item.key })}
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

                <div className="admin-card" style={{ padding: '1rem 1.25rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ minWidth: '140px', flex: 1 }}>
                            <CustomSelect
                                name="session"
                                value={filters.session || 'সর্ব সেশন'}
                                onChange={e => setFilters({ ...filters, session: e.target.value === 'সর্ব সেশন' ? '' : e.target.value })}
                                options={SESSIONS.map(s => ({ label: s, value: s }))}
                                placeholder="সর্ব সেশন"
                                className="bn-text"
                            />
                        </div>
                        <div style={{ minWidth: '160px', flex: 1 }}>
                            <CustomSelect
                                name="department"
                                value={filters.department || 'সর্ব ডিপার্টমেন্ট'}
                                onChange={e => setFilters({ ...filters, department: e.target.value === 'সর্ব ডিপার্টমেন্ট' ? '' : e.target.value })}
                                options={['সর্ব ডিপার্টমেন্ট', ...departments].map(d => ({ label: d, value: d }))}
                                placeholder="সর্ব ডিপার্টমেন্ট"
                                className="bn-text"
                            />
                        </div>
                        <div style={{ minWidth: '160px', flex: 1 }}>
                            <CustomSelect
                                name="hall"
                                value={filters.hall || 'সর্ব হল'}
                                onChange={e => setFilters({ ...filters, hall: e.target.value === 'সর্ব হল' ? '' : e.target.value })}
                                options={['সর্ব হল', ...halls].map(h => ({ label: h, value: h }))}
                                placeholder="সর্ব হল"
                                className="bn-text"
                            />
                        </div>
                        <div style={{ minWidth: '140px', flex: 1 }}>
                            <CustomSelect
                                name="status"
                                value={filters.status || 'সর্ব স্ট্যাটাস'}
                                onChange={e => setFilters({ ...filters, status: e.target.value === 'সর্ব স্ট্যাটাস' ? '' : e.target.value })}
                                options={STATUSES.map(s => ({ label: s, value: s }))}
                                placeholder="সর্ব স্ট্যাটাস"
                                className="bn-text"
                            />
                        </div>
                        <div className="admin-search-wrapper" style={{ flex: 1, minWidth: '200px' }}>
                            <Search size={14} className="search-icon" />
                            <input className="admin-search-input bn-text" placeholder="নাম বা মোবাইল নম্বর খুঁজুন"
                                value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} />
                        </div>
                    </div>
                </div>

                <div className="admin-card" style={{ padding: 0 }}>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th><th>ছবি</th><th>নাম</th><th>সেশন</th>
                                    <th>ডিপার্টমেন্ট</th><th>হল</th><th>জমা দেওয়ার সময়</th><th>স্ট্যাটাস</th><th>অ্যাকশন</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>লোডিং...</td></tr>
                                ) : students.length === 0 ? (
                                    <tr><td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>কোনো শিক্ষার্থী পাওয়া যায়নি</td></tr>
                                ) : students.map((s, i) => {
                                    const { date, time } = formatDate(s.createdAt);
                                    const sk = (s.status || 'Pending').toLowerCase();
                                    return (
                                        <tr key={s._id} style={{ cursor: 'default' }}>
                                            <td><span className="titas-id">{getTitasId(i)}</span><br /><span className="student-mobile">{s.mobile}</span></td>
                                            <td>{s.photo ? <img src={`${API_BASE_URL}${s.photo}`} alt="pic" className="student-avatar" /> : <div className="student-avatar-placeholder">👤</div>}</td>
                                            <td><div className="student-name-bn bn-text">{s.nameBn}</div><div className="student-mobile">{s.nameEn}</div></td>
                                            <td>{s.session}</td>
                                            <td>{s.department}</td>
                                            <td>{s.hall}</td>
                                            <td><div className="student-time">{date}</div><div className="student-time-sub">{time}</div></td>
                                            <td><span className={`status-badge ${sk} bn-text`}>{statusLabels[sk]}</span></td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                                                    {s.status !== 'Approved' && <button className="action-btn" title="অনুমোদন" onClick={() => handleStatusChange(s._id, 'Approved')} style={{ color: '#16a34a', fontWeight: 700 }}>✓</button>}
                                                    {s.status !== 'Rejected' && <button className="action-btn" title="প্রত্যাখ্যাত" onClick={() => handleStatusChange(s._id, 'Rejected')} style={{ color: '#dc2626', fontWeight: 700 }}>✗</button>}
                                                    {s.status === 'Approved' && <button className="action-btn" title="অপেক্ষমাণে ফেরান" onClick={() => handleStatusChange(s._id, 'Pending')} style={{ color: '#d97706', fontSize: '0.75rem' }}>↩</button>}
                                                    <button className="action-btn" title=" বিস্তারিত দেখুন" onClick={() => router.push(`/admin/students/${s._id}`)}><Eye size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminStudentsClient() {
    return (
        <Suspense fallback={<div>Loading students...</div>}>
            <StudentsList />
        </Suspense>
    );
}

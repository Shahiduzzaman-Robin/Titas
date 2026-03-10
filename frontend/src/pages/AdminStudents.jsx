import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Eye, Download, X, CheckCircle, XCircle, Clock } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import AdminNavbar from '../components/AdminNavbar';
import CustomSelect from '../components/CustomSelect';
import '../styles/Admin.css';

const SESSIONS = ['সর্ব সেশন', '2024-2025', '2023-2024', '2022-2023', '2021-2022', '2020-2021', '2019-2020', '2018-2019', '2017-2018'];
const STATUSES = ['সর্ব স্ট্যাটাস', 'Pending', 'Approved', 'Rejected'];

// ===================== STUDENT MODAL =====================
const StudentModal = ({ student, onClose, onStatusChange }) => {
    if (!student) return null;
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={onClose}>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '540px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>

                {/* Header */}
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                    {student.photo
                        ? <img src={`${API_BASE_URL}${student.photo}`} alt="profile" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid #e2e8f0' }} />
                        : <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>👤</div>
                    }
                    <div>
                        <h2 className="bn-text" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>{student.nameBn}</h2>
                        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{student.nameEn}</p>
                        <div style={{ marginTop: '0.4rem' }}>
                            <span className={`status-badge ${(student.status || 'Pending').toLowerCase()} bn-text`}>
                                {student.status === 'Approved' ? 'অনুমোদিত' : student.status === 'Rejected' ? 'প্রত্যাখ্যাত' : 'অপেক্ষমাণ'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {[
                        ['মোবাইল', student.mobile],
                        ['ইমেইল', student.email || '—'],
                        ['নিবন্ধন নম্বর', student.regNo || '—'],
                        ['সেশন', student.session],
                        ['ডিপার্টমেন্ট', student.department],
                        ['হল', student.hall],
                        ['উপজেলা', student.upazila || '—'],
                        ['রক্তের গ্রুপ', student.bloodGroup || '—'],
                        ['জেন্ডার', student.gender || '—'],
                        ['চাকরিজীবী', student.isEmployed ? 'হ্যাঁ' : 'না'],
                        ['প্রতিষ্ঠান', student.organization || '—'],
                        ['পদবী', student.jobTitle || '—'],
                        ['নিবন্ধন তারিখ', new Date(student.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })],
                    ].map(([k, v]) => (
                        <div key={k} style={{ background: '#f8fafc', borderRadius: '8px', padding: '0.6rem 0.8rem' }}>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.2rem' }}>{k}</div>
                            <div className="bn-text" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a2e' }}>{v}</div>
                        </div>
                    ))}
                </div>

                {/* Activity log */}
                {student.activities && student.activities.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem', color: '#1a1a2e' }}>কার্যক্রম লগ</div>
                        {student.activities.map((act, i) => (
                            <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: act.action?.includes('Approved') ? '#1a1a2e' : '#94a3b8', marginTop: '0.35rem', flexShrink: 0 }} />
                                <div>
                                    <div className="bn-text" style={{ fontSize: '0.82rem', color: '#1a1a2e', fontWeight: 500 }}>{act.action}</div>
                                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>by {act.adminName} · {new Date(act.timestamp).toLocaleString()}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {student.status !== 'Approved' && (
                        <button style={{ flex: 1, padding: '0.6rem', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                            className="bn-text" onClick={() => { onStatusChange(student._id, 'Approved'); onClose(); }}>
                            <CheckCircle size={16} /> অনুমোদন করুন
                        </button>
                    )}
                    {student.status !== 'Rejected' && (
                        <button style={{ flex: 1, padding: '0.6rem', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                            className="bn-text" onClick={() => { onStatusChange(student._id, 'Rejected'); onClose(); }}>
                            <XCircle size={16} /> প্রত্যাখ্যাত করুন
                        </button>
                    )}
                    {student.status === 'Approved' && (
                        <button style={{ flex: 1, padding: '0.6rem', background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                            className="bn-text" onClick={() => { onStatusChange(student._id, 'Pending'); onClose(); }}>
                            <Clock size={16} /> অপেক্ষমাণে ফেরান
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// ===================== ADMIN STUDENTS =====================
const AdminStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [searchParams] = useSearchParams();

    const [filters, setFilters] = useState({
        session: '', department: '', hall: '', upazila: '',
        status: searchParams.get('status') || '',
        search: ''
    });
    const [departments, setDepartments] = useState([]);
    const [halls, setHalls] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('admin_token');

    useEffect(() => { if (!token) navigate('/login'); }, []);

    useEffect(() => { fetchStudents(); }, [filters]);

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

            const res = await axios.get(`${API_BASE_URL}/api/admin/students`, { headers: { Authorization: `Bearer ${token}` }, params });
            setStudents(res.data);
            setDepartments([...new Set(res.data.map(s => s.department).filter(Boolean))]);
            setHalls([...new Set(res.data.map(s => s.hall).filter(Boolean))]);
        } catch (err) {
            const status = err?.response?.status;
            if (status === 401 || status === 403) {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                navigate('/login');
                return;
            }
            console.error('Failed to fetch students:', err);
        }
        finally { setLoading(false); }
    };

    const handleStatusChange = async (studentId, newStatus) => {
        try {
            await axios.put(`${API_BASE_URL}/api/admin/students/${studentId}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
            fetchStudents();
        } catch (err) { console.error(err); }
    };

    const handleExportApproved = async () => {
        setExporting(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/students/export/approved`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            const contentDisposition = res.headers['content-disposition'] || '';
            const filenameMatch = contentDisposition.match(/filename="?([^\"]+)"?/i);
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
            const status = err?.response?.status;
            if (status === 401 || status === 403) {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                navigate('/login');
                return;
            }
            console.error('Failed to export students:', err);
            window.alert('Approved students export failed.');
        } finally {
            setExporting(false);
        }
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return { date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) };
    };

    const getTitasId = (i) => `TITAS-${String(students.length - i).padStart(4, '0')}`;

    const statusLabels = { approved: 'অনুমোদিত', pending: 'অপেক্ষমাণ', rejected: 'প্রত্যাখ্যাত' };

    // Summary counts
    const counts = { total: students.length, approved: students.filter(s => s.status === 'Approved').length, pending: students.filter(s => s.status === 'Pending').length, rejected: students.filter(s => s.status === 'Rejected').length };

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

                {/* Mini stat strip - transformed to sleek tabs */}
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

                {/* Filters */}
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

                {/* Table */}
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
                                                    <button className="action-btn" title="বিস্তারিত দেখুন" onClick={() => navigate(`/admin/students/${s._id}`)}><Eye size={16} /></button>
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
};

export default AdminStudents;

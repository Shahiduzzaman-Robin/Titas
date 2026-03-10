import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Search, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import AdminNavbar from '../components/AdminNavbar';
import CustomSelect from '../components/CustomSelect';
import '../styles/Admin.css';

const MODULE_OPTIONS = [
    { label: 'সকল মডিউল', value: '' },
    { label: 'Auth', value: 'auth' },
    { label: 'Students', value: 'students' },
    { label: 'Blog', value: 'blog' },
    { label: 'Events', value: 'events' },
    { label: 'Notices', value: 'notices' },
    { label: 'Gallery', value: 'gallery' },
];

const ACTION_OPTIONS = [
    { label: 'সকল অ্যাকশন', value: '' },
    { label: 'Login', value: 'login' },
    { label: 'Logout', value: 'logout' },
    { label: 'Approve Student', value: 'approve_student' },
    { label: 'Reject Student', value: 'reject_student' },
    { label: 'Edit Profile', value: 'edit_profile' },
    { label: 'Delete Record', value: 'delete_record' },
    { label: 'Approve Profile Edit', value: 'approve_profile_edit' },
    { label: 'Reject Profile Edit', value: 'reject_profile_edit' },
    { label: 'Publish Content', value: 'publish_content' },
    { label: 'Update Content', value: 'update_content' },
    { label: 'Remove Content', value: 'remove_content' },
    { label: 'Create Content', value: 'create_content' },
    { label: 'Unpublish Content', value: 'unpublish_content' },
];

const formatDateTime = (dateValue) => {
    if (!dateValue) return '—';
    const date = new Date(dateValue);
    return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

const prettifyAction = (value = '') => value.replace(/_/g, ' ');

const AdminAuditLogs = () => {
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, hasMore: false });
    const [filters, setFilters] = useState({ module: '', action: '', search: '' });
    const [queryInput, setQueryInput] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchAuditLogs(1, filters);
    }, [filters.module, filters.action]);

    const fetchAuditLogs = async (page = 1, nextFilters = filters) => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/audit-logs`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    page,
                    limit: pagination.limit,
                    module: nextFilters.module,
                    action: nextFilters.action,
                    search: nextFilters.search,
                },
            });

            setLogs(res.data.logs || []);
            setPagination(res.data.pagination || { page: 1, limit: 20, total: 0, hasMore: false });
        } catch (error) {
            const status = error?.response?.status;
            if (status === 401 || status === 403) {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                navigate('/login');
                return;
            }
            console.error('Failed to fetch audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const applySearch = () => {
        const nextFilters = { ...filters, search: queryInput.trim() };
        setFilters(nextFilters);
        fetchAuditLogs(1, nextFilters);
    };

    const totalPages = Math.max(1, Math.ceil((pagination.total || 0) / (pagination.limit || 20)));
    const moduleCounts = logs.reduce((acc, log) => {
        acc[log.module] = (acc[log.module] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="admin-layout">
            <AdminNavbar active="audit-logs" />
            <div className="admin-main">
                <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div>
                        <h1 className="bn-text">অডিট লগস</h1>
                        <p className="bn-text">অ্যাডমিন প্যানেলে কে কোন কাজ করেছেন তার সম্পূর্ণ রেকর্ড</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1rem', borderRadius: '12px', background: '#ffffff', border: '1px solid #e2e8f0', color: '#334155' }}>
                        <Shield size={18} />
                        <span style={{ fontWeight: 700 }}>{pagination.total || 0}</span>
                        <span className="bn-text" style={{ color: '#64748b' }}>মোট লগ</span>
                    </div>
                </div>

                <div className="stat-cards-grid" style={{ marginBottom: '1rem', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    {[
                        { label: 'এই পেইজে লগ', value: logs.length, icon: <Activity size={18} color="#1e293b" /> },
                        { label: 'Student Actions', value: moduleCounts.students || 0, icon: <Shield size={18} color="#1e293b" /> },
                        { label: 'Content Actions', value: (moduleCounts.blog || 0) + (moduleCounts.events || 0) + (moduleCounts.notices || 0) + (moduleCounts.gallery || 0), icon: <Activity size={18} color="#1e293b" /> },
                        { label: 'Current Page', value: pagination.page || 1, icon: <Shield size={18} color="#1e293b" /> },
                    ].map((item) => (
                        <div key={item.label} className="stat-card">
                            <div>
                                <div className="stat-card-label bn-text">{item.label}</div>
                                <div className="stat-card-value">{item.value}</div>
                            </div>
                            <div className="stat-card-icon" style={{ background: '#e2e8f033' }}>{item.icon}</div>
                        </div>
                    ))}
                </div>

                <div className="admin-card" style={{ padding: '1rem 1.25rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ minWidth: '190px', flex: 1 }}>
                            <CustomSelect
                                name="module"
                                value={filters.module}
                                onChange={(e) => setFilters((prev) => ({ ...prev, module: e.target.value }))}
                                options={MODULE_OPTIONS}
                                placeholder="সকল মডিউল"
                                className="bn-text"
                            />
                        </div>
                        <div style={{ minWidth: '220px', flex: 1 }}>
                            <CustomSelect
                                name="action"
                                value={filters.action}
                                onChange={(e) => setFilters((prev) => ({ ...prev, action: e.target.value }))}
                                options={ACTION_OPTIONS}
                                placeholder="সকল অ্যাকশন"
                                className="bn-text"
                            />
                        </div>
                        <div className="admin-search-wrapper" style={{ flex: 1.4, minWidth: '250px' }}>
                            <Search size={14} className="search-icon" />
                            <input
                                className="admin-search-input bn-text"
                                placeholder="অ্যাডমিন, টার্গেট বা বর্ণনা দিয়ে খুঁজুন"
                                value={queryInput}
                                onChange={(e) => setQueryInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') applySearch();
                                }}
                            />
                        </div>
                        <button className="btn-primary bn-text" onClick={applySearch}>খুঁজুন</button>
                    </div>
                </div>

                <div className="admin-card" style={{ padding: 0 }}>
                    <div className="admin-table-wrapper">
                        <table className="admin-table audit-log-table">
                            <thead>
                                <tr>
                                    <th>সময়</th>
                                    <th>অ্যাডমিন</th>
                                    <th>মডিউল</th>
                                    <th>অ্যাকশন</th>
                                    <th>টার্গেট</th>
                                    <th>বর্ণনা</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>লোডিং...</td>
                                    </tr>
                                ) : logs.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>কোনো অডিট লগ পাওয়া যায়নি</td>
                                    </tr>
                                ) : logs.map((log) => (
                                    <tr key={log._id}>
                                        <td>
                                            <div style={{ fontWeight: 600, color: '#1e293b' }}>{formatDateTime(log.createdAt)}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{log.ipAddress || '—'}</div>
                                        </td>
                                        <td>
                                            <div className="bn-text" style={{ fontWeight: 700 }}>{log.adminUsername}</div>
                                            <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>{log.userAgent ? log.userAgent.slice(0, 40) : '—'}</div>
                                        </td>
                                        <td>
                                            <span className="audit-chip neutral">{log.module}</span>
                                        </td>
                                        <td>
                                            <span className="audit-chip primary">{prettifyAction(log.action)}</span>
                                        </td>
                                        <td>
                                            <div className="bn-text" style={{ fontWeight: 700, color: '#1e293b' }}>{log.targetLabel || '—'}</div>
                                            <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>{log.targetType} {log.targetId ? `• ${String(log.targetId).slice(-8)}` : ''}</div>
                                        </td>
                                        <td>
                                            <div className="bn-text" style={{ color: '#334155' }}>{log.description}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 1rem' }}>
                    <div className="bn-text" style={{ color: '#64748b' }}>
                        পেইজ {pagination.page || 1} / {totalPages}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            className="btn-outline bn-text"
                            onClick={() => fetchAuditLogs((pagination.page || 1) - 1)}
                            disabled={(pagination.page || 1) <= 1 || loading}
                            style={{ opacity: (pagination.page || 1) <= 1 ? 0.5 : 1 }}
                        >
                            <ChevronLeft size={16} /> আগের পেইজ
                        </button>
                        <button
                            className="btn-outline bn-text"
                            onClick={() => fetchAuditLogs((pagination.page || 1) + 1)}
                            disabled={!pagination.hasMore || loading}
                            style={{ opacity: !pagination.hasMore ? 0.5 : 1 }}
                        >
                            পরের পেইজ <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAuditLogs;
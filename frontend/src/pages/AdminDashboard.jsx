import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Users, CheckCircle, Clock, UserPlus, MessageSquare, Edit, Activity, Calendar,
    Globe, XCircle, Image, TrendingUp, TrendingDown, BarChart2, ArrowRight, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import '../styles/Admin.css';

import AdminNavbar from '../components/AdminNavbar';

// ===================== STAT CARD =====================
const StatCard = ({ label, value, sub, icon, color, valueColor, onClick, trend }) => (
    <div className="stat-card" style={{ cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
        <div>
            <div className="stat-card-label bn-text">{label}</div>
            <div className="stat-card-value" style={{ color: valueColor || '#1a1a2e' }}>{value}</div>
            <div className="stat-card-sub bn-text">{sub}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
            <div className="stat-card-icon" style={{ background: color + '1a' }}>{icon}</div>
            {trend !== undefined && (
                <div style={{ fontSize: '0.7rem', color: trend >= 0 ? '#16a34a' : '#dc2626', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(trend)}% vs last month
                </div>
            )}
        </div>
    </div>
);

// ===================== HBAR =====================
const HBar = ({ label, count, max, color }) => (
    <div className="hbar-row">
        <div className="hbar-label">{label}</div>
        <div className="hbar-track">
            <div className="hbar-fill" style={{ width: `${Math.max(2, Math.round((count / max) * 100))}%`, background: color }} />
        </div>
        <div className="hbar-count">{count}</div>
    </div>
);

// ===================== ADMIN DASHBOARD =====================
const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (!token) { navigate('/login'); return; }
        axios.get(`${API_BASE_URL}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => setStats(r.data))
            .catch((err) => {
                const status = err?.response?.status;
                if (status === 401 || status === 403) {
                    localStorage.removeItem('admin_token');
                    localStorage.removeItem('admin_user');
                    navigate('/login');
                    return;
                }
                setError('Server সমস্যা হয়েছে, একটু পরে আবার চেষ্টা করুন।');
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    if (loading) return (
        <div className="admin-layout"><AdminNavbar active="dashboard" />
            <div style={{ textAlign: 'center', padding: '5rem', color: '#64748b' }}>লোডিং...</div>
        </div>
    );

    const maxUpazila = stats?.upazilas?.[0]?.count || 1;
    const maxHall = stats?.halls?.[0]?.count || 1;
    const maxDept = stats?.departments?.[0]?.count || 1;
    const maxTrend = Math.max(...(stats?.trend || []).map(t => t.count), 1);
    const totalGender = (stats?.males || 0) + (stats?.females || 0);
    const femalePercent = totalGender ? Math.round((stats.females / totalGender) * 100) : 0;
    const malePercent = 100 - femalePercent;
    const profileCompleteness = stats?.total ? Math.round((stats.withPhoto / stats.total) * 100) : 0;

    // Month over month trend
    const momTrend = stats?.lastMonthCount > 0
        ? Math.round(((stats.monthlyCount - stats.lastMonthCount) / stats.lastMonthCount) * 100)
        : null;

    return (
        <div className="admin-layout">
            <AdminNavbar active="dashboard" />
            <div className="admin-main">
                {/* Header */}
                <div className="admin-page-header">
                    <h1 className="bn-text">ড্যাশবোর্ড</h1>
                    <p className="bn-text">শিক্ষার্থী পরিসংখ্যান এবং সাম্প্রতিক কার্যক্রম</p>
                </div>

                {error && (
                    <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: '10px' }} className="bn-text">
                        {error}
                    </div>
                )}

                {/* Row 1 — Primary stats */}
                <div className="stat-cards-grid">
                    <StatCard label="মোট শিক্ষার্থী" value={stats?.total || 0}
                        sub="সর্বমোট নিবন্ধিত শিক্ষার্থী"
                        icon={<Users size={20} color="#475569" />} color="#475569" />
                    <StatCard label="অনুমোদিত" value={stats?.approved || 0}
                        sub={`${stats?.approvalRate || 0}% অনুমোদনের হার`}
                        icon={<CheckCircle size={20} color="#475569" />} color="#475569" valueColor="#1a1a2e"
                        onClick={() => navigate('/admin/students?status=Approved')} />
                    <StatCard label="অপেক্ষমাণ" value={stats?.pending || 0}
                        sub={<span style={{ cursor: 'pointer' }}>অনুমোদনের অপেক্ষায় →</span>}
                        icon={<Clock size={20} color="#475569" />} color="#475569" valueColor="#475569"
                        onClick={() => navigate('/admin/students?status=Pending')} />
                    <StatCard label="প্রত্যাখ্যাত" value={stats?.rejected || 0}
                        sub="অনুমোদন বাতিলকৃত"
                        icon={<XCircle size={20} color="#475569" />} color="#475569" valueColor="#64748b"
                        onClick={() => navigate('/admin/students?status=Rejected')} />
                </div>

                {/* Row 2 — Secondary stats */}
                <div className="stat-cards-grid" style={{ marginBottom: '1.5rem' }}>
                    <StatCard label="আজকের নিবন্ধন" value={stats?.todayCount || 0}
                        sub="আজ নিবন্ধিত নতুন শিক্ষার্থী"
                        icon={<UserPlus size={20} color="#475569" />} color="#475569" />
                    <StatCard label="এই মাসে নিবন্ধন" value={stats?.monthlyCount || 0}
                        sub={`গত মাসে ছিল: ${stats?.lastMonthCount || 0} জন`}
                        icon={<BarChart2 size={20} color="#475569" />} color="#475569"
                        trend={momTrend} />
                    <StatCard label="প্রোফাইল ছবি আছে" value={`${stats?.withPhoto || 0} জন`}
                        sub={`${profileCompleteness}% শিক্ষার্থীর ছবি আছে`}
                        icon={<Image size={20} color="#475569" />} color="#475569" />
                    <StatCard label="সক্রিয় সেশন" value={stats?.activeSessions || 0}
                        sub="বর্তমানে সক্রিয় সেশন সংখ্যা"
                        icon={<Calendar size={20} color="#475569" />} color="#475569" />
                </div>

                {/* Demographics */}
                <h2 className="bn-text" style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#1a1a2e' }}>
                    ডেমোগ্রাফিক এবং বিশ্লেষণ
                </h2>

                <div className="demo-grid">
                    {/* Gender */}
                    <div className="admin-card">
                        <div className="admin-card-header"><div className="admin-card-title bn-text"><Users size={16} /> লিঙ্গ অনুপাত</div></div>
                        <div className="gender-stats">
                            <div><div className="gender-stat-value" style={{ color: '#475569' }}>{stats?.females || 0}</div><div className="gender-stat-label">Female</div></div>
                            <div><div className="gender-stat-value" style={{ color: '#1a1a2e' }}>{stats?.males || 0}</div><div className="gender-stat-label">Male</div></div>
                        </div>
                        <div className="gender-bar-container">
                            <div className="gender-bar-row"><span style={{ width: 60 }}>Female</span><div className="gender-bar" style={{ width: `${femalePercent}%`, background: '#94a3b8' }} /><span>{femalePercent}%</span></div>
                            <div className="gender-bar-row"><span style={{ width: 60 }}>Male</span>  <div className="gender-bar" style={{ width: `${malePercent}%`, background: '#1a1a2e' }} /><span>{malePercent}%</span></div>
                        </div>
                    </div>

                    {/* Blood group */}
                    <div className="admin-card">
                        <div className="admin-card-header"><div className="admin-card-title bn-text">❤️ রক্তের গ্রুপ বিতরণ</div></div>
                        <div className="blood-grid">
                            {(stats?.bloodGroups || []).map(bg => (
                                <div key={bg._id} className="blood-item">
                                    <div className="bg-type">{bg._id}</div>
                                    <div className="bg-count">{bg.count} Students</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="demo-grid">
                    {/* Upazila */}
                    <div className="admin-card">
                        <div className="admin-card-header"><div className="admin-card-title bn-text">📍 শীর্ষ উপজেলা</div></div>
                        {(stats?.upazilas || []).map(u => <HBar key={u._id} label={u._id} count={u.count} max={maxUpazila} color="#94a3b8" />)}
                    </div>
                    {/* Hall */}
                    <div className="admin-card">
                        <div className="admin-card-header"><div className="admin-card-title bn-text">🏠 হল বিতরণ</div></div>
                        {(stats?.halls || []).map(h => <HBar key={h._id} label={h._id} count={h.count} max={maxHall} color="#64748b" />)}
                    </div>
                </div>

                {/* Registration Trend (REAL DATA) + Department */}
                <div className="demo-grid">
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <div className="admin-card-title bn-text">📈 নিবন্ধনের ট্রেন্ড</div>
                            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>↑ গত ৭ দিন</span>
                        </div>
                        {(stats?.trend || []).map((d, i) => (
                            <div key={i} className="hbar-row" style={{ marginBottom: '0.5rem' }}>
                                <div style={{ width: 80, fontSize: '0.82rem', color: '#475569' }}>{d.label}</div>
                                <div className="hbar-track">
                                    <div className="hbar-fill" style={{ width: `${Math.max(d.count > 0 ? 4 : 0, Math.round((d.count / maxTrend) * 100))}%`, background: '#1a1a2e' }} />
                                </div>
                                <div className="hbar-count">{d.count}</div>
                            </div>
                        ))}
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Total</span><span>{(stats?.trend || []).reduce((a, b) => a + b.count, 0)} registrations</span>
                        </div>
                    </div>
                    <div className="admin-card">
                        <div className="admin-card-header"><div className="admin-card-title bn-text">🎓 ডিপার্টমেন্ট বিতরণ</div></div>
                        {(stats?.departments || []).map(d => <HBar key={d._id} label={d._id} count={d.count} max={maxDept} color="#475569" />)}
                    </div>
                </div>

                {/* Approval rate visual */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div className="admin-card-title bn-text">✅ অনুমোদন পরিসংখ্যান</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center' }}>
                        {[
                            { label: 'অনুমোদিত', value: stats?.approved || 0, color: '#1a1a2e', bg: '#f1f5f9' },
                            { label: 'অপেক্ষমাণ', value: stats?.pending || 0, color: '#64748b', bg: '#f8fafc' },
                            { label: 'প্রত্যাখ্যাত', value: stats?.rejected || 0, color: '#94a3b8', bg: '#f8fafc' },
                        ].map(item => (
                            <div key={item.label} style={{ padding: '1rem', borderRadius: '10px', background: item.bg, border: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 700, color: item.color }}>{item.value}</div>
                                <div className="bn-text" style={{ fontSize: '0.85rem', color: item.color, marginTop: '0.25rem' }}>{item.label}</div>
                                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                                    {stats?.total ? Math.round((item.value / stats.total) * 100) : 0}%
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                        <div style={{ height: '10px', borderRadius: '5px', overflow: 'hidden', display: 'flex', gap: '2px' }}>
                            <div style={{ flex: stats?.approved || 0, background: '#1a1a2e' }} />
                            <div style={{ flex: stats?.pending || 0, background: '#94a3b8' }} />
                            <div style={{ flex: stats?.rejected || 0, background: '#e2e8f0' }} />
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="admin-card">
                    <div className="admin-card-title bn-text" style={{ marginBottom: '1rem' }}>দ্রুত কাজ</div>
                    <div className="quick-actions">
                        {[
                            { icon: <Clock size={22} />, label: 'অপেক্ষমাণ অনুমোদন করুন', href: '/admin/students?status=Pending' },
                            { icon: <MessageSquare size={22} />, label: 'বার্তাসমূহ পরিচালনা করুন', href: '/admin/messages' },
                            { icon: <AlertCircle size={22} />, label: 'জরুরী নোটিশ পরিচালনা করুন', href: '/admin/notices' },
                            { icon: <Edit size={22} />, label: 'সম্পাদনা পরিচালনা করুন', href: '/admin/edits' },
                            { icon: <Globe size={22} />, label: 'ব্যাচ এসএমএস পাঠান', href: '#' },
                            { icon: <Users size={22} />, label: 'রিপোর্ট তৈরি করুন', href: '#' },
                            { icon: <Activity size={22} />, label: 'লগ পরিচালনা করুন', href: '#' },
                        ].map((a, i) => (
                            <button key={i} className="quick-action-btn bn-text" onClick={() => a.href !== '#' && navigate(a.href)}>
                                {a.icon}{a.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

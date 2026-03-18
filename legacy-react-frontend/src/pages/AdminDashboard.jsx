import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Users, CheckCircle, Clock, UserPlus, MessageSquare, Edit, Activity, Calendar,
    Globe, XCircle, Image, TrendingUp, TrendingDown, BarChart2, ArrowRight, AlertCircle,
    FileText, Eye, MessageCircle, MapPin, CalendarCheck, Mail, MailCheck,
    Bell, Shield, BookOpen, Megaphone, Layout
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import '../styles/Admin.css';

import AdminNavbar from '../components/AdminNavbar';

const EMAIL_CATEGORY_LABELS = {
    registrationStatus: 'রেজিস্ট্রেশন স্ট্যাটাস',
    profileEdit: 'প্রোফাইল এডিট',
    noticePublished: 'নোটিশ',
    eventReminders: 'ইভেন্ট রিমাইন্ডার',
    passwordReset: 'পাসওয়ার্ড রিসেট',
    loginAlerts: 'লগইন এলার্ট',
};

const EMAIL_CATEGORY_ICONS = {
    registrationStatus: <UserPlus size={16} />,
    profileEdit: <Edit size={16} />,
    noticePublished: <Megaphone size={16} />,
    eventReminders: <Calendar size={16} />,
    passwordReset: <Shield size={16} />,
    loginAlerts: <Bell size={16} />,
};

const EMAIL_STATUS_LABELS = {
    sent: 'Sent',
    failed: 'Failed',
};

const formatBanglaDateTime = (value) => {
    if (!value) return 'এখনও পাঠানো হয়নি';

    return new Date(value).toLocaleString('bn-BD', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// ===================== STAT CARD =====================
const StatCard = ({ label, value, sub, icon, color, valueColor, onClick, trend, accentColor }) => (
    <div className="stat-card" style={{ cursor: onClick ? 'pointer' : 'default', borderLeftColor: accentColor || '#e2e8f0' }} onClick={onClick}>
        <div>
            <div className="stat-card-label bn-text">{label}</div>
            <div className="stat-card-value" style={{ color: valueColor || '#1a1a2e' }}>{value}</div>
            <div className="stat-card-sub bn-text">{sub}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
            <div className="stat-card-icon" style={{ background: (accentColor || color) + '18' }}>{icon}</div>
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
    const emailStats = stats?.email || {};
    const emailBreakdown = emailStats?.byCategory || [];
    const recentEmailActivity = emailStats?.recent || [];
    const compactEmailBreakdown = Object.keys(EMAIL_CATEGORY_LABELS).map((category) => {
        const matchedItem = emailBreakdown.find((item) => item.category === category);
        const sent = matchedItem?.sent || 0;
        const failed = matchedItem?.failed || 0;

        return {
            category,
            sent,
            failed,
            total: sent + failed,
        };
    });
    const compactRecentEmailActivity = recentEmailActivity.slice(0, 5);

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
                    <p className="bn-text">সামগ্রিক পরিসংখ্যান এবং প্ল্যাটফর্ম ওভারভিউ</p>
                </div>

                {error && (
                    <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: '10px' }} className="bn-text">
                        {error}
                    </div>
                )}

                {/* Stats — single compact row */}
                <div className="stat-cards-grid stat-cards-grid--5" style={{ marginBottom: '1.5rem' }}>
                    <StatCard label="অনুমোদিত" value={stats?.approved || 0}
                        sub={`${stats?.approvalRate || 0}% অনুমোদনের হার`}
                        icon={<CheckCircle size={20} color="#16a34a" />} color="#16a34a" valueColor="#15803d" accentColor="#16a34a"
                        onClick={() => navigate('/admin/students?status=Approved')} />
                    <StatCard label="অপেক্ষমাণ" value={stats?.pending || 0}
                        sub={<span style={{ cursor: 'pointer' }}>অনুমোদনের অপেক্ষায় →</span>}
                        icon={<Clock size={20} color="#d97706" />} color="#d97706" valueColor="#b45309" accentColor="#d97706"
                        onClick={() => navigate('/admin/students?status=Pending')} />
                    <StatCard label="প্রত্যাখ্যাত" value={stats?.rejected || 0}
                        sub="অনুমোদন বাতিলকৃত"
                        icon={<XCircle size={20} color="#ef4444" />} color="#ef4444" valueColor="#dc2626" accentColor="#ef4444"
                        onClick={() => navigate('/admin/students?status=Rejected')} />
                    <StatCard label="আজকের নিবন্ধন" value={stats?.todayCount || 0}
                        sub="আজ নিবন্ধিত নতুন শিক্ষার্থী"
                        icon={<UserPlus size={20} color="#3b82f6" />} color="#3b82f6" accentColor="#3b82f6" />
                    <StatCard label="এই মাসে নিবন্ধন" value={stats?.monthlyCount || 0}
                        sub={`গত মাসে ছিল: ${stats?.lastMonthCount || 0} জন`}
                        icon={<BarChart2 size={20} color="#8b5cf6" />} color="#8b5cf6" accentColor="#8b5cf6"
                        trend={momTrend} />
                </div>

                {/* ============ PLATFORM OVERVIEW ============ */}
                <h2 className="bn-text dashboard-section-title">
                    <Layout size={18} /> প্ল্যাটফর্ম ওভারভিউ
                </h2>

                <div className="platform-overview-grid">
                    {/* Blog */}
                    <div className="platform-card" onClick={() => navigate('/admin/blog')}>
                        <div className="platform-card-icon" style={{ background: '#eff6ff' }}><FileText size={22} color="#3b82f6" /></div>
                        <div className="platform-card-body">
                            <div className="platform-card-title bn-text">ব্লগ</div>
                            <div className="platform-card-value">{stats?.blog?.total || 0}</div>
                            <div className="platform-card-details">
                                <span>{stats?.blog?.published || 0} প্রকাশিত</span>
                                <span>{stats?.blog?.draft || 0} খসড়া</span>
                            </div>
                        </div>
                        <div className="platform-card-extras">
                            <div className="platform-card-extra"><Eye size={12} /> {stats?.blog?.totalViews || 0} ভিউ</div>
                            <div className="platform-card-extra"><MessageCircle size={12} /> {stats?.blog?.totalComments || 0} মন্তব্য</div>
                        </div>
                    </div>

                    {/* Events */}
                    <div className="platform-card" onClick={() => navigate('/admin/events')}>
                        <div className="platform-card-icon" style={{ background: '#f5f3ff' }}><Calendar size={22} color="#8b5cf6" /></div>
                        <div className="platform-card-body">
                            <div className="platform-card-title bn-text">ইভেন্ট</div>
                            <div className="platform-card-value">{stats?.events?.total || 0}</div>
                            <div className="platform-card-details">
                                <span>{stats?.events?.upcoming || 0} আসন্ন</span>
                                <span>{stats?.events?.past || 0} সম্পন্ন</span>
                            </div>
                        </div>
                        <div className="platform-card-extras">
                            <div className="platform-card-extra"><CalendarCheck size={12} /> {stats?.events?.totalRsvps || 0} RSVP</div>
                            <div className="platform-card-extra"><CheckCircle size={12} /> {stats?.events?.checkedIn || 0} উপস্থিত</div>
                        </div>
                    </div>

                    {/* Gallery */}
                    <div className="platform-card" onClick={() => navigate('/admin/gallery')}>
                        <div className="platform-card-icon" style={{ background: '#f0fdf4' }}><Image size={22} color="#16a34a" /></div>
                        <div className="platform-card-body">
                            <div className="platform-card-title bn-text">গ্যালারি</div>
                            <div className="platform-card-value">{stats?.gallery?.total || 0}</div>
                            <div className="platform-card-details">
                                <span>{stats?.gallery?.categories || 0} ক্যাটাগরি</span>
                            </div>
                        </div>
                    </div>

                    {/* Notices */}
                    <div className="platform-card" onClick={() => navigate('/admin/notices')}>
                        <div className="platform-card-icon" style={{ background: '#fffbeb' }}><Megaphone size={22} color="#d97706" /></div>
                        <div className="platform-card-body">
                            <div className="platform-card-title bn-text">নোটিশ বোর্ড</div>
                            <div className="platform-card-value">{stats?.notices?.total || 0}</div>
                            <div className="platform-card-details">
                                <span>{stats?.notices?.active || 0} সক্রিয়</span>
                                {(stats?.notices?.urgent || 0) > 0 && <span style={{ color: '#b45309' }}>{stats.notices.urgent} জরুরী</span>}
                            </div>
                        </div>
                    </div>

                    {/* Contact Messages */}
                    <div className="platform-card" onClick={() => navigate('/admin/messages')}>
                        <div className="platform-card-icon" style={{ background: '#fff1f2' }}><MessageSquare size={22} color="#f43f5e" /></div>
                        <div className="platform-card-body">
                            <div className="platform-card-title bn-text">বার্তাসমূহ</div>
                            <div className="platform-card-value">{stats?.messages?.total || 0}</div>
                            <div className="platform-card-details">
                                <span>{stats?.messages?.unread || 0} অপঠিত</span>
                                <span>{stats?.messages?.replied || 0} উত্তরকৃত</span>
                            </div>
                        </div>
                    </div>

                    {/* Profile Edits */}
                    <div className="platform-card" onClick={() => navigate('/admin/edits')}>
                        <div className="platform-card-icon" style={{ background: '#f0fdfa' }}><Edit size={22} color="#0d9488" /></div>
                        <div className="platform-card-body">
                            <div className="platform-card-title bn-text">প্রোফাইল সম্পাদনা</div>
                            <div className="platform-card-value">{stats?.profileEdits?.total || 0}</div>
                            <div className="platform-card-details">
                                <span>{stats?.profileEdits?.pending || 0} অপেক্ষমাণ</span>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="email-summary-panel">
                    <div className="email-summary-header">
                        <div>
                            <h2 className="bn-text dashboard-section-title email-summary-title">
                                <Mail size={18} /> ইমেইল সারাংশ
                            </h2>
                            <p className="email-summary-subtitle bn-text">চলতি মাসের ক্যাটাগরি সারাংশ এবং সর্বশেষ পাঠানো ইমেইল</p>
                        </div>
                        <div className="email-summary-period bn-text">সর্বশেষ ৫টি কার্যক্রম</div>
                    </div>

                    <div className="email-summary-stats">
                        <div className="email-mini-stat">
                            <div className="email-mini-stat-label bn-text"><MailCheck size={15} /> আজ পাঠানো</div>
                            <div className="email-mini-stat-value">{emailStats?.sentToday || 0}</div>
                        </div>
                        <div className="email-mini-stat">
                            <div className="email-mini-stat-label bn-text"><Mail size={15} /> এই মাসে পাঠানো</div>
                            <div className="email-mini-stat-value">{emailStats?.sentThisMonth || 0}</div>
                        </div>
                        <div className="email-mini-stat">
                            <div className="email-mini-stat-label bn-text"><AlertCircle size={15} /> ব্যর্থ</div>
                            <div className="email-mini-stat-value is-muted">{emailStats?.failedThisMonth || 0}</div>
                        </div>
                        <div className="email-mini-stat">
                            <div className="email-mini-stat-label bn-text"><Bell size={15} /> সর্বশেষ</div>
                            <div className="email-mini-stat-caption bn-text">{emailStats?.lastSentCategory ? (EMAIL_CATEGORY_LABELS[emailStats.lastSentCategory] || emailStats.lastSentCategory) : 'নেই'}</div>
                            <div className="email-mini-stat-time">{formatBanglaDateTime(emailStats?.lastSentAt)}</div>
                        </div>
                    </div>

                    <div className="email-summary-grid">
                        <div className="email-summary-card">
                            <div className="admin-card-header email-summary-card-header">
                                <div className="admin-card-title bn-text"><Mail size={16} /> ক্যাটাগরি ব্রেকডাউন</div>
                                <span className="email-summary-chip">চলতি মাস</span>
                            </div>
                            <div className="email-category-compact-grid">
                                {compactEmailBreakdown.map((item) => (
                                    <div key={item.category} className="email-category-compact-card">
                                        <div className="email-category-compact-top">
                                            <div className="email-category-title-with-icon">
                                                <span className="email-category-icon" aria-hidden="true">
                                                    {EMAIL_CATEGORY_ICONS[item.category] || <Mail size={16} />}
                                                </span>
                                                <div className="email-category-title bn-text">{EMAIL_CATEGORY_LABELS[item.category] || item.category}</div>
                                            </div>
                                            <div className="email-category-total">{item.total}</div>
                                        </div>
                                        <div className="email-category-meta">
                                            <span>Sent {item.sent}</span>
                                            <span>Failed {item.failed}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="email-summary-card">
                            <div className="admin-card-header email-summary-card-header">
                                <div className="admin-card-title bn-text"><Activity size={16} /> সাম্প্রতিক ইমেইল</div>
                                <span className="email-summary-chip">recipient, status</span>
                            </div>
                            <div className="recent-activity-list email-recent-list compact">
                                {compactRecentEmailActivity.length === 0 && (
                                    <div className="email-summary-empty bn-text">কোন ইমেইল লগ পাওয়া যায়নি</div>
                                )}
                                {compactRecentEmailActivity.map((item, index) => (
                                    <div key={`${item.recipientEmail}-${item.sentAt}-${index}`} className="recent-activity-item email-recent-item-compact">
                                        <div className={`recent-activity-dot ${item.status === 'sent' ? 'is-sent' : 'is-failed'}`} />
                                        <div className="recent-activity-content">
                                            <div className="email-activity-header compact">
                                                <div className="recent-activity-desc">{item.recipientEmail || 'Unknown recipient'}</div>
                                                <span className={`email-status-pill ${item.status === 'sent' ? 'is-sent' : 'is-failed'}`}>{EMAIL_STATUS_LABELS[item.status] || item.status}</span>
                                            </div>
                                            <div className="email-activity-footer">
                                                <div className="email-activity-category email-activity-category-with-icon bn-text">
                                                    <span className="email-category-icon small" aria-hidden="true">
                                                        {EMAIL_CATEGORY_ICONS[item.category] || <Mail size={14} />}
                                                    </span>
                                                    <span>{EMAIL_CATEGORY_LABELS[item.category] || item.category}</span>
                                                </div>
                                                <div className="recent-activity-meta">
                                                    <span>{formatBanglaDateTime(item.sentAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ============ RECENT ACTIVITY + SYSTEM STATUS ============ */}
                <div className="demo-grid">
                    {/* Recent Activity */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <div className="admin-card-title bn-text"><Activity size={16} /> সাম্প্রতিক কার্যকলাপ</div>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>গত ২৪ ঘণ্টায় {stats?.audit?.last24h || 0} টি কাজ</span>
                        </div>
                        <div className="recent-activity-list">
                            {(stats?.audit?.recentActivity || []).length === 0 && (
                                <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8', fontSize: '0.85rem' }} className="bn-text">কোন সাম্প্রতিক কার্যকলাপ নেই</div>
                            )}
                            {(stats?.audit?.recentActivity || []).map((log, i) => (
                                <div key={i} className="recent-activity-item">
                                    <div className="recent-activity-dot" />
                                    <div className="recent-activity-content">
                                        <div className="recent-activity-desc">{log.description || `${log.action} — ${log.module}`}</div>
                                        <div className="recent-activity-meta">
                                            <span>{log.adminUsername}</span>
                                            <span>{new Date(log.createdAt).toLocaleString('bn-BD', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="dashboard-inline-action">
                            <button className="quick-action-btn quick-action-inline bn-text" onClick={() => navigate('/admin/audit-logs')}>
                                সকল লগ দেখুন <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <div className="admin-card-title bn-text"><Shield size={16} /> সিস্টেম স্ট্যাটাস</div>
                        </div>
                        <div className="system-status-list">
                            <div className="system-status-item">
                                <div className="system-status-label bn-text"><Mail size={14} /> ইমেইল সিস্টেম</div>
                                <div className={`system-status-badge ${stats?.emailConfigured ? 'status-ok' : 'status-warn'}`}>
                                    {stats?.emailConfigured ? 'সক্রিয়' : 'কনফিগার করা হয়নি'}
                                </div>
                            </div>
                            <div className="system-status-item">
                                <div className="system-status-label bn-text"><Users size={14} /> মোট শিক্ষার্থী</div>
                                <div className="system-status-value">{stats?.total || 0}</div>
                            </div>
                            <div className="system-status-item">
                                <div className="system-status-label bn-text"><FileText size={14} /> মোট ব্লগ পোস্ট</div>
                                <div className="system-status-value">{stats?.blog?.total || 0}</div>
                            </div>
                            <div className="system-status-item">
                                <div className="system-status-label bn-text"><Calendar size={14} /> আসন্ন ইভেন্ট</div>
                                <div className="system-status-value">{stats?.events?.upcoming || 0}</div>
                            </div>
                            <div className="system-status-item">
                                <div className="system-status-label bn-text"><Image size={14} /> গ্যালারি ছবি</div>
                                <div className="system-status-value">{stats?.gallery?.total || 0}</div>
                            </div>
                            <div className="system-status-item">
                                <div className="system-status-label bn-text"><Megaphone size={14} /> সক্রিয় নোটিশ</div>
                                <div className="system-status-value">{stats?.notices?.active || 0}</div>
                            </div>
                            <div className="system-status-item">
                                <div className="system-status-label bn-text"><MessageSquare size={14} /> অপঠিত বার্তা</div>
                                <div className="system-status-value">{stats?.messages?.unread || 0}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Demographics */}
                <h2 className="bn-text dashboard-section-title">
                    <BarChart2 size={18} /> শিক্ষার্থী ডেমোগ্রাফিক ও বিশ্লেষণ
                </h2>

                <div className="demo-grid">
                    {/* Gender */}
                    <div className="admin-card">
                        <div className="admin-card-header"><div className="admin-card-title bn-text"><Users size={16} /> লিঙ্গ অনুপাত</div></div>
                        <div className="gender-stats">
                            <div><div className="gender-stat-value" style={{ color: '#db2777' }}>{stats?.females || 0}</div><div className="gender-stat-label">Female</div></div>
                            <div><div className="gender-stat-value" style={{ color: '#2563eb' }}>{stats?.males || 0}</div><div className="gender-stat-label">Male</div></div>
                        </div>
                        <div className="gender-bar-container">
                            <div className="gender-bar-row"><span style={{ width: 60 }}>Female</span><div className="gender-bar" style={{ width: `${femalePercent}%`, background: '#ec4899' }} /><span>{femalePercent}%</span></div>
                            <div className="gender-bar-row"><span style={{ width: 60 }}>Male</span>  <div className="gender-bar" style={{ width: `${malePercent}%`, background: '#3b82f6' }} /><span>{malePercent}%</span></div>
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
                        {(stats?.upazilas || []).map(u => <HBar key={u._id} label={u._id} count={u.count} max={maxUpazila} color="#6366f1" />)}
                    </div>
                    {/* Hall */}
                    <div className="admin-card">
                        <div className="admin-card-header"><div className="admin-card-title bn-text">🏠 হল বিতরণ</div></div>
                        {(stats?.halls || []).map(h => <HBar key={h._id} label={h._id} count={h.count} max={maxHall} color="#0891b2" />)}
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
                        {(stats?.departments || []).map(d => <HBar key={d._id} label={d._id} count={d.count} max={maxDept} color="#8b5cf6" />)}
                    </div>
                </div>




            </div>
        </div>
    );
};

export default AdminDashboard;

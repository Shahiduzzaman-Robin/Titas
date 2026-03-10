import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Bell, CalendarClock, ShieldCheck, Loader2, Save, Send, AlertTriangle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import AdminNavbar from '../components/AdminNavbar';
import '../styles/Admin.css';

const DEFAULT_SETTINGS = {
    registrationStatus: true,
    profileEdit: true,
    noticePublished: true,
    eventReminders: true,
    passwordReset: true,
    loginAlerts: true,
};

const NOTIFICATION_CONTROLS = [
    {
        key: 'registrationStatus',
        title: 'Registration status',
        description: 'Approved and rejected registration emails sent from admin review actions.',
        testHint: 'Sends an approval-style registration email preview.',
    },
    {
        key: 'profileEdit',
        title: 'Profile edit review',
        description: 'Approved and rejected profile edit review emails.',
        testHint: 'Sends an approved profile edit review preview.',
    },
    {
        key: 'noticePublished',
        title: 'Notice published',
        description: 'Controls notice email sending. Bulk sending is still blocked unless the backend safety lock is explicitly opened.',
        testHint: 'Sends a notice-template preview to one email only.',
    },
    {
        key: 'eventReminders',
        title: 'Event reminders',
        description: 'Controls reminder emails for upcoming events, including manual reminder runs from this page.',
        testHint: 'Sends a sample upcoming-event reminder.',
    },
    {
        key: 'passwordReset',
        title: 'Password reset',
        description: 'Controls forgot-password OTP and password-reset success alert emails.',
        testHint: 'Sends a sample OTP email preview.',
    },
    {
        key: 'loginAlerts',
        title: 'Login alerts',
        description: 'Controls new-login alert emails that include IP and device information.',
        testHint: 'Sends a sample login alert preview.',
    },
];

const formatSavedAt = (value) => {
    if (!value) return 'Not saved yet';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Not saved yet';

    return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
};

const AdminNotifications = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState(null);
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [savingSettings, setSavingSettings] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [daysAhead, setDaysAhead] = useState(1);
    const [sendingReminder, setSendingReminder] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [testEmails, setTestEmails] = useState({});
    const [testMessages, setTestMessages] = useState({});
    const [testingKey, setTestingKey] = useState('');

    const getToken = () => localStorage.getItem('admin_token');

    const loadStatus = async () => {
        const token = getToken();
        if (!token) {
            navigate('/login');
            return;
        }

        setLoadingStatus(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/email/status`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = res.data || null;
            setStatus(data);
            setSettings({ ...DEFAULT_SETTINGS, ...(data?.settings || {}) });
        } catch (err) {
            if (err?.response?.status === 401 || err?.response?.status === 403) {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                navigate('/login');
                return;
            }
            setStatus(null);
        } finally {
            setLoadingStatus(false);
        }
    };

    useEffect(() => {
        loadStatus();
    }, []);

    const handleToggleChange = (key) => {
        setSaveMessage('');
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleSaveSettings = async () => {
        const token = getToken();
        if (!token) {
            navigate('/login');
            return;
        }

        setSavingSettings(true);
        setSaveMessage('');
        try {
            const res = await axios.put(
                `${API_BASE_URL}/api/admin/email/settings`,
                { settings },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const nextSettings = { ...DEFAULT_SETTINGS, ...(res.data?.settings || settings) };
            setSettings(nextSettings);
            setStatus((prev) => ({
                ...(prev || {}),
                settings: nextSettings,
                settingsUpdatedAt: res.data?.updatedAt || prev?.settingsUpdatedAt || null,
                settingsUpdatedBy: res.data?.updatedBy || prev?.settingsUpdatedBy || '',
            }));
            setSaveMessage(res.data?.msg || 'Settings saved.');
        } catch (err) {
            const msg = err?.response?.data?.msg || 'Failed to save notification settings.';
            setSaveMessage(msg);
        } finally {
            setSavingSettings(false);
        }
    };

    const handleSendReminders = async () => {
        const token = getToken();
        if (!token) {
            navigate('/login');
            return;
        }

        setResultMessage('');
        setSendingReminder(true);
        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/admin/events/reminders/send`,
                { daysAhead: Number(daysAhead) || 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const data = res.data || {};
            setResultMessage(
                `Reminder completed: ${data.remindedEvents || 0} event(s), ${data.recipientsNotified || 0} email(s) sent.`
            );
            await loadStatus();
        } catch (err) {
            const msg = err?.response?.data?.msg || 'Failed to send reminders.';
            setResultMessage(msg);
        } finally {
            setSendingReminder(false);
        }
    };

    const handleTestEmail = async (key) => {
        const token = getToken();
        if (!token) {
            navigate('/login');
            return;
        }

        setTestingKey(key);
        setTestMessages((prev) => ({ ...prev, [key]: '' }));
        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/admin/email/test`,
                { type: key, to: testEmails[key] || '' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setTestMessages((prev) => ({
                ...prev,
                [key]: res.data?.msg || 'Test email sent.',
            }));
        } catch (err) {
            const msg = err?.response?.data?.msg || 'Failed to send test email.';
            setTestMessages((prev) => ({ ...prev, [key]: msg }));
        } finally {
            setTestingKey('');
        }
    };

    const enabledCount = Object.values(settings).filter(Boolean).length;

    return (
        <div className="admin-layout">
            <AdminNavbar active="notifications" />
            <div className="admin-main">
                <div className="admin-page-header">
                    <h1 className="bn-text">ইমেইল নোটিফিকেশন সিস্টেম</h1>
                    <p className="bn-text">এখান থেকে কোন ইমেইল চালু থাকবে, টেস্ট ইমেইল যাবে কিনা, এবং নোটিশ বাল্ক সেফটি লক সক্রিয় আছে কিনা তা নিয়ন্ত্রণ করুন।</p>
                </div>

                <div className={`notification-safety-banner ${status?.allowBulkNoticeEmail ? 'unlocked' : 'locked'}`}>
                    <div className="notification-safety-copy">
                        <strong className="bn-text"><AlertTriangle size={18} /> Bulk notice email {status?.allowBulkNoticeEmail ? 'unlocked' : 'locked'}</strong>
                        <span className="bn-text">
                            {status?.allowBulkNoticeEmail
                                ? 'Bulk notice sending is currently allowed by backend env config. Use this carefully.'
                                : 'Safety mode is active. Notice email can only be tested to a single recipient unless the backend env lock is changed.'}
                        </span>
                    </div>
                    <button type="button" className="notification-refresh-btn" onClick={loadStatus} disabled={loadingStatus}>
                        {loadingStatus ? <Loader2 size={16} className="spin" /> : <RefreshCw size={16} />}
                        Refresh
                    </button>
                </div>

                <div className="demo-grid">
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <div className="admin-card-title bn-text"><Mail size={16} /> SMTP / Email Status</div>
                        </div>
                        {loadingStatus ? (
                            <p className="bn-text" style={{ color: '#64748b' }}>স্ট্যাটাস লোড হচ্ছে...</p>
                        ) : (
                            <>
                                <div className="notification-status-row">
                                    <span className="bn-text">Email Configured</span>
                                    <span className={`status-badge ${status?.emailConfigured ? 'approved' : 'rejected'}`}>
                                        {status?.emailConfigured ? 'Configured' : 'Not Configured'}
                                    </span>
                                </div>
                                <div className="notification-status-row">
                                    <span className="bn-text">Active Templates</span>
                                    <strong>{enabledCount} / {NOTIFICATION_CONTROLS.length}</strong>
                                </div>
                                <div className="notification-status-row">
                                    <span className="bn-text">Event Reminder Job</span>
                                    <span className={`status-badge ${status?.reminderJob?.enabled ? 'approved' : 'pending'}`}>
                                        {status?.reminderJob?.enabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                </div>
                                <div className="notification-status-row">
                                    <span className="bn-text">Reminder Interval</span>
                                    <strong>{status?.reminderJob?.intervalHours || 0} hour(s)</strong>
                                </div>
                                <div className="notification-status-row">
                                    <span className="bn-text">Days Ahead</span>
                                    <strong>{status?.reminderJob?.daysAhead || 0} day(s)</strong>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="admin-card">
                        <div className="admin-card-header">
                            <div className="admin-card-title bn-text"><ShieldCheck size={16} /> Notification Controls</div>
                        </div>
                        <p className="bn-text notification-muted-copy">
                            প্রতিটি সুইচ সেভ করার পর থেকেই ব্যাকএন্ড সেই ধরনের ইমেইল পাঠানো বন্ধ বা চালু করবে।
                        </p>
                        <div className="notification-settings-summary">
                            <span className="bn-text">Enabled templates: <strong>{enabledCount}</strong></span>
                            <button
                                type="button"
                                className="notification-primary-btn"
                                onClick={handleSaveSettings}
                                disabled={savingSettings}
                            >
                                {savingSettings ? <Loader2 size={18} className="spin" /> : <Save size={18} />}
                                {savingSettings ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                        <div className="notification-settings-meta">
                            <div className="notification-meta-item">
                                <span className="notification-meta-label bn-text">Last saved by</span>
                                <strong className="notification-meta-value">{status?.settingsUpdatedBy || 'Not saved yet'}</strong>
                            </div>
                            <div className="notification-meta-item">
                                <span className="notification-meta-label bn-text">Last saved at</span>
                                <strong className="notification-meta-value">{formatSavedAt(status?.settingsUpdatedAt)}</strong>
                            </div>
                        </div>
                        {saveMessage && (
                            <div className="notification-inline-message bn-text" role="status" aria-live="polite">
                                {saveMessage}
                            </div>
                        )}
                    </div>
                </div>

                <div className="admin-card">
                    <div className="admin-card-header">
                        <div className="admin-card-title bn-text"><Mail size={16} /> Template Controls & Test Emails</div>
                    </div>
                    <div className="notification-control-list">
                        {NOTIFICATION_CONTROLS.map((item) => (
                            <div key={item.key} className="notification-control-card">
                                <div className="notification-control-top">
                                    <div>
                                        <h3 className="bn-text notification-control-title">{item.title}</h3>
                                        <p className="notification-control-description">{item.description}</p>
                                    </div>
                                    <button
                                        type="button"
                                        className={`notification-toggle ${settings[item.key] ? 'enabled' : 'disabled'}`}
                                        onClick={() => handleToggleChange(item.key)}
                                        aria-pressed={Boolean(settings[item.key])}
                                    >
                                        <span className="notification-toggle-track">
                                            <span className="notification-toggle-thumb" />
                                        </span>
                                        <span>{settings[item.key] ? 'Enabled' : 'Disabled'}</span>
                                    </button>
                                </div>
                                <div className="notification-test-row">
                                    <div className="notification-test-input-wrap">
                                        <label className="bn-text" htmlFor={`test-email-${item.key}`}>Test Email</label>
                                        <input
                                            id={`test-email-${item.key}`}
                                            type="email"
                                            value={testEmails[item.key] || ''}
                                            onChange={(e) => setTestEmails((prev) => ({ ...prev, [item.key]: e.target.value }))}
                                            className="notification-test-input"
                                            placeholder="student@example.com"
                                        />
                                        <p className="notification-test-hint">{item.testHint}</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="notification-secondary-btn"
                                        onClick={() => handleTestEmail(item.key)}
                                        disabled={testingKey === item.key}
                                    >
                                        {testingKey === item.key ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
                                        {testingKey === item.key ? 'Sending...' : 'Send Test'}
                                    </button>
                                </div>
                                {testMessages[item.key] && (
                                    <div className="notification-inline-message bn-text" role="status" aria-live="polite">
                                        {testMessages[item.key]}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="demo-grid">
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <div className="admin-card-title bn-text"><CalendarClock size={16} /> Event Reminder (Manual Trigger)</div>
                        </div>
                        <p className="bn-text" style={{ color: '#64748b', marginBottom: '0.9rem' }}>
                            আগামী কত দিনের মধ্যে থাকা ইভেন্টের রিমাইন্ডার পাঠাতে চান তা নির্বাচন করুন।
                        </p>
                        <div className="notification-trigger-row">
                            <label className="bn-text" htmlFor="daysAhead">Days Ahead</label>
                            <input
                                id="daysAhead"
                                type="number"
                                min="1"
                                max="14"
                                value={daysAhead}
                                onChange={(e) => setDaysAhead(e.target.value)}
                                className="admin-filter-select"
                                style={{ width: '100px' }}
                            />
                            <button
                                type="button"
                                className="quick-action-btn bn-text"
                                style={{ maxWidth: '260px' }}
                                onClick={handleSendReminders}
                                disabled={sendingReminder}
                            >
                                {sendingReminder ? <Loader2 size={18} className="spin" /> : <Bell size={18} />}
                                {sendingReminder ? 'Sending...' : 'Send Event Reminder Now'}
                            </button>
                        </div>
                        {resultMessage && (
                            <div className="notification-result bn-text" role="status" aria-live="polite">
                                {resultMessage}
                            </div>
                        )}
                    </div>

                    <div className="admin-card">
                        <div className="admin-card-header">
                            <div className="admin-card-title bn-text"><ShieldCheck size={16} /> How This Page Works</div>
                        </div>
                        <ul className="notification-feature-list">
                            <li className="bn-text">Switches here control whether the backend will send each notification type at runtime.</li>
                            <li className="bn-text">Test emails use sample content and only go to the one address you enter.</li>
                            <li className="bn-text">The bulk notice lock is separate from the toggle and is enforced by backend env safety config.</li>
                            <li className="bn-text">Manual event reminders still respect the Event reminders toggle.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNotifications;

'use client';

import { useEffect, useState } from 'react';
import { Mail, Bell, CalendarClock, ShieldCheck, Loader2, Save, Send, AlertTriangle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import '../styles/Admin.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const DEFAULT_SETTINGS = {
    registrationStatus: true, profileEdit: true, noticePublished: true, eventReminders: true, passwordReset: true, loginAlerts: true,
};

const NOTIFICATION_CONTROLS = [
    { key: 'registrationStatus', title: 'Registration status', description: 'Emails sent from admin review actions.', testHint: 'Sends an approval preview.' },
    { key: 'profileEdit', title: 'Profile edit review', description: 'Approved and rejected profile edit review emails.', testHint: 'Sends an edited profile review preview.' },
    { key: 'noticePublished', title: 'Notice published', description: 'Controls notice email sending.', testHint: 'Sends a notice-template preview.' },
    { key: 'eventReminders', title: 'Event reminders', description: 'Controls reminder emails for upcoming events.', testHint: 'Sends a sample event reminder.' },
    { key: 'passwordReset', title: 'Password reset', description: 'Controls password-reset alerts.', testHint: 'Sends a sample OTP email preview.' },
    { key: 'loginAlerts', title: 'Login alerts', description: 'Controls new-login alert emails.', testHint: 'Sends a sample login alert.' },
];

export default function AdminNotificationsClient() {
    const [status, setStatus] = useState(null);
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [savingSettings, setSavingSettings] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [daysAhead, setDaysAhead] = useState(1);
    const [sendingReminder, setSendingReminder] = useState(false);
    const [testEmails, setTestEmails] = useState({});
    const [testMessages, setTestMessages] = useState({});
    const [testingKey, setTestingKey] = useState('');

    useEffect(() => { loadStatus(); }, []);

    const loadStatus = async () => {
        const token = localStorage.getItem('admin_token');
        setLoadingStatus(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/email/status`, { headers: { Authorization: `Bearer ${token}` } });
            setStatus(res.data);
            setSettings({ ...DEFAULT_SETTINGS, ...(res.data?.settings || {}) });
        } catch (err) { console.error('Failed to load status:', err); }
        finally { setLoadingStatus(false); }
    };

    const handleSaveSettings = async () => {
        const token = localStorage.getItem('admin_token');
        setSavingSettings(true); setSaveMessage('');
        try {
            const res = await axios.put(`${API_BASE_URL}/api/admin/email/settings`, { settings }, { headers: { Authorization: `Bearer ${token}` } });
            setSaveMessage(res.data?.msg || 'Settings saved.');
            loadStatus();
        } catch (err) { setSaveMessage('Failed to save settings.'); }
        finally { setSavingSettings(false); }
    };

    const handleSendReminders = async () => {
        const token = localStorage.getItem('admin_token');
        setSendingReminder(true);
        try {
            await axios.post(`${API_BASE_URL}/api/admin/events/reminders/send`, { daysAhead: Number(daysAhead) || 1 }, { headers: { Authorization: `Bearer ${token}` } });
            alert('Reminders sent.');
            loadStatus();
        } catch (err) { alert('Failed to send reminders.'); }
        finally { setSendingReminder(false); }
    };

    const handleTestEmail = async (key) => {
        const token = localStorage.getItem('admin_token');
        setTestingKey(key); setTestMessages(prev => ({ ...prev, [key]: '' }));
        try {
            const res = await axios.post(`${API_BASE_URL}/api/admin/email/test`, { type: key, to: testEmails[key] || '' }, { headers: { Authorization: `Bearer ${token}` } });
            setTestMessages(prev => ({ ...prev, [key]: res.data?.msg || 'Test sent.' }));
        } catch (err) { setTestMessages(prev => ({ ...prev, [key]: 'Failed to send test.' })); }
        finally { setTestingKey(''); }
    };

    return (
        <div className="admin-layout">
            <AdminNavbar active="notifications" />
            <div className="admin-main">
                <div className="admin-page-header"><h1 className="bn-text">ইমেইল নোটিফিকেশন সিস্টেম</h1><p>Manage email settings and manual triggers</p></div>

                <div className={`notification-safety-banner ${status?.allowBulkNoticeEmail ? 'unlocked' : 'locked'}`} style={{ padding: '1rem', background: status?.allowBulkNoticeEmail ? '#f0fdf4' : '#fff7ed', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}><AlertTriangle size={20} /><span>{status?.allowBulkNoticeEmail ? 'Bulk notice email unlocked' : 'Safety mode active: Bulk notice emails are blocked.'}</span></div>
                    <button className="btn-outline" onClick={loadStatus}>{loadingStatus ? <Loader2 className="spin" /> : <RefreshCw size={16} />} Refresh</button>
                </div>

                <div className="demo-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div className="admin-card">
                        <div className="admin-card-header"><h3 className="bn-text"><Mail size={16} /> SMTP / Email Status</h3></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Email Configured</span><span className={`status-badge ${status?.emailConfigured ? 'approved' : 'rejected'}`}>{status?.emailConfigured ? 'Yes' : 'No'}</span></div>
                        </div>
                    </div>
                    <div className="admin-card">
                        <div className="admin-card-header"><h3 className="bn-text"><Save size={16} /> Save Settings</h3></div>
                        <button className="btn-primary" onClick={handleSaveSettings} disabled={savingSettings} style={{ marginTop: '1rem', width: '100%' }}>{savingSettings ? 'Saving...' : 'Save All Settings'}</button>
                        {saveMessage && <p className="bn-text" style={{ marginTop: '0.5rem', color: '#10b981' }}>{saveMessage}</p>}
                    </div>
                </div>

                <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                    <div className="admin-card-header"><h3 className="bn-text">Notification Templates</h3></div>
                    <div className="notification-control-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                        {NOTIFICATION_CONTROLS.map(item => (
                            <div key={item.key} className="glass-panel" style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div><h4 className="bn-text">{item.title}</h4><p style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.description}</p></div>
                                    <input type="checkbox" checked={settings[item.key]} onChange={() => setSettings({ ...settings, [item.key]: !settings[item.key] })} />
                                </div>
                                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                                    <input type="email" placeholder="Test email..." value={testEmails[item.key] || ''} onChange={e => setTestEmails({ ...testEmails, [item.key]: e.target.value })} className="form-input" style={{ flex: 1, fontSize: '0.8rem' }} />
                                    <button className="btn-outline" onClick={() => handleTestEmail(item.key)} disabled={testingKey === item.key}>{testingKey === item.key ? <Loader2 className="spin" /> : <Send size={14} />}</button>
                                </div>
                                {testMessages[item.key] && <p style={{ fontSize: '0.75rem', marginTop: '0.4rem', color: '#6366f1' }}>{testMessages[item.key]}</p>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="admin-card">
                    <div className="admin-card-header"><h3 className="bn-text"><CalendarClock size={16} /> Manual Event Reminder</h3></div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
                        <input type="number" value={daysAhead} onChange={e => setDaysAhead(e.target.value)} className="form-input" style={{ width: '80px' }} />
                        <span>Days Ahead</span>
                        <button className="btn-primary" onClick={handleSendReminders} disabled={sendingReminder}><Bell size={16} /> Send Now</button>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

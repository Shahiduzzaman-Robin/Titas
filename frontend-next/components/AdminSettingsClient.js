'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Lock, Save, Eye, EyeOff, CheckCircle, AlertCircle, Settings, Shield } from 'lucide-react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import '../styles/Admin.css';
import '../styles/AdminSettings.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function AdminSettingsClient() {
    const [profile, setProfile] = useState({ username: '', email: '', displayName: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [pwSaving, setPwSaving] = useState(false);
    const [pwMsg, setPwMsg] = useState({ text: '', type: '' });
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('admin_token');
                const res = await axios.get(`${API_BASE_URL}/api/admin/profile`, { headers: { Authorization: `Bearer ${token}` } });
                setProfile({ username: res.data.username || '', email: res.data.email || '', displayName: res.data.displayName || '' });
            } catch (err) { console.error('Failed to fetch profile:', err); }
            finally { setLoading(false); }
        };
        fetchProfile();
    }, []);

    const handleProfileSave = async (e) => {
        e.preventDefault(); setMsg({ text: '', type: '' }); setSaving(true);
        try {
            const token = localStorage.getItem('admin_token');
            const res = await axios.put(`${API_BASE_URL}/api/admin/profile`, profile, { headers: { Authorization: `Bearer ${token}` } });
            setMsg({ text: res.data.msg || 'Profile updated!', type: 'success' });
            localStorage.setItem('admin_user', JSON.stringify({ ...JSON.parse(localStorage.getItem('admin_user') || '{}'), ...res.data.admin }));
        } catch (err) { setMsg({ text: err.response?.data?.msg || 'Failed to update profile', type: 'error' }); }
        finally { setSaving(false); }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault(); setPwMsg({ text: '', type: '' });
        if (pwForm.newPassword !== pwForm.confirmPassword) { setPwMsg({ text: 'New passwords do not match', type: 'error' }); return; }
        setPwSaving(true);
        try {
            const token = localStorage.getItem('admin_token');
            const res = await axios.put(`${API_BASE_URL}/api/admin/change-password`, { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }, { headers: { Authorization: `Bearer ${token}` } });
            setPwMsg({ text: res.data.msg || 'Password changed!', type: 'success' });
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) { setPwMsg({ text: err.response?.data?.msg || 'Failed to change password', type: 'error' }); }
        finally { setPwSaving(false); }
    };

    if (loading) return <div className="admin-layout"><AdminNavbar active="settings" /><div className="admin-container"><p style={{ textAlign: 'center', padding: '3rem' }}>Loading...</p></div></div>;

    return (
        <div className="admin-layout">
            <AdminNavbar active="settings" />
            <div className="admin-container">
                <div className="as-page-header">
                    <div className="as-page-header-icon"><Settings size={24} /></div>
                    <div><h2 className="as-page-title bn-text">অ্যাকাউন্ট সেটিংস</h2><p className="as-page-subtitle">আপনার প্রোফাইল তথ্য এবং নিরাপত্তা সেটিংস পরিচালনা করুন</p></div>
                </div>

                <div className="as-grid">
                    <div className="as-card">
                        <div className="as-card-header"><div className="as-card-icon as-card-icon-profile"><User size={20} /></div><div><h3 className="as-card-title bn-text">প্রোফাইল তথ্য</h3></div></div>
                        {msg.text && <div className={`as-alert ${msg.type === 'success' ? 'as-alert-success' : 'as-alert-error'}`}>{msg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}<span>{msg.text}</span></div>}
                        <form onSubmit={handleProfileSave}>
                            <div className="as-field"><label className="as-label"><User size={14} /> ইউজারনেম</label><input type="text" value={profile.username} onChange={e => setProfile({ ...profile, username: e.target.value })} className="as-input" required /></div>
                            <div className="as-field"><label className="as-label"><Mail size={14} /> ইমেইল</label><input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className="as-input" /></div>
                            <div className="as-field"><label className="as-label"><User size={14} /> ডিসপ্লে নেম</label><input type="text" value={profile.displayName} onChange={e => setProfile({ ...profile, displayName: e.target.value })} className="as-input" /></div>
                            <button type="submit" disabled={saving} className="as-btn as-btn-save"><Save size={16} /> {saving ? 'সেভ হচ্ছে...' : 'পরিবর্তন সেভ করুন'}</button>
                        </form>
                    </div>

                    <div className="as-card">
                        <div className="as-card-header"><div className="as-card-icon as-card-icon-security"><Shield size={20} /></div><div><h3 className="as-card-title bn-text">পাসওয়ার্ড পরিবর্তন</h3></div></div>
                        {pwMsg.text && <div className={`as-alert ${pwMsg.type === 'success' ? 'as-alert-success' : 'as-alert-error'}`}>{pwMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}<span>{pwMsg.text}</span></div>}
                        <form onSubmit={handlePasswordChange}>
                            <div className="as-field"><label className="as-label"><Lock size={14} /> বর্তমান পাসওয়ার্ড</label><div className="as-input-wrap"><input type={showCurrent ? 'text' : 'password'} value={pwForm.currentPassword} onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} className="as-input" required /><button type="button" onClick={() => setShowCurrent(!showCurrent)} className="as-eye-btn">{showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
                            <div className="as-field"><label className="as-label"><Lock size={14} /> নতুন পাসওয়ার্ড</label><div className="as-input-wrap"><input type={showNew ? 'text' : 'password'} value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} className="as-input" required minLength={6} /><button type="button" onClick={() => setShowNew(!showNew)} className="as-eye-btn">{showNew ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
                            <div className="as-field"><label className="as-label"><Lock size={14} /> নতুন নিশ্চিত করুন</label><input type="password" value={pwForm.confirmPassword} onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })} className="as-input" required minLength={6} /></div>
                            <button type="submit" disabled={pwSaving} className="as-btn as-btn-password"><Lock size={16} /> {pwSaving ? 'পরিবর্তন হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন করুন'}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

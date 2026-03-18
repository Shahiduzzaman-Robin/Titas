'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ShieldCheck, User } from 'lucide-react';
import axios from 'axios';
import '../styles/Login.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function LoginClient() {
    const [formData, setFormData] = useState({ emailOrMobile: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [detectedRole, setDetectedRole] = useState(null);
    const router = useRouter();

    const getAdminLandingPath = (role) => (role === 'Content Admin' ? '/admin/blog' : '/admin/dashboard');

    useEffect(() => {
        const adminToken = localStorage.getItem('admin_token');
        const studentToken = localStorage.getItem('titas_token');
        if (adminToken) {
            const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');
            router.replace(getAdminLandingPath(adminUser?.role));
        } else if (studentToken) {
            router.replace('/profile');
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setError(''); setDetectedRole(null);
        try {
            const res = await axios.post(`${API_BASE_URL}/api/students/login`, formData);
            localStorage.setItem('titas_token', res.data.token);
            localStorage.setItem('titas_user', JSON.stringify(res.data));
            setDetectedRole('student'); setTimeout(() => router.push('/profile'), 800); return;
        } catch (studentErr) {}
        try {
            const res = await axios.post(`${API_BASE_URL}/api/admin/login`, { username: formData.emailOrMobile.trim(), password: formData.password });
            localStorage.setItem('admin_token', res.data.token);
            localStorage.setItem('admin_user', JSON.stringify(res.data));
            setDetectedRole('admin'); setTimeout(() => router.push(getAdminLandingPath(res.data.role)), 800); return;
        } catch (adminErr) { setError('লগইন ব্যর্থ হয়েছে। তথ্য যাচাই করুন।'); }
        finally { setLoading(false); }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header text-center"><h2 className="bn-text">লগইন</h2><p className="bn-text text-muted">তিতাস ম্যানেজমেন্ট সিস্টেম</p></div>
                {detectedRole && <div className="alert"><span className="bn-text">{detectedRole === 'admin' ? 'অ্যাডমিন' : 'শিক্ষার্থী'} হিসেবে লগইন সফল! রিডাইরেক্ট হচ্ছে...</span></div>}
                {error && <div className="alert error-alert bn-text">{error}</div>}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group"><label className="bn-text">ইমেইল / মোবাইল / ইউজারনেম</label><div className="input-with-icon"><Mail size={18} className="input-icon" /><input type="text" value={formData.emailOrMobile} onChange={e => setFormData({ ...formData, emailOrMobile: e.target.value })} className="form-input with-icon" required /></div></div>
                    <div className="form-group"><label className="bn-text">পাসওয়ার্ড</label><div className="input-with-icon"><Lock size={18} className="input-icon" /><input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="form-input with-icon" required /></div></div>
                    <div className="text-right" style={{ marginBottom: '1.5rem', textAlign: 'right' }}><span onClick={() => router.push('/forgot-password')} className="forgot-password bn-text" style={{ cursor: 'pointer', fontSize: '0.85rem' }}>পাসওয়ার্ড ভুলে গেছেন?</span></div>
                    <button type="submit" className="btn-modern-submit w-full bn-text" disabled={loading || !!detectedRole}>{loading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}</button>
                </form>
                <div className="login-footer text-center"><p className="bn-text">নিবন্ধন করা নেই? <span onClick={() => router.push('/register')} style={{ cursor: 'pointer', color: '#3b82f6', fontWeight: 600 }}>এখানে নিবন্ধন করুন</span></p></div>
            </div>
        </div>
    );
}

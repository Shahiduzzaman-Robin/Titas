import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, User } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import '../styles/Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        emailOrMobile: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [detectedRole, setDetectedRole] = useState(null); // 'admin' | 'student' | null

    const navigate = useNavigate();

    useEffect(() => {
        const adminToken = localStorage.getItem('admin_token');
        const studentToken = localStorage.getItem('titas_token');

        if (adminToken) {
            navigate('/admin/dashboard', { replace: true });
        } else if (studentToken) {
            navigate('/profile', { replace: true });
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setDetectedRole(null);

        // Step 1: Try Student login first
        try {
            const studentRes = await axios.post(`${API_BASE_URL}/api/students/login`, formData);
            localStorage.setItem('titas_token', studentRes.data.token);
            localStorage.setItem('titas_user', JSON.stringify(studentRes.data));
            setDetectedRole('student');
            setTimeout(() => navigate('/profile'), 800);
            return;
        } catch (studentErr) {
            // Student login failed — silently try admin login
        }

        // Step 2: Try Admin login (using emailOrMobile as username)
        try {
            const adminRes = await axios.post(`${API_BASE_URL}/api/admin/login`, {
                username: formData.emailOrMobile,
                password: formData.password
            });
            localStorage.setItem('admin_token', adminRes.data.token);
            localStorage.setItem('admin_user', JSON.stringify(adminRes.data));
            setDetectedRole('admin');
            setTimeout(() => navigate('/admin/dashboard'), 800);
            return;
        } catch (adminErr) {
            // Both failed
            setError('লগইন ব্যর্থ হয়েছে। ইমেইল/মোবাইল/ইউজারনেম বা পাসওয়ার্ড চেক করুন।');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page flex-center">
            <div className="login-card">
                <div className="login-header text-center">
                    <h2 className="bn-text" style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>লগইন</h2>
                    <p className="bn-text text-muted">তিতাস ম্যানেজমেন্ট সিস্টেম</p>
                </div>

                {/* Success Feedback */}
                {detectedRole === 'admin' && (
                    <div className="alert" style={{ background: '#1a1a1a', color: '#fff', borderRadius: '8px', padding: '10px 16px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShieldCheck size={16} />
                        <span className="bn-text text-sm">অ্যাডমিন হিসেবে লগইন সফল! রিডাইরেক্ট হচ্ছে...</span>
                    </div>
                )}
                {detectedRole === 'student' && (
                    <div className="alert" style={{ background: '#d1fae5', color: '#065f46', borderRadius: '8px', padding: '10px 16px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={16} />
                        <span className="bn-text text-sm">শিক্ষার্থী হিসেবে লগইন সফল! রিডাইরেক্ট হচ্ছে...</span>
                    </div>
                )}

                {error && (
                    <div className="alert error-alert bn-text">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label className="form-label bn-text">ইমেইল / মোবাইল / ইউজারনেম</label>
                        <div className="input-with-icon">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="text"
                                name="emailOrMobile"
                                value={formData.emailOrMobile}
                                onChange={handleChange}
                                placeholder="email@example.com / 01XXXXXXXXX / admin"
                                className="form-input with-icon"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                        <label className="form-label bn-text">পাসওয়ার্ড</label>
                        <div className="input-with-icon">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="form-input with-icon"
                                required
                            />
                        </div>
                    </div>

                    <div className="text-right" style={{ marginBottom: '1.5rem' }}>
                        <span
                            onClick={() => navigate('/forgot-password')}
                            className="forgot-password bn-text"
                            style={{ cursor: 'pointer', fontSize: '0.85rem', color: '#64748b' }}
                        >
                            পাসওয়ার্ড ভুলে গেছেন?
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary w-full flex-center bn-text"
                        style={{ width: '100%', justifyContent: 'center' }}
                        disabled={loading || !!detectedRole}
                    >
                        {loading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}
                    </button>
                </form>

                <div className="login-footer text-center">
                    <p className="bn-text">
                        নিবন্ধন করা নেই? <span className="register-link" onClick={() => navigate('/register')} style={{ cursor: 'pointer', color: 'var(--text-main)', fontWeight: 600 }}>এখানে নিবন্ধন করুন</span>
                    </p>
                    <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.75rem' }}>
                        সিস্টেম স্বয়ংক্রিয়ভাবে ব্যবহারকারীর ধরন শনাক্ত করবে।
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

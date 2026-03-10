import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Key, ArrowLeft, CheckCircle, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import '../styles/Login.css'; // Reuse login styles

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`${API_BASE_URL}/api/students/forgot-password`, { email });
            setSuccess(res.data.msg);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.msg || 'OTP পাঠাতে ব্যর্থ হয়েছে।');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post(`${API_BASE_URL}/api/students/verify-otp`, { email, otp });
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.msg || 'ভুল ওটিপি অথবা ওটিপির মেয়াদ শেষ।');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return setError('পাসওয়ার্ড মেলেনি।');
        }
        if (newPassword.length < 6) {
            return setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
        }
        setLoading(true);
        setError('');
        try {
            await axios.post(`${API_BASE_URL}/api/students/reset-password`, { email, otp, newPassword });
            setSuccess('পাসওয়ার্ড সফলভাবে রিসেট হয়েছে! রিডাইরেক্ট হচ্ছে...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.msg || 'পাসওয়ার্ড রিসেট করা যাচ্ছে না।');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page flex-center">
            <div className="login-card">
                <div className="login-header text-center">
                    <button
                        onClick={() => step > 1 ? setStep(step - 1) : navigate('/login')}
                        className="back-btn"
                        style={{ position: 'absolute', left: '20px', top: '35px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="bn-text" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
                        {step === 1 && 'পাসওয়ার্ড ভুলে গেছেন?'}
                        {step === 2 && 'ওটিপি যাচাই করুন'}
                        {step === 3 && 'নতুন পাসওয়ার্ড সেট করুন'}
                    </h2>
                    <p className="bn-text text-muted" style={{ fontSize: '0.9rem' }}>
                        {step === 1 && 'আপনার নিবন্ধিত ইমেইলটি দিন'}
                        {step === 2 && `${email} ঠিকানায় ওটিপি পাঠানো হয়েছে`}
                        {step === 3 && 'একটি শক্তিশালী পাসওয়ার্ড চয়ন করুন'}
                    </p>
                </div>

                {error && <div className="alert error-alert bn-text">{error}</div>}
                {success && <div className="alert success-alert bn-text" style={{ background: '#d1fae5', color: '#065f46', padding: '10px', borderRadius: '8px', marginBottom: '1rem' }}>{success}</div>}

                {step === 1 && (
                    <form onSubmit={handleSendOTP} className="login-form">
                        <div className="form-group">
                            <label className="form-label bn-text">ইমেইল ঠিকানা</label>
                            <div className="input-with-icon">
                                <Mail size={18} className="input-icon" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your-email@example.com"
                                    className="form-input with-icon"
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary w-full flex-center bn-text" disabled={loading}>
                            {loading ? 'পাঠানো হচ্ছে...' : 'ওটিপি পাঠান'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOTP} className="login-form">
                        <div className="form-group">
                            <label className="form-label bn-text">৬-ডিজিটের ওটিপি</label>
                            <div className="input-with-icon">
                                <Key size={18} className="input-icon" />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="123456"
                                    maxLength="6"
                                    className="form-input with-icon"
                                    style={{ letterSpacing: '4px', textAlign: 'center', fontSize: '1.2rem' }}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary w-full flex-center bn-text" disabled={loading}>
                            {loading ? 'যাচাই করা হচ্ছে...' : 'যাচাই করুন'}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="login-form">
                        <div className="form-group">
                            <label className="form-label bn-text">নতুন পাসওয়ার্ড</label>
                            <div className="input-with-icon">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="form-input with-icon"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label bn-text">পাসওয়ার্ড নিশ্চিত করুন</label>
                            <div className="input-with-icon">
                                <ShieldAlert size={18} className="input-icon" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="form-input with-icon"
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary w-full flex-center bn-text" disabled={loading}>
                            {loading ? 'রিসেট হচ্ছে...' : 'পাসওয়ার্ড রিসেট করুন'}
                        </button>
                    </form>
                )}

                <div className="login-footer text-center" style={{ marginTop: '1.5rem' }}>
                    <p className="bn-text" style={{ cursor: 'pointer', color: 'var(--primary-color)' }} onClick={() => navigate('/login')}>
                        লগইন পেজে ফিরে যান
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

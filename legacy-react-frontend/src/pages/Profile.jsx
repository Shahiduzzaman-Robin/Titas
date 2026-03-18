import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Key, CheckCircle, Clock, X, Upload, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import CustomSelect from '../components/CustomSelect';
import '../styles/Profile.css';
import {
    sessionOptions, departmentOptions, hallOptions,
    bloodGroupOptions, upazilaOptions, genderOptions,
    API_BASE_URL
} from '../constants';

const FIELD_LABELS = {
    nameBn: 'নাম (বাংলা)', nameEn: 'নাম (ইংরেজি)', mobile: 'মোবাইল', email: 'ইমেইল',
    addressEn: 'ঠিকানা (ইংরেজি)', addressBn: 'ঠিকানা (বাংলা)', upazila: 'উপজেলা',
    bloodGroup: 'রক্তের গ্রুপ', gender: 'লিঙ্গ', organization: 'প্রতিষ্ঠান', jobTitle: 'পদবী',
    photo: 'প্রোফাইল ছবি'
};

const ActivityLog = ({ activities }) => {
    const [expandedIds, setExpandedIds] = useState({});
    const [showAll, setShowAll] = useState(false);

    const toggleExpand = (i) => setExpandedIds(prev => ({ ...prev, [i]: !prev[i] }));

    const reversedActivities = [...activities].reverse();
    const displayedActivities = showAll ? reversedActivities : reversedActivities.slice(0, 3);

    return (
        <div className="timeline">
            {displayedActivities.map((act, i) => {
                const hasDetails = act.details && Object.keys(act.details).length > 0;
                const isExpanded = expandedIds[i];

                return (
                    <div key={i} className="timeline-item">
                        <div className="timeline-icon bg-green-light"><CheckCircle size={16} className="text-green" /></div>
                        <div className="timeline-content">
                            <div className="flex-center flex-wrap gap-2">
                                <span className="bn-text font-medium">{act.actionTitle}</span>
                                <span className="badge bg-black text-white bn-text text-xs">অনুমোদিত</span>
                            </div>
                            <p className="text-xs text-muted mt-1">{new Date(act.timestamp).toLocaleString()}</p>
                            <p className="text-xs text-green mt-1 bn-text">অনুমোদন করেছেন: {act.adminName || 'System'}</p>

                            {hasDetails && (
                                <div style={{ marginTop: '0.6rem' }}>
                                    <button
                                        onClick={() => toggleExpand(i)}
                                        style={{
                                            background: '#f8fafc', border: '1px solid #e2e8f0', color: '#6366f1',
                                            fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
                                            padding: '4px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.25rem'
                                        }}
                                    >
                                        {isExpanded ? 'Hide Changes' : `View ${Object.keys(act.details).length} Changes`}
                                    </button>

                                    {isExpanded && (
                                        <div style={{
                                            marginTop: '0.6rem', background: '#fafbfc', borderRadius: '8px',
                                            padding: '0.75rem', border: '1px solid #edf2f7', fontSize: '0.78rem'
                                        }}>
                                            {Object.entries(act.details).map(([field, diff], idx) => (
                                                <div key={idx} style={{ marginBottom: idx < Object.keys(act.details).length - 1 ? '0.6rem' : 0 }}>
                                                    <span style={{ fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>{FIELD_LABELS[field] || field}:</span>
                                                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                                                        <span style={{ color: '#ef4444', textDecoration: 'line-through', background: '#fee2e2', padding: '1px 6px', borderRadius: '4px' }}>
                                                            {field === 'photo' ? '(Photo)' : (diff.oldValue || '—')}
                                                        </span>
                                                        <span style={{ color: '#94a3b8' }}>→</span>
                                                        <span style={{ color: '#16a34a', fontWeight: 600, background: '#dcfce7', padding: '1px 6px', borderRadius: '4px' }}>
                                                            {field === 'photo' ? '(New Photo)' : (diff.newValue || '—')}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            {!showAll && activities.length > 3 && (
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <button
                        onClick={() => setShowAll(true)}
                        className="bn-text"
                        style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                        আরো দেখুন (See {activities.length - 3} More)
                    </button>
                </div>
            )}
        </div>
    );
};

// ===================== PASSWORD CHANGE MODAL =====================
const PasswordModal = ({ onClose }) => {
    const token = localStorage.getItem('titas_token');
    const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [show, setShow] = useState({ old: false, new: false, confirm: false });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess('');
        if (form.newPassword !== form.confirmPassword) { setError('নতুন পাসওয়ার্ড মিলছে না।'); return; }
        if (form.newPassword.length < 6) { setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।'); return; }
        setLoading(true);
        try {
            await axios.put(`${API_BASE_URL}/api/students/me/password`,
                { oldPassword: form.oldPassword, newPassword: form.newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!');
            setTimeout(onClose, 1800);
        } catch (err) {
            console.error('Password change request failed:', err);
            const msg = err.response?.data?.msg || `সমস্যা হয়েছে (Status: ${err.response?.status || 'Network Error'})`;
            setError(msg);
        } finally { setLoading(false); }
    };

    const inputStyle = { width: '100%', padding: '0.55rem 2.5rem 0.55rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' };
    const labelStyle = { fontSize: '0.78rem', color: '#6b7280', fontWeight: 600, display: 'block', marginBottom: '0.3rem' };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={onClose}>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '420px', position: 'relative' }} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
                <h2 className="bn-text" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>পাসওয়ার্ড পরিবর্তন</h2>
                {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.6rem 0.9rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }} className="bn-text">{error}</div>}
                {success && <div style={{ background: '#dcfce7', color: '#16a34a', padding: '0.6rem 0.9rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }} className="bn-text">{success}</div>}
                <form onSubmit={handleSubmit}>
                    {/* Old password */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="bn-text" style={labelStyle}>বর্তমান পাসওয়ার্ড</label>
                        <div style={{ position: 'relative' }}>
                            <input type={show.old ? 'text' : 'password'} value={form.oldPassword}
                                onChange={e => setForm(f => ({ ...f, oldPassword: e.target.value }))}
                                style={inputStyle} autoComplete="current-password" />
                            <button type="button" onClick={() => setShow(s => ({ ...s, old: !s.old }))}
                                style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                                {show.old ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    {/* New password */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="bn-text" style={labelStyle}>নতুন পাসওয়ার্ড</label>
                        <div style={{ position: 'relative' }}>
                            <input type={show.new ? 'text' : 'password'} value={form.newPassword}
                                onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
                                style={inputStyle} autoComplete="new-password" />
                            <button type="button" onClick={() => setShow(s => ({ ...s, new: !s.new }))}
                                style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                                {show.new ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    {/* Confirm password */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label className="bn-text" style={labelStyle}>নতুন পাসওয়ার্ড নিশ্চিত করুন</label>
                        <div style={{ position: 'relative' }}>
                            <input type={show.confirm ? 'text' : 'password'} value={form.confirmPassword}
                                onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                                style={inputStyle} autoComplete="new-password" />
                            <button type="button" onClick={() => setShow(s => ({ ...s, confirm: !s.confirm }))}
                                style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                                {show.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.7rem', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }} className="bn-text">
                        {loading ? 'পরিবর্তন হচ্ছে...' : 'পরিবর্তন করুন'}
                    </button>
                </form>
            </div>
        </div>
    );
};


// ===================== FULL PAGE EDIT FORM =====================
const EditProfilePage = ({ profile, onClose, onSubmitted }) => {
    const token = localStorage.getItem('titas_token');
    const [form, setForm] = useState({
        nameEn: profile.nameEn || '',
        nameBn: profile.nameBn || '',
        session: profile.session || '',
        regNo: profile.regNo || '',
        mobile: profile.mobile || '',
        email: profile.email || '',
        addressEn: profile.addressEn || '',
        addressBn: profile.addressBn || '',
        upazila: profile.upazila || '',
        department: profile.department || '',
        bloodGroup: profile.bloodGroup || '',
        hall: profile.hall || '',
        gender: profile.gender || '',
        isEmployed: !!profile.isEmployed,
        organization: profile.organization || '',
        jobTitle: profile.jobTitle || '',
    });
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(profile.photo ? `${API_BASE_URL}${profile.photo}` : null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const EDITABLE = ['nameBn', 'nameEn', 'mobile', 'email', 'addressEn', 'addressBn', 'upazila', 'bloodGroup', 'gender', 'isEmployed', 'organization', 'jobTitle'];
            const changes = {};
            for (const key of EDITABLE) {
                const oldVal = String(profile[key] ?? '');
                const newVal = String(form[key] ?? '');
                if (oldVal !== newVal) changes[key] = form[key];
            }

            const hasTextChanges = Object.keys(changes).length > 0;
            const hasPhotoChange = !!photoFile;

            if (!hasTextChanges && !hasPhotoChange) {
                setError('কোনো পরিবর্তন করা হয়নি।');
                setLoading(false); return;
            }

            // One request for everything — admin must approve all changes including photo
            const formData = new FormData();
            if (hasTextChanges) {
                formData.append('changes', JSON.stringify(changes));
            }
            if (hasPhotoChange) {
                formData.append('photo', photoFile);
            }

            await axios.post(`${API_BASE_URL}/api/students/edit-request`, formData, {
                headers: { Authorization: `Bearer ${token}` }
                // Don't set Content-Type manually — browser sets it with boundary for FormData
            });

            onSubmitted();
        } catch (err) {
            console.error('Profile edit request failed:', err);
            const msg = err.response?.data?.msg || `সমস্যা হয়েছে (Status: ${err.response?.status || 'Network Error'})`;
            setError(msg);
        } finally { setLoading(false); }
    };


    const inputStyle = { width: '100%', padding: '0.55rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem', background: '#fff', boxSizing: 'border-box', color: '#1a1a2e', outline: 'none' };
    const labelStyle = { fontSize: '0.78rem', color: '#6b7280', fontWeight: 600, display: 'block', marginBottom: '0.3rem' };
    const fieldStyle = { display: 'flex', flexDirection: 'column', marginBottom: '0.85rem' };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 3000, overflowY: 'auto', background: '#f5f6f8', padding: '2rem 1rem' }}>
            <button onClick={onClose} style={{ position: 'fixed', top: '1rem', right: '1.5rem', zIndex: 3010, background: '#1a3c2e', color: '#fff', border: 'none', borderRadius: '50%', width: 38, height: 38, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>

            <h1 className="bn-text" style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem', color: '#1a1a2e' }}>প্রোফাইল সম্পাদনা</h1>

            <form onSubmit={handleSubmit} style={{ maxWidth: 820, margin: '0 auto', background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <h2 className="bn-text" style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>শিক্ষার্থী নিবন্ধন ফর্ম</h2>
                <p className="bn-text" style={{ textAlign: 'center', fontSize: '0.78rem', color: '#6b7280', marginBottom: '1.75rem' }}>অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য সঠিকভাবে পূরণ করুন</p>

                {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }} className="bn-text">{error}</div>}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem' }}>
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={fieldStyle}>
                                <label className="bn-text" style={labelStyle}>সেশন</label>
                                <CustomSelect
                                    name="session"
                                    value={form.session}
                                    onChange={e => set('session', e.target.value)}
                                    options={sessionOptions}
                                    placeholder="সেশন বেছে নিন"
                                />
                            </div>
                            <div style={fieldStyle}>
                                <label className="bn-text" style={labelStyle}>ঢাকা বিশ্ববিদ্যালয় রেজিস্ট্রেশন নম্বর</label>
                                <input type="text" value={form.regNo} readOnly style={{ ...inputStyle, background: '#f8fafc', color: '#94a3b8' }} placeholder="Admin দ্বারা নিয়ন্ত্রিত" />
                            </div>
                        </div>

                        <div style={fieldStyle}>
                            <label className="bn-text" style={labelStyle}>নাম (ইংরেজি)</label>
                            <input type="text" value={form.nameEn} onChange={e => set('nameEn', e.target.value)} style={inputStyle} />
                        </div>
                        <div style={fieldStyle}>
                            <label className="bn-text" style={labelStyle}>নাম (বাংলা)</label>
                            <input type="text" value={form.nameBn} onChange={e => set('nameBn', e.target.value)} style={inputStyle} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={fieldStyle}>
                                <label className="bn-text" style={labelStyle}>মোবাইল নম্বর</label>
                                <input type="text" value={form.mobile} onChange={e => set('mobile', e.target.value)} style={inputStyle} />
                            </div>
                            <div style={fieldStyle}>
                                <label className="bn-text" style={labelStyle}>ইমেইল</label>
                                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={fieldStyle}>
                                <label className="bn-text" style={labelStyle}>ঠিকানা (ইংরেজি) <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>(উপজেলা বাদে)</span></label>
                                <input type="text" value={form.addressEn} onChange={e => set('addressEn', e.target.value)} style={inputStyle} />
                            </div>
                            <div style={fieldStyle}>
                                <label className="bn-text" style={labelStyle}>ঠিকানা (বাংলা) <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>(উপজেলা বাদে)</span></label>
                                <input type="text" value={form.addressBn} onChange={e => set('addressBn', e.target.value)} style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={fieldStyle}>
                                <label className="bn-text" style={labelStyle}>উপজেলা</label>
                                <CustomSelect
                                    name="upazila"
                                    value={form.upazila}
                                    onChange={e => set('upazila', e.target.value)}
                                    options={upazilaOptions}
                                    placeholder="উপজেলা বেছে নিন"
                                />
                            </div>
                            <div style={fieldStyle}>
                                <label className="bn-text" style={labelStyle}>ডিপার্টমেন্ট</label>
                                <CustomSelect
                                    name="department"
                                    value={form.department}
                                    onChange={e => set('department', e.target.value)}
                                    options={departmentOptions}
                                    placeholder="বিভাগ বেছে নিন"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={fieldStyle}>
                                <label className="bn-text" style={labelStyle}>রক্তের গ্রুপ</label>
                                <CustomSelect
                                    name="bloodGroup"
                                    value={form.bloodGroup}
                                    onChange={e => set('bloodGroup', e.target.value)}
                                    options={bloodGroupOptions}
                                    placeholder="রক্তের গ্রুপ বেছে নিন"
                                />
                            </div>
                            <div style={fieldStyle}>
                                <label className="bn-text" style={labelStyle}>হল</label>
                                <CustomSelect
                                    name="hall"
                                    value={form.hall}
                                    onChange={e => set('hall', e.target.value)}
                                    options={hallOptions}
                                    placeholder="হল বেছে নিন"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'end' }}>
                            <div style={fieldStyle}>
                                <label className="bn-text" style={labelStyle}>লিঙ্গ</label>
                                <CustomSelect
                                    name="gender"
                                    value={form.gender}
                                    onChange={e => set('gender', e.target.value)}
                                    options={genderOptions}
                                    placeholder="লিঙ্গ বেছে নিন"
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                                <input type="checkbox" id="isEmployed" checked={form.isEmployed} onChange={e => set('isEmployed', e.target.checked)}
                                    style={{ width: 16, height: 16, accentColor: '#1a3c2e', cursor: 'pointer' }} />
                                <label htmlFor="isEmployed" className="bn-text" style={{ fontSize: '0.85rem', cursor: 'pointer', color: '#374151' }}>
                                    আপনি কি বর্তমানে চাকুরীজীবী?
                                </label>
                            </div>
                        </div>

                        {form.isEmployed && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={fieldStyle}>
                                    <label className="bn-text" style={labelStyle}>প্রতিষ্ঠান / দপ্তর এর নাম</label>
                                    <input type="text" value={form.organization} onChange={e => set('organization', e.target.value)} style={inputStyle} />
                                </div>
                                <div style={fieldStyle}>
                                    <label className="bn-text" style={labelStyle}>পদবী</label>
                                    <input type="text" value={form.jobTitle} onChange={e => set('jobTitle', e.target.value)} style={inputStyle} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Photo upload */}
                    <div style={{ width: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', paddingTop: '0.5rem' }}>
                        <label className="bn-text" style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 600, marginBottom: '0.4rem', alignSelf: 'flex-start' }}>ছবি আপলোড করুন</label>
                        <div style={{ width: 150, height: 175, borderRadius: '10px', border: '2px dashed #d1d5db', overflow: 'hidden', position: 'relative', background: '#f8fafc', cursor: 'pointer' }}
                            onClick={() => document.getElementById('photo-upload').click()}>
                            {photoPreview ? (
                                <>
                                    <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <button type="button" style={{ position: 'absolute', top: 4, right: 4, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}
                                        onClick={e => { e.stopPropagation(); setPhotoFile(null); setPhotoPreview(profile.photo ? `http://localhost:5002${profile.photo}` : null); }}>✕</button>
                                </>
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#9ca3af' }}>
                                    <Upload size={32} /><span className="bn-text" style={{ fontSize: '0.72rem', textAlign: 'center', padding: '0 0.5rem' }}>ক্লিক করে ছবি আপলোড করুন</span>
                                </div>
                            )}
                        </div>
                        <input id="photo-upload" type="file" accept="image/jpeg,image/png,image/jpg" style={{ display: 'none' }} onChange={handlePhotoChange} />
                        <p className="bn-text" style={{ fontSize: '0.7rem', color: '#9ca3af', textAlign: 'center' }}>JPEG / PNG, সর্বোচ্চ 5MB</p>
                        {photoFile && <p className="bn-text" style={{ fontSize: '0.72rem', color: '#16a34a', textAlign: 'center' }}>✓ ছবি অনুমোদনের জন্য পাঠানো হবে</p>}
                    </div>
                </div>

                <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: '8px', padding: '0.6rem 0.9rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <Clock size={15} style={{ color: '#d97706', marginTop: 2, flexShrink: 0 }} />
                    <span className="bn-text" style={{ fontSize: '0.78rem', color: '#92400e' }}>
                        তথ্য পরিবর্তন অ্যাডমিন অনুমোদনের পর সক্রিয় হবে। ছবি সাথে সাথে আপডেট হবে।
                    </span>
                </div>

                <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.85rem', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }} className="bn-text">
                    {loading ? 'পাঠানো হচ্ছে...' : 'সংরক্ষণ করুন'}
                </button>
            </form>
        </div>
    );
};

// ===================== PROFILE PAGE =====================
const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [pendingEdit, setPendingEdit] = useState(null);
    const [photoUpdated, setPhotoUpdated] = useState(false);
    const navigate = useNavigate();

    const fetchProfile = async () => {
        const token = localStorage.getItem('titas_token');
        if (!token) { navigate('/login'); return; }
        try {
            const [profileRes, editsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/students/me`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_BASE_URL}/api/students/my-edits`, { headers: { Authorization: `Bearer ${token}` } }),
            ]);
            setProfile(profileRes.data);
            const pending = editsRes.data.find(e => e.status === 'Pending');
            if (pending) setPendingEdit(pending);
        } catch (err) {
            console.error(err);
            localStorage.removeItem('titas_token');
            navigate('/login');
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchProfile(); }, [navigate]);

    // All edits require admin approval
    const handleEditSubmitted = () => {
        setShowEditForm(false);
        setPendingEdit({ status: 'Pending', createdAt: new Date().toISOString() });
    };

    if (loading) return <div className="text-center" style={{ padding: '4rem' }}>লোডিং...</div>;
    if (!profile) return null;

    const completenessCriteria = [
        { label: 'মৌলিক তথ্য', isComplete: !!profile.nameEn && !!profile.nameBn },
        { label: 'প্রোফাইল ছবি', isComplete: !!profile.photo },
        { label: 'যোগাযোগের তথ্য', isComplete: !!profile.mobile && !!profile.email },
        { label: 'ঠিকানার বিবরণ', isComplete: !!profile.addressEn && !!profile.upazila },
        { label: 'একাডেমিক তথ্য', isComplete: !!profile.session && !!profile.department && !!profile.hall },
        { label: 'ঢাবি রেজিস্ট্রেশন', isComplete: !!profile.regNo },
        { label: 'রক্তের গ্রুপ', isComplete: !!profile.bloodGroup }
    ];
    const completedCount = completenessCriteria.filter(c => c.isComplete).length;
    const progressPercentage = Math.round((completedCount / completenessCriteria.length) * 100);

    return (
        <div className="profile-page">
            {showEditForm && <EditProfilePage profile={profile} onClose={() => setShowEditForm(false)} onSubmitted={handleEditSubmitted} />}
            {showPasswordModal && <PasswordModal onClose={() => setShowPasswordModal(false)} />}

            <div className="container profile-container">

                {/* Banners Wrapper */}
                <div style={{ gridColumn: '1 / -1' }}>
                    {pendingEdit && (
                        <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: '10px', padding: '0.75rem 1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Clock size={18} style={{ color: '#d97706', flexShrink: 0 }} />
                            <span className="bn-text" style={{ fontSize: '0.88rem', color: '#92400e' }}>
                                আপনার প্রোফাইল সম্পাদনার অনুরোধ অ্যাডমিনের অনুমোদনের অপেক্ষায় রয়েছে।
                                {pendingEdit.createdAt && ` (${new Date(pendingEdit.createdAt).toLocaleDateString('en-GB')})`}
                            </span>
                        </div>
                    )}
                    {photoUpdated && (
                        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: '10px', padding: '0.75rem 1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <CheckCircle size={18} style={{ color: '#16a34a', flexShrink: 0 }} />
                            <span className="bn-text" style={{ fontSize: '0.88rem', color: '#15803d' }}>প্রোফাইল ছবি সফলভাবে আপডেট হয়েছে!</span>
                        </div>
                    )}
                </div>


                {/* Left Column */}
                <div className="profile-sidebar">
                    <div className="card text-center profile-summary-card">
                        <div className="profile-img-lg-container mx-auto">
                            {profile.photo ? (
                                <img src={`${API_BASE_URL}${profile.photo}`} alt="Profile" className="profile-img-lg" />
                            ) : (
                                <div className="profile-placeholder-lg bg-gray"><span className="text-gray" style={{ fontSize: '3rem' }}>👤</span></div>
                            )}
                        </div>
                        <h2 className="bn-text" style={{ fontSize: '1.25rem', marginTop: '1rem', fontWeight: 600 }}>{profile.nameEn}</h2>
                        <p className="bn-text text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>{profile.nameBn}</p>

                        <div className="action-buttons flex-col gap-2">
                            <button className="btn-outline w-full flex-center bn-text" onClick={() => setShowEditForm(true)}>
                                <Edit size={16} style={{ marginRight: '8px' }} /> প্রোফাইল সম্পাদনা
                            </button>
                            <button className="btn-outline w-full flex-center bn-text" onClick={() => setShowPasswordModal(true)}>
                                <Key size={16} style={{ marginRight: '8px' }} /> পাসওয়ার্ড পরিবর্তন করুন
                            </button>
                        </div>

                        <div className="profile-stats text-left mt-6 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                            <div className="stat-row flex-between">
                                <span className="text-muted bn-text">তিতাস আইডি:</span>
                                <span className="font-semibold bn-text">TITAS-{profile._id.substring(profile._id.length - 4)}</span>
                            </div>
                            <div className="stat-row flex-between mt-3">
                                <span className="text-muted bn-text">অ্যাকাউন্ট নিবন্ধিত:</span>
                                <span className="font-semibold en-text">{new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                            </div>
                            <div className="stat-row flex-between mt-3">
                                <span className="text-muted bn-text">রক্তের গ্রুপ:</span>
                                <span className="text-red font-semibold">{profile.bloodGroup}</span>
                            </div>
                        </div>
                    </div>

                    <div className="card mt-6">
                        <h3 className="bn-text font-bold mb-4" style={{ fontSize: '1.1rem' }}>প্রোফাইল সম্পূর্ণতা</h3>
                        <div className="progress-header flex-between mb-2">
                            <span className="bn-text text-sm">অগ্রগতি</span>
                            <span className="font-semibold text-sm en-text">{progressPercentage}%</span>
                        </div>
                        <div className="progress-bar mb-3">
                            <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                        <p className="bn-text text-xs text-muted mb-4">{completenessCriteria.length} এর মধ্যে {completedCount} ক্ষেত্র সম্পূর্ণ</p>
                        <ul className="checklist">
                            {completenessCriteria.map((c, i) => (
                                <li key={i} className="flex-center bn-text text-sm mb-2">
                                    {c.isComplete ? <CheckCircle size={16} className="text-green mr-2" /> : <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #ccc', marginRight: '8px' }} />}
                                    <span className={!c.isComplete ? 'text-muted' : ''}>{c.label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Column */}
                <div className="profile-content">
                    <div className="card details-card">
                        <div className="card-header flex-between mb-6">
                            <h2 className="bn-text text-xl font-bold" style={{ fontSize: '1.4rem' }}>একাডেমিক এবং ব্যক্তিগত বিবরণ</h2>
                            <button className="btn-outline flex-center text-sm bn-text">
                                <span style={{ marginRight: '6px' }}>💳</span> ডিজিটাল আইডি কার্ড
                            </button>
                        </div>
                        <div className="details-grid">
                            <div className="detail-group"><p className="detail-label bn-text">তিতাস আইডি</p><p className="detail-value en-text font-bold">TITAS-{profile._id.substring(profile._id.length - 4)}</p></div>
                            <div className="detail-group"><p className="detail-label bn-text">ঢাবি রেজি. নম্বর</p><p className="detail-value en-text font-bold">{profile.regNo}</p></div>
                            <div className="detail-group"><p className="detail-label bn-text">সেশন</p><p className="detail-value en-text font-bold">{profile.session}</p></div>
                            <div className="detail-group"><p className="detail-label bn-text">ডিপার্টমেন্ট</p><p className="detail-value en-text font-bold">{profile.department}</p></div>
                            <div className="detail-group mt-4 pt-4 border-t" style={{ gridColumn: '1 / -1' }} />
                            <div className="detail-group"><p className="detail-label bn-text">হল</p><p className="detail-value en-text font-bold">{profile.hall}</p></div>
                            <div className="detail-group"><p className="detail-label bn-text">রক্তের গ্রুপ</p><p className="detail-value en-text font-bold">{profile.bloodGroup}</p></div>
                            <div className="detail-group mt-4 pt-4 border-t" style={{ gridColumn: '1 / -1' }} />
                            <div className="detail-group"><p className="detail-label bn-text">মোবাইল</p><p className="detail-value en-text font-bold">{profile.mobile}</p></div>
                            <div className="detail-group"><p className="detail-label bn-text">ইমেইল</p><p className="detail-value en-text font-bold">{profile.email}</p></div>
                            <div className="detail-group mt-4 pt-4 border-t" style={{ gridColumn: '1 / -1' }} />
                            <div className="detail-group">
                                <p className="detail-label bn-text">বর্তমান ঠিকানা</p>
                                <p className="detail-value en-text font-bold">{profile.addressEn}{profile.upazila ? `, ${profile.upazila}` : ''}</p>
                                {profile.addressBn && <p className="detail-sub bn-text text-xs text-muted mt-1">{profile.addressBn}{profile.upazila ? `, ${profile.upazila}` : ''}</p>}
                            </div>
                            <div className="detail-group"><p className="detail-label bn-text">উপজেলা</p><p className="detail-value en-text font-bold">{profile.upazila}</p></div>
                            {/* Job info - only shown if employed */}
                            {profile.isEmployed && profile.organization && (
                                <>
                                    <div className="detail-group mt-4 pt-4 border-t" style={{ gridColumn: '1 / -1' }} />
                                    <div className="detail-group"><p className="detail-label bn-text">প্রতিষ্ঠান</p><p className="detail-value en-text font-bold">{profile.organization}</p></div>
                                    <div className="detail-group"><p className="detail-label bn-text">পদবী</p><p className="detail-value en-text font-bold">{profile.jobTitle}</p></div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="card timeline-card mt-6">
                        <h3 className="bn-text font-bold mb-6" style={{ fontSize: '1.25rem' }}>কার্যকলাপের সময়রেখা</h3>
                        {profile.activities && profile.activities.length > 0 ? (
                            <ActivityLog activities={profile.activities} />
                        ) : (
                            <p className="text-center text-muted text-sm bn-text py-4">কোন কার্যকলাপ রেকর্ড করা হয়নি</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

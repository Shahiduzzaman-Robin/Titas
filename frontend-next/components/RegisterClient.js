'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Upload } from 'lucide-react';
import axios from 'axios';
import CustomSelect from './CustomSelect';
import { 
    departmentOptions, 
    sessionOptions, 
    hallOptions, 
    bloodGroupOptions, 
    upazilaOptions, 
    genderOptions 
} from '../lib/constants';
import '../styles/Register.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const MOBILE_REGEX = /^01\d{9}$/;

export default function RegisterClient() {
    const [formData, setFormData] = useState({
        session: '',
        regNo: '',
        nameEn: '',
        nameBn: '',
        mobile: '',
        email: '',
        addressEn: '',
        addressBn: '',
        upazila: '',
        department: '',
        bloodGroup: '',
        hall: '',
        gender: '',
        isEmployed: false,
        organization: '',
        jobTitle: '',
        password: ''
    });
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState({ regNo: '', mobile: '', email: '' });
    const [checkingField, setCheckingField] = useState({ regNo: false, mobile: false, email: false });
    const [duplicateRecord, setDuplicateRecord] = useState(null);

    const router = useRouter();

    const setFieldChecking = (name, value) => {
        setCheckingField((prev) => ({ ...prev, [name]: value }));
    };

    const checkDuplicateFields = async (payload) => {
        const res = await axios.get(`${API_BASE_URL}/api/students/check-duplicate`, { params: payload });
        return res.data || {
            duplicates: { regNo: false, mobile: false, email: false },
            messages: { regNo: '', mobile: '', email: '' },
            records: { regNo: null, mobile: null, email: null }
        };
    };

    const pickDuplicateRecord = (payload) => payload?.records?.regNo || payload?.records?.mobile || payload?.records?.email || null;

    const getMobileValidationError = (mobileValue) => {
        const trimmedMobile = String(mobileValue || '').trim();
        if (!trimmedMobile) return 'মোবাইল নম্বর প্রদান করুন।';
        if (trimmedMobile.startsWith('+88')) {
            return 'মোবাইল নম্বর +88 ছাড়া ১১ ডিজিটে দিন (যেমন: 01XXXXXXXXX)।';
        }
        if (!MOBILE_REGEX.test(trimmedMobile)) {
            return 'মোবাইল নম্বর অবশ্যই ১১ ডিজিট হতে হবে এবং 01 দিয়ে শুরু হতে হবে।';
        }
        return '';
    };

    const handleFieldBlur = async (name) => {
        if (!['regNo', 'mobile', 'email'].includes(name)) return;

        const value = (formData[name] || '').trim();
        if (!value) {
            setFieldErrors((prev) => ({ ...prev, [name]: '' }));
            if (!fieldErrors.regNo && !fieldErrors.mobile && !fieldErrors.email) {
                setDuplicateRecord(null);
            }
            return;
        }

        if (name === 'mobile') {
            const mobileError = getMobileValidationError(value);
            if (mobileError) {
                setFieldErrors((prev) => ({ ...prev, mobile: mobileError }));
                setDuplicateRecord(null);
                return;
            }
        }

        setFieldChecking(name, true);
        try {
            const payload = await checkDuplicateFields({ [name]: value });
            setFieldErrors((prev) => ({
                ...prev,
                [name]: payload.duplicates?.[name] ? (payload.messages?.[name] || 'এই তথ্যটি ইতিমধ্যে ব্যবহার করা হয়েছে।') : ''
            }));

            if (payload.duplicates?.[name]) {
                setDuplicateRecord(payload.records?.[name] || null);
            } else {
                const hasAnyDuplicate = ['regNo', 'mobile', 'email']
                    .some((field) => field !== name && Boolean(fieldErrors[field]));
                if (!hasAnyDuplicate) {
                    setDuplicateRecord(null);
                }
            }
        } catch (err) {
            setFieldErrors((prev) => ({ ...prev, [name]: '' }));
        } finally {
            setFieldChecking(name, false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        let nextValue = value;
        if (name === 'mobile') {
            nextValue = String(value || '')
                .replace(/\D/g, '')
                .slice(0, 11);
        }

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : nextValue
        });

        if (['regNo', 'mobile', 'email'].includes(name)) {
            setFieldErrors((prev) => ({ ...prev, [name]: '' }));
        }

        if (duplicateRecord) {
            setDuplicateRecord(null);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const mobileError = getMobileValidationError(formData.mobile);
        if (mobileError) {
            setFieldErrors((prev) => ({ ...prev, mobile: mobileError }));
            setLoading(false);
            setMessage('দয়া করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (দেশকোড ছাড়া)।');
            return;
        }

        if (!photo) {
            setLoading(false);
            setMessage('নিবন্ধনের জন্য একটি প্রোফাইল ছবি আপলোড করা বাধ্যতামূলক।');
            return;
        }

        try {
            const duplicatePayload = await checkDuplicateFields({
                regNo: formData.regNo?.trim(),
                mobile: formData.mobile?.trim(),
                email: formData.email?.trim()
            });

            const nextErrors = {
                regNo: duplicatePayload.duplicates?.regNo ? duplicatePayload.messages?.regNo : '',
                mobile: duplicatePayload.duplicates?.mobile ? duplicatePayload.messages?.mobile : '',
                email: duplicatePayload.duplicates?.email ? duplicatePayload.messages?.email : ''
            };

            setFieldErrors(nextErrors);
            setDuplicateRecord(pickDuplicateRecord(duplicatePayload));

            if (nextErrors.regNo || nextErrors.mobile || nextErrors.email) {
                setMessage('দয়া করে ডুপ্লিকেট তথ্যগুলো ঠিক করে আবার চেষ্টা করুন।');
                setLoading(false);
                return;
            }
        } catch (err) {
            setLoading(false);
            setMessage('ভ্যালিডেশন চেক করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
            return;
        }

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        if (photo) {
            data.append('photo', photo);
        }

        try {
            const res = await axios.post(`${API_BASE_URL}/api/students`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage('Registration Successful!');
            // Reset form
            setFormData({
                session: '', regNo: '', nameEn: '', nameBn: '', mobile: '', email: '',
                addressEn: '', addressBn: '', upazila: '', department: '', bloodGroup: '',
                hall: '', gender: '', isEmployed: false, organization: '', jobTitle: '', password: ''
            });
            setFieldErrors({ regNo: '', mobile: '', email: '' });
            setDuplicateRecord(null);
            setPhoto(null);
            setPreview(null);
            setTimeout(() => router.push('/login'), 2000);
        } catch (err) {
            setMessage(err.response?.data?.msg || 'An error occurred during registration.');
        } finally {
            setLoading(false);
        }
    };

    const hasDuplicateError = Boolean(fieldErrors.regNo || fieldErrors.mobile || fieldErrors.email);
    const isCheckingAny = Object.values(checkingField).some(Boolean);

    return (
        <div className="register-page">
            <div className="container" style={{ maxWidth: '1000px', paddingTop: '4rem', paddingBottom: '4rem' }}>
                <div className="text-center" style={{ marginBottom: '2.5rem' }}>
                    <h2 className="bn-text" style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#0f172a' }}>শিক্ষার্থী নিবন্ধন ফর্ম</h2>
                    <p className="bn-text text-muted">অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য সতর্কতার সাথে পূরণ করুন</p>
                </div>

                {message && (
                    <div className="alert" style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: message.toLocaleLowerCase().includes('success') ? '#dcfce7' : '#fee2e2', borderRadius: '8px', color: message.toLocaleLowerCase().includes('success') ? '#166534' : '#991b1b', textAlign: 'center' }}>
                        {message}
                    </div>
                )}

                {duplicateRecord && (
                    <div className="duplicate-record-card" role="status" aria-live="polite">
                        <div className="duplicate-record-icon" aria-hidden="true">
                            <Search size={30} />
                        </div>
                        <div className="duplicate-record-content">
                            <h3 className="bn-text">আপনার ডাটা ইতিমধ্যেই বিদ্যমান!</h3>
                            <p className="bn-text">শিক্ষার্থীর নাম: {duplicateRecord.nameBn || duplicateRecord.nameEn || 'N/A'}</p>
                            <p className="bn-text">তিতাস আইডি: <span className="duplicate-badge">{duplicateRecord.titasId || 'N/A'}</span></p>
                            <p className="bn-text duplicate-record-note">আপনি আমাদের স্টুডেন্ট ডিরেক্টরি থেকে আপনার তথ্য যাচাই করতে পারবেন</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-grid">
                        {/* Left Column - Form Fields */}
                        <div className="fields-column">
                            <div className="row">
                                <div className="form-group">
                                    <label className="form-label bn-text">সেশন</label>
                                    <CustomSelect
                                        name="session"
                                        value={formData.session}
                                        onChange={handleChange}
                                        options={sessionOptions}
                                        placeholder="সেশন নির্বাচন করুন"
                                        required={true}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label bn-text">ঢাকা বিশ্ববিদ্যালয় রেজিস্ট্রেশন নম্বর</label>
                                    <input type="text" name="regNo" value={formData.regNo} onChange={handleChange} onBlur={() => handleFieldBlur('regNo')} placeholder="আপনার ঢাবি রেজিস্ট্রেশন নম্বর দিন" className="form-input bn-text" required />
                                    {checkingField.regNo && <div className="field-feedback checking bn-text">চেক করা হচ্ছে...</div>}
                                    {fieldErrors.regNo && <div className="field-feedback error bn-text">{fieldErrors.regNo}</div>}
                                </div>
                            </div>

                            <div className="row">
                                <div className="form-group">
                                    <label className="form-label bn-text">নাম (ইংরেজি)</label>
                                    <input type="text" name="nameEn" value={formData.nameEn} onChange={handleChange} placeholder="আপনার পূর্ণ নাম ইংরেজিতে লিখুন" className="form-input bn-text" required />
                                </div>

                                <div className="form-group">
                                    <label className="form-label bn-text">নাম (বাংলা)</label>
                                    <input type="text" name="nameBn" value={formData.nameBn} onChange={handleChange} placeholder="আপনার পূর্ণ নাম বাংলায় লিখুন" className="form-input bn-text" required />
                                </div>
                            </div>

                            <div className="row">
                                <div className="form-group">
                                    <label className="form-label bn-text">মোবাইল নম্বর</label>
                                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} onBlur={() => handleFieldBlur('mobile')} placeholder="01XXXXXXXXX" className="form-input bn-text" required maxLength="11" inputMode="numeric" pattern="01[0-9]{9}" />
                                    {checkingField.mobile && <div className="field-feedback checking bn-text">চেক করা হচ্ছে...</div>}
                                    {fieldErrors.mobile && <div className="field-feedback error bn-text">{fieldErrors.mobile}</div>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label bn-text">ইমেইল</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={() => handleFieldBlur('email')} placeholder="example@email.com" className="form-input" required />
                                    {checkingField.email && <div className="field-feedback checking bn-text">চেক করা হচ্ছে...</div>}
                                    {fieldErrors.email && <div className="field-feedback error bn-text">{fieldErrors.email}</div>}
                                </div>
                            </div>

                            <div className="row">
                                <div className="form-group">
                                    <label className="form-label bn-text">ঠিকানা (ইংরেজি) <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>(উপজেলা ব্যতীত)</span></label>
                                    <input type="text" name="addressEn" value={formData.addressEn} onChange={handleChange} placeholder="গ্রাম/মহল্লা ইংরেজিতে" className="form-input bn-text" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label bn-text">ঠিকানা (বাংলা) <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>(উপজেলা ব্যতীত)</span></label>
                                    <input type="text" name="addressBn" value={formData.addressBn} onChange={handleChange} placeholder="গ্রাম/মহল্লা বাংলায়" className="form-input bn-text" required />
                                </div>
                            </div>

                            <div className="row">
                                <div className="form-group">
                                    <label className="form-label bn-text">উপজেলা</label>
                                    <CustomSelect
                                        name="upazila"
                                        value={formData.upazila}
                                        onChange={handleChange}
                                        options={upazilaOptions}
                                        placeholder="উপজেলা নির্বাচন করুন"
                                        required={true}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label bn-text">ডিপার্টমেন্ট</label>
                                    <CustomSelect
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        options={departmentOptions}
                                        placeholder="ডিপার্টমেন্ট নির্বাচন করুন"
                                        required={true}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="form-group">
                                    <label className="form-label bn-text">রক্তের গ্রুপ</label>
                                    <CustomSelect
                                        name="bloodGroup"
                                        value={formData.bloodGroup}
                                        onChange={handleChange}
                                        options={bloodGroupOptions}
                                        placeholder="রক্তের গ্রুপ নির্বাচন করুন"
                                        required={true}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label bn-text">হল</label>
                                    <CustomSelect
                                        name="hall"
                                        value={formData.hall}
                                        onChange={handleChange}
                                        options={hallOptions}
                                        placeholder="হল নির্বাচন করুন"
                                        required={true}
                                    />
                                </div>
                            </div>

                            <div className="row" style={{ alignItems: 'center' }}>
                                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                                    <label className="form-label bn-text">লিঙ্গ</label>
                                    <CustomSelect
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        options={genderOptions}
                                        placeholder="Select Gender"
                                        required={true}
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1, paddingLeft: '1rem', marginBottom: 0 }}>
                                    <label className="form-label bn-text">পাসওয়ার্ড</label>
                                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="form-input" required minLength="6" />
                                </div>
                            </div>

                            <div className="row" style={{ marginTop: '1.5rem' }}>
                                <div className="form-group checkbox-group" style={{ flex: 1, marginBottom: 0 }}>
                                    <label className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                        <input type="checkbox" name="isEmployed" checked={formData.isEmployed} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                                        <span className="bn-text" style={{ fontWeight: 500 }}>আপনি কি বর্তমানে চাকুরিজীবী?</span>
                                    </label>
                                </div>
                            </div>

                            {formData.isEmployed && (
                                <div className="row employed-fields-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label className="form-label bn-text">প্রতিষ্ঠান / দপ্তর এর নাম</label>
                                        <input
                                            type="text"
                                            name="organization"
                                            value={formData.organization}
                                            onChange={handleChange}
                                            placeholder="প্রতিষ্ঠান / দপ্তর এর নাম লিখুন"
                                            className="form-input bn-text"
                                            required={formData.isEmployed}
                                        />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label className="form-label bn-text">পদবী</label>
                                        <input
                                            type="text"
                                            name="jobTitle"
                                            value={formData.jobTitle}
                                            onChange={handleChange}
                                            placeholder="আপনার পদবী লিখুন"
                                            className="form-input bn-text"
                                            required={formData.isEmployed}
                                        />
                                    </div>
                                </div>
                            )}

                            <div style={{ marginTop: '2.5rem' }}>
                                <button type="submit" className="btn-modern-submit w-full bn-text" style={{ 
                                    width: '100%', 
                                    padding: '1rem', 
                                    background: '#0f172a', 
                                    color: '#fff', 
                                    borderRadius: '12px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '1.1rem'
                                }} disabled={loading || isCheckingAny || hasDuplicateError}>
                                    {loading ? 'সাবমিট হচ্ছে...' : 'নিবন্ধন করুন'}
                                </button>
                            </div>

                        </div>

                        {/* Right Column - Photo Upload */}
                        <div className="photo-column">
                            <div className="form-group">
                                <label className="form-label bn-text" style={{ marginBottom: '1rem' }}>ছবি আপলোড করুন</label>

                                <div className="upload-box" onClick={() => document.getElementById('photo-upload').click()} style={{
                                    border: '2px dashed #cbd5e1',
                                    borderRadius: '16px',
                                    padding: '2rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    background: '#f8fafc',
                                    minHeight: '200px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {preview ? (
                                        <div className="preview-container">
                                            <img src={preview} alt="Preview" className="photo-preview" style={{ maxWidth: '100%', borderRadius: '12px' }} />
                                            <div className="change-photo bn-text" style={{ marginTop: '0.75rem', color: '#3b82f6', fontSize: '0.875rem' }}>ছবি পরিবর্তন করুন</div>
                                        </div>
                                    ) : (
                                        <div className="upload-placeholder" style={{ color: '#64748b' }}>
                                            <Upload size={40} style={{ marginBottom: '1rem', margin: '0 auto' }} />
                                            <p className="bn-text" style={{ fontWeight: 600, marginBottom: '0.25rem' }}>ক্লিক করুন বা টেনে আনুন</p>
                                            <p className="bn-text" style={{ fontSize: '0.8rem' }}>PNG, JPG (সর্বোচ্চ 5MB)</p>
                                        </div>
                                    )}
                                    <input
                                        id="photo-upload"
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={handlePhotoChange}
                                        required
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
}

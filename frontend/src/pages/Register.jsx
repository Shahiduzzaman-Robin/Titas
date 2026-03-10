import { useState } from 'react';
import { Upload } from 'lucide-react';
import axios from 'axios';
import CustomSelect from '../components/CustomSelect';
import { departmentOptions, sessionOptions, hallOptions, bloodGroupOptions, upazilaOptions, genderOptions } from '../constants';
import '../styles/Register.css';


const Register = () => {
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
        password: ''
    });
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
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
                hall: '', gender: '', isEmployed: false, password: ''
            });
            setPhoto(null);
            setPreview(null);
        } catch (err) {
            setMessage(err.response?.data?.msg || 'An error occurred during registration.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="container" style={{ maxWidth: '1000px', paddingTop: '2rem', paddingBottom: '4rem' }}>
                <div className="text-center" style={{ marginBottom: '2.5rem' }}>
                    <h2 className="bn-text" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>শিক্ষার্থী নিবন্ধন ফর্ম</h2>
                    <p className="bn-text text-muted">অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য সতর্কতার সাথে পূরণ করুন</p>
                </div>

                {message && (
                    <div className="alert" style={{ padding: '1rem', marginBottom: '1rem', backgroundColor: message.includes('Success') ? '#dcfce7' : '#fee2e2', borderRadius: '8px', color: message.includes('Success') ? '#166534' : '#991b1b' }}>
                        {message}
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
                                    <input type="text" name="regNo" value={formData.regNo} onChange={handleChange} placeholder="আপনার ঢাবি রেজিস্ট্রেশন নম্বর দিন" className="form-input bn-text" required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label bn-text">নাম (ইংরেজি)</label>
                                <input type="text" name="nameEn" value={formData.nameEn} onChange={handleChange} placeholder="আপনার পূর্ণ নাম ইংরেজিতে লিখুন" className="form-input bn-text" required />
                            </div>

                            <div className="form-group">
                                <label className="form-label bn-text">নাম (বাংলা)</label>
                                <input type="text" name="nameBn" value={formData.nameBn} onChange={handleChange} placeholder="আপনার পূর্ণ নাম বাংলায় লিখুন" className="form-input bn-text" required />
                            </div>

                            <div className="row">
                                <div className="form-group">
                                    <label className="form-label bn-text">মোবাইল নম্বর</label>
                                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="01XXXXXXXXX" className="form-input bn-text" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label bn-text">ইমেইল</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@email.com" className="form-input" required />
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
                                    <label className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input type="checkbox" name="isEmployed" checked={formData.isEmployed} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                                        <span className="bn-text" style={{ fontWeight: 500 }}>আপনি কি বর্তমানে চাকুরিজীবী?</span>
                                    </label>
                                </div>
                            </div>

                            <div style={{ marginTop: '2rem' }}>
                                <button type="submit" className="btn-primary w-full flex-center bn-text" style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.1rem' }} disabled={loading}>
                                    {loading ? 'সাবমিট হচ্ছে...' : 'নিবন্ধন করুন'}
                                </button>
                            </div>

                        </div>

                        {/* Right Column - Photo Upload */}
                        <div className="photo-column">
                            <div className="form-group">
                                <label className="form-label bn-text" style={{ marginBottom: '1rem' }}>ছবি আপলোড করুন</label>

                                <div className="upload-box" onClick={() => document.getElementById('photo-upload').click()}>
                                    {preview ? (
                                        <div className="preview-container">
                                            <img src={preview} alt="Preview" className="photo-preview" />
                                            <div className="change-photo bn-text">ছবি পরিবর্তন করুন</div>
                                        </div>
                                    ) : (
                                        <div className="upload-placeholder flex-center" style={{ flexDirection: 'column', color: 'var(--text-muted)' }}>
                                            <Upload size={32} style={{ marginBottom: '1rem' }} />
                                            <p className="bn-text" style={{ fontWeight: 500, marginBottom: '0.25rem' }}>ক্লিক করুন বা টেনে আনুন</p>
                                            <p className="bn-text" style={{ fontSize: '0.8rem' }}>PNG, JPG (সর্বোচ্চ 5MB)</p>
                                        </div>
                                    )}
                                    <input
                                        id="photo-upload"
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={handlePhotoChange}
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
};

export default Register;

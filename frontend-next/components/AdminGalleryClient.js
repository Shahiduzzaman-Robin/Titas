'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, X, AlertCircle, Camera } from 'lucide-react';
import AdminNavbar from './AdminNavbar';
import '../styles/Admin.css';
import '../styles/AdminNotices.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function AdminGalleryClient() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({ title: '', caption: '', category: 'Event' });

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/api/gallery`);
            if (res.data.success) setImages(res.data.data);
        } catch (error) { console.error('Failed to fetch gallery:', error); }
        finally { setLoading(false); }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) return alert('Please select an image');
        try {
            const token = localStorage.getItem('admin_token');
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            data.append('image', selectedFile);
            await axios.post(`${API_BASE_URL}/api/gallery`, data, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            fetchImages();
            setShowModal(false);
        } catch (error) { console.error('Upload error:', error); alert('Failed to upload image.'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this image?')) return;
        try {
            const token = localStorage.getItem('admin_token');
            await axios.delete(`${API_BASE_URL}/api/gallery/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchImages();
        } catch (error) { console.error('Delete error:', error); }
    };

    return (
        <div className="admin-layout">
            <AdminNavbar active="gallery" />
            <div className="admin-notices-content">
                <div className="notices-header">
                    <div className="header-info">
                        <h2 className="bn-text">ফটো গ্যালারি ম্যানেজমেন্ট</h2>
                        <p className="en-text text-muted">Manage the photo gallery section</p>
                    </div>
                    <button className="btn-modern-primary" onClick={() => { setFormData({ title: '', caption: '', category: 'Event' }); setSelectedFile(null); setImagePreview(null); setShowModal(true); }}>
                        <Plus size={18} /> Add Photo
                    </button>
                </div>

                {loading ? (
                    <div className="loading-state">Loading gallery...</div>
                ) : images.length === 0 ? (
                    <div className="empty-state">
                        <AlertCircle size={48} className="text-muted" style={{ opacity: 0.3 }} />
                        <h4 className="bn-text mt-4">গ্যালারিতে কোনো ছবি নেই</h4>
                    </div>
                ) : (
                    <div className="gallery-admin-grid">
                        {images.map(img => (
                            <div key={img._id} className="gallery-admin-card glass-panel">
                                <div className="card-image">
                                    <img src={`${API_BASE_URL}${img.imageUrl}`} alt={img.title} />
                                    <button className="delete-overlay" onClick={() => handleDelete(img._id)}><Trash2 size={20} /></button>
                                </div>
                                <div className="card-info">
                                    <div className="bn-text font-bold text-sm mb-1">{img.title}</div>
                                    <div className="en-text text-muted text-xs">{img.category}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel">
                        <div className="modal-header">
                            <h3 className="bn-text">নতুন ছবি আপলোড</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="notice-form">
                            <div className="form-group" style={{ alignItems: 'center' }}>
                                <div className="gallery-upload-zone" onClick={() => document.getElementById('gallery-file').click()}>
                                    {imagePreview ? <img src={imagePreview} alt="Preview" className="preview-img-full" /> : <div className="upload-placeholder"><Camera size={40} /><span>Click to select image</span></div>}
                                    <input type="file" id="gallery-file" style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
                                </div>
                            </div>
                            <div className="form-group"><label className="bn-text">ছবির শিরোনাম *</label><input type="text" name="title" required className="modal-input bn-text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} /></div>
                            <div className="form-group"><label className="bn-text">ক্যাপশন (সংক্ষিপ্ত)</label><input type="text" name="caption" className="modal-input bn-text" value={formData.caption} onChange={e => setFormData({ ...formData, caption: e.target.value })} /></div>
                            <div className="form-group"><label className="en-text">Category</label><select name="category" className="modal-input en-text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}><option value="Event">Event</option><option value="Campus">Campus</option><option value="Alumni">Alumni</option><option value="Other">Other</option></select></div>
                            <div className="modal-actions"><button type="button" className="btn-modern-secondary" onClick={() => setShowModal(false)}>Cancel</button><button type="submit" className="btn-modern-submit">Upload Photo</button></div>
                        </form>
                    </div>
                </div>
            )}
            <style jsx>{`
                .gallery-admin-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem; padding: 1rem 0; }
                .gallery-admin-card { overflow: hidden; border-radius: 12px; transition: transform 0.2s; border: 1px solid rgba(0,0,0,0.05); background: #fff; }
                .gallery-admin-card:hover { transform: translateY(-5px); }
                .card-image { position: relative; aspect-ratio: 4/3; background: #f1f5f9; }
                .card-image img { width: 100%; height: 100%; object-fit: cover; }
                .delete-overlay { position: absolute; top: 8px; right: 8px; background: rgba(220, 38, 38, 0.8); color: white; border: none; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; opacity: 0; transition: opacity 0.2s; }
                .gallery-admin-card:hover .delete-overlay { opacity: 1; }
                .card-info { padding: 0.8rem; }
                .gallery-upload-zone { width: 100%; height: 200px; border: 2px dashed #cbd5e1; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden; background: #f8fafc; }
                .preview-img-full { width: 100%; height: 100%; object-fit: contain; background: #000; }
            `}</style>
        </div>
    );
}

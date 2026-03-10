import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import axios from 'axios';
import logo from '../assets/logo.png';
import { API_BASE_URL } from '../constants';

export const AdminNavbar = ({ active }) => {
    const navigate = useNavigate();
    const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');
    const [pendingCount, setPendingCount] = useState(0);
    const [unreadMessages, setUnreadMessages] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            axios.get('http://localhost:5002/api/admin/pending-edits-count', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setPendingCount(res.data.count))
                .catch(err => console.error('Failed to fetch pending count:', err));

            axios.get(`${API_BASE_URL}/api/contact/unread`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setUnreadMessages(res.data.count))
                .catch(err => console.error('Failed to fetch unread messages count:', err));
        }
    }, [active]);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        navigate('/login');
    };

    return (
        <nav className="admin-navbar">
            <div className="admin-nav-logo">
                <div>
                    <h1 className="bn-text">তিতাস - অ্যাডমিন প্যানেল</h1>
                    <p>ADMINISTRATOR</p>
                </div>
            </div>
            <div className="admin-nav-links">
                <Link to="/admin/dashboard" className={`admin-nav-link bn-text ${active === 'dashboard' ? 'active' : ''}`}>ড্যাশবোর্ড</Link>
                <Link to="/admin/students" className={`admin-nav-link bn-text ${active === 'students' ? 'active' : ''}`}>শিক্ষার্থী</Link>
                <Link to="/admin/edits" className={`admin-nav-link bn-text ${active === 'edits' ? 'active' : ''}`} style={{ position: 'relative' }}>
                    অপেক্ষমাণ সম্পাদনা
                    {pendingCount > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-15px',
                            background: '#ef4444',
                            color: 'white',
                            fontSize: '0.65rem',
                            fontWeight: 'bold',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}>
                            {pendingCount}
                        </span>
                    )}
                </Link>
                <Link to="/admin/blog" className={`admin-nav-link bn-text ${active === 'blog' ? 'active' : ''}`}>ব্লগ ম্যানেজমেন্ট</Link>
                <Link to="/admin/messages" className={`admin-nav-link bn-text ${active === 'messages' ? 'active' : ''}`} style={{ position: 'relative' }}>
                    বার্তাসমূহ
                    {unreadMessages > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-15px',
                            background: '#ef4444',
                            color: 'white',
                            fontSize: '0.65rem',
                            fontWeight: 'bold',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}>
                            {unreadMessages}
                        </span>
                    )}
                </Link>
                <Link to="/admin/notices" className={`admin-nav-link bn-text ${active === 'notices' ? 'active' : ''}`}>নোটিস বোর্ড</Link>
                <Link to="/admin/gallery" className={`admin-nav-link bn-text ${active === 'gallery' ? 'active' : ''}`}>গ্যালারি</Link>
                <Link to="/admin/events" className={`admin-nav-link bn-text ${active === 'events' ? 'active' : ''}`}>ইভেন্ট</Link>
            </div>
            <div className="admin-nav-right">
                <button className="admin-lang-btn"><Globe size={14} /> EN</button>
                <div className="admin-nav-user">
                    <div className="admin-avatar">👤</div>
                    <div className="admin-user-info">
                        <div className="name">{(adminUser.username || 'TITAS').toUpperCase()}</div>
                        <div className="email">login@titasdu.com</div>
                    </div>
                    <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.75rem', marginLeft: '0.5rem' }}>লগআউট</button>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;

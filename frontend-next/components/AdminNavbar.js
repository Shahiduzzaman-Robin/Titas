'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Globe, Settings, LogOut, User } from 'lucide-react';
import axios from 'axios';
import '../styles/Admin.css';

const LOGO_PATH = '/assets/logo.png';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function AdminNavbar({ active }) {
    const router = useRouter();
    const pathname = usePathname();
    const [adminUser, setAdminUser] = useState(null);
    const [adminToken, setAdminToken] = useState(null);
    const [pendingCount, setPendingCount] = useState(0);
    const [unreadMessages, setUnreadMessages] = useState(0);

    const isContentAdmin = adminUser?.role === 'Content Admin';

    useEffect(() => {
        const userStr = localStorage.getItem('admin_user');
        const token = localStorage.getItem('admin_token');
        
        if (userStr) setAdminUser(JSON.parse(userStr));
        if (token) setAdminToken(token);

        if (token && userStr) {
            const user = JSON.parse(userStr);
            if (user.role !== 'Content Admin') {
                // Fetch counts if not content admin
                axios.get(`${API_BASE_URL}/api/admin/pending-edits-count`, {
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
        }
    }, [active]);

    const handleLogout = async () => {
        try {
            if (adminToken) {
                await axios.post(`${API_BASE_URL}/api/admin/logout`, {}, {
                    headers: { Authorization: `Bearer ${adminToken}` }
                });
            }
        } catch (error) {
            console.error('Failed to log admin logout:', error);
        } finally {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            router.push('/login');
        }
    };

    const navLinks = [
        { href: '/admin/dashboard', label: 'ড্যাশবোর্ড', id: 'dashboard', hideForContentAdmin: true },
        { href: '/admin/students', label: 'শিক্ষার্থী', id: 'students', hideForContentAdmin: true },
        { 
            href: '/admin/edits', 
            label: 'অপেক্ষমাণ সম্পাদনা', 
            id: 'edits', 
            hideForContentAdmin: true,
            badge: pendingCount > 0 ? pendingCount : null
        },
        { href: '/admin/blog', label: 'ব্লগ ম্যানেজমেন্ট', id: 'blog' },
        { 
            href: '/admin/messages', 
            label: 'বার্তাসমূহ', 
            id: 'messages', 
            hideForContentAdmin: true,
            badge: unreadMessages > 0 ? unreadMessages : null
        },
        { href: '/admin/notices', label: 'নোটিস বোর্ড', id: 'notices' },
        { href: '/admin/gallery', label: 'গ্যালারি', id: 'gallery' },
        { href: '/admin/events', label: 'ইভেন্ট', id: 'events' },
        { href: '/admin/notifications', label: 'ইমেইল নোটিফিকেশন', id: 'notifications', hideForContentAdmin: true },
        { href: '/admin/audit-logs', label: 'অডিট লগস', id: 'audit-logs', hideForContentAdmin: true },
    ];

    return (
        <nav className="admin-navbar">
            <div className="admin-nav-logo">
                <div>
                    <h1 className="bn-text">তিতাস - অ্যাডমিন প্যানেল</h1>
                    <p>{isContentAdmin ? 'CONTENT ADMIN' : 'ADMINISTRATOR'}</p>
                </div>
            </div>
            <div className="admin-nav-links">
                {navLinks.filter(link => !link.hideForContentAdmin || !isContentAdmin).map(link => (
                    <Link 
                        key={link.id} 
                        href={link.href} 
                        className={`admin-nav-link bn-text ${active === link.id ? 'active' : ''}`}
                        style={{ position: 'relative' }}
                    >
                        {link.label}
                        {link.badge && (
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
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                zIndex: 10
                            }}>
                                {link.badge}
                            </span>
                        )}
                    </Link>
                ))}
            </div>
            <div className="admin-nav-right">
                <button className="admin-lang-btn"><Globe size={14} /> EN</button>
                <div className="admin-nav-user">
                    <Link href="/admin/settings" style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', marginRight: '0.5rem' }} title="সেটিংস">
                        <Settings size={18} />
                    </Link>
                    <div className="admin-avatar">👤</div>
                    <div className="admin-user-info">
                        <div className="name">{(adminUser?.username || 'TITAS').toUpperCase()}</div>
                        <div className="email">login@titasdu.com</div>
                    </div>
                    <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.75rem', marginLeft: '0.5rem' }}>লগআউট</button>
                </div>
            </div>
        </nav>
    );
}

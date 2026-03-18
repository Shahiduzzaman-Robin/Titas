'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Globe, User, LogOut, Menu, X } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import '../styles/Navbar.css';

// Note: In Next.js, images in public/ are accessed via absolute paths
const LOGO_PATH = '/assets/logo.png';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const Navbar = ({ compact = false }) => {
    const pathname = usePathname();
    const router = useRouter();
    const isBlogPath = pathname === '/blog' || pathname.startsWith('/blog/');
    const isHome = pathname === '/';

    const [user, setUser] = useState(null);
    const [adminUser, setAdminUser] = useState(null);
    const [adminToken, setAdminToken] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Safe access to localStorage in Client Components
        const userStr = localStorage.getItem('titas_user');
        if (userStr) setUser(JSON.parse(userStr));

        const adminUserStr = localStorage.getItem('admin_user');
        if (adminUserStr) setAdminUser(JSON.parse(adminUserStr));

        setAdminToken(localStorage.getItem('admin_token'));

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isAdminAuthenticated = Boolean(adminToken);
    const adminRole = adminUser?.role || 'Admin';
    const adminLandingPath = adminRole === 'Content Admin' ? '/admin/blog' : '/admin/dashboard';

    const handleLogout = () => {
        localStorage.removeItem('titas_token');
        localStorage.removeItem('titas_user');
        setUser(null);
        setIsDropdownOpen(false);
        router.push('/login');
    };

    const handleAdminLogout = async () => {
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
            setAdminUser(null);
            setAdminToken(null);
            setIsDropdownOpen(false);
            router.push('/login');
        }
    };

    return (
        <nav className={`navbar ${compact ? 'navbar-compact' : ''}`}>
            <div className="container flex-between nav-content">
                <Link href="/" className="logo-group">
                    <Image 
                        src={LOGO_PATH} 
                        alt="Titas Logo" 
                        className="logo-img" 
                        width={48} 
                        height={48}
                        priority
                    />
                    <div className="logo-text">
                        <h1 className="bn-text">তিতাস</h1>
                        {!compact && (
                            <p className="bn-text subtitle">ঢাকা বিশ্ববিদ্যালয়স্থ ব্রাহ্মণবাড়িয়া জেলা ছাত্রকল্যাণ পরিষদ</p>
                        )}
                    </div>
                </Link>

                <div className={`nav-actions ${isMenuOpen ? 'menu-open' : ''}`}>
                    <div className="nav-links-capsule">
                        <Link href="/" className={`nav-link bn-text ${isHome ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>হোম</Link>
                        <Link href="/register" className={`nav-link bn-text ${pathname === '/register' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>নিবন্ধন</Link>
                        <Link href="/students" className={`nav-link bn-text ${pathname === '/students' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>শিক্ষার্থী</Link>
                        <Link href="/contact" className={`nav-link bn-text ${pathname === '/contact' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>যোগাযোগ</Link>
                        <Link href="/blog" className={`nav-link bn-text ${isBlogPath ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>ব্লগ</Link>
                        <Link href="/about" className={`nav-link bn-text ${pathname === '/about' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>আমাদের সম্পর্কে</Link>
                    </div>

                    <div className="nav-buttons">
                        <button className="btn-outline lang-btn">
                            <Globe size={16} />
                            <span>EN</span>
                        </button>
                        {isAdminAuthenticated ? (
                            <div className="user-menu-wrapper" ref={dropdownRef}>
                                <button className="btn-profile-capsule" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                    <User size={16} />
                                    <span>{adminUser?.username || 'ADMIN'}</span>
                                </button>
                                {isDropdownOpen && (
                                    <div className="user-dropdown">
                                        <div className="dropdown-header">
                                            <div className="user-info">
                                                <div className="user-name">{(adminUser?.username || 'ADMIN').toUpperCase()}</div>
                                                <div className="user-email">Admin Session</div>
                                            </div>
                                        </div>
                                        <ul className="dropdown-list">
                                            <li>
                                                <Link href={adminLandingPath} onClick={() => setIsDropdownOpen(false)}>
                                                    <User size={16} />
                                                    <span>Admin Dashboard</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <button onClick={handleAdminLogout} className="logout-btn">
                                                    <LogOut size={16} />
                                                    <span>লগআউট</span>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : user ? (
                            <div className="user-menu-wrapper" ref={dropdownRef}>
                                <button className="btn-profile-capsule" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                    <User size={16} />
                                    <span>{user.nameEn}</span>
                                </button>
                                {isDropdownOpen && (
                                    <div className="user-dropdown">
                                        <div className="dropdown-header">
                                            <div className="user-info">
                                                <div className="user-name">{user.nameEn}</div>
                                                <div className="user-email">{user.email}</div>
                                            </div>
                                        </div>
                                        <ul className="dropdown-list">
                                            <li>
                                                <Link href="/profile" onClick={() => setIsDropdownOpen(false)}>
                                                    <User size={16} />
                                                    <span>আমার অ্যাকাউন্ট</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <button onClick={handleLogout} className="logout-btn">
                                                    <LogOut size={16} />
                                                    <span>লগআউট</span>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className="btn-outline login-btn bn-text">
                                <User size={18} />
                                <span>লগইন</span>
                            </Link>
                        )}
                    </div>
                </div>

                <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

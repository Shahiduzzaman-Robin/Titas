import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe, User, LogOut } from 'lucide-react';
import logo from '../assets/logo.png';
import '../styles/Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isBlogPath = location.pathname === '/blog' || location.pathname.startsWith('/blog/');
    const isHome = location.pathname === '/';

    const userStr = localStorage.getItem('titas_user');
    const user = userStr ? JSON.parse(userStr) : null;
    const adminUserStr = localStorage.getItem('admin_user');
    const adminUser = adminUserStr ? JSON.parse(adminUserStr) : null;
    const adminToken = localStorage.getItem('admin_token');
    const isAdminAuthenticated = Boolean(adminToken);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('titas_token');
        localStorage.removeItem('titas_user');
        setIsDropdownOpen(false);
        navigate('/login');
    };

    const handleAdminLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setIsDropdownOpen(false);
        navigate('/login');
    };

    const scrollToSection = (e, sectionId) => {
        if (!isHome) return; // Allow natural navigation if not on Home
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="navbar">
            <div className="container flex-between nav-content">
                <Link to="/" className="logo-group">
                    <img src={logo} alt="Titas Logo" className="logo-img" />
                    <div className="logo-text">
                        <h1 className="bn-text">তিতাস</h1>
                        <p className="bn-text subtitle">ঢাকা বিশ্ববিদ্যালয়স্থ ব্রাহ্মণবাড়িয়া জেলা ছাত্রকল্যাণ পরিষদ</p>
                    </div>
                </Link>

                <div className="nav-actions">
                    <div className="nav-links-capsule">
                        <Link to="/" className={`nav-link bn-text ${isHome ? 'active' : ''}`}>হোম</Link>
                        <Link to="/register" className={`nav-link bn-text ${location.pathname === '/register' ? 'active' : ''}`}>নিবন্ধন</Link>
                        <Link to="/students" className={`nav-link bn-text ${location.pathname === '/students' ? 'active' : ''}`}>শিক্ষার্থী</Link>
                        {isHome ? (
                            <>
                                <a href="#events" onClick={(e) => scrollToSection(e, 'events')} className="nav-link bn-text">ইভেন্ট</a>
                                <a href="#gallery" onClick={(e) => scrollToSection(e, 'gallery')} className="nav-link bn-text">গ্যালারি</a>
                                <Link to="/contact" className={`nav-link bn-text ${location.pathname === '/contact' ? 'active' : ''}`}>যোগাযোগ</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/#events" className="nav-link bn-text">ইভেন্ট</Link>
                                <Link to="/#gallery" className="nav-link bn-text">গ্যালারি</Link>
                                <Link to="/contact" className={`nav-link bn-text ${location.pathname === '/contact' ? 'active' : ''}`}>যোগাযোগ</Link>
                            </>
                        )}
                        <Link to="/blog" className={`nav-link bn-text ${isBlogPath ? 'active' : ''}`}>ব্লগ</Link>
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
                                                <Link to="/admin/dashboard" onClick={() => setIsDropdownOpen(false)}>
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
                                                <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>
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
                            <Link to="/login" className="btn-outline login-btn bn-text">
                                <User size={18} />
                                <span>লগইন</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

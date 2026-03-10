import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Youtube, Globe, GraduationCap } from 'lucide-react';
import '../styles/Footer.css';
import logo from '../assets/logo.png';

const Footer = () => {
    return (
        <footer className="footer-modern">
            <div className="container">
                <div className="footer-top">

                    {/* Brand Info */}
                    <div className="footer-brand">
                        <img src={logo} alt="Titas (DU) Logo" className="footer-logo" />
                        <h3 className="bn-text text-white font-bold text-xl mt-2">তিতাস (ঢাবি)</h3>
                        <p className="footer-desc bn-text">
                            ঢাকা বিশ্ববিদ্যালয়ে অধ্যয়নরত ব্রাহ্মণবাড়িয়া জেলার শিক্ষার্থীদের মেধা, মনন ও ঐক্যের প্রতীক।
                        </p>
                        <div className="footer-socials">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                <Facebook size={20} />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                <Youtube size={20} />
                            </a>
                            <a href="https://du.ac.bd" target="_blank" rel="noopener noreferrer" className="social-link">
                                <Globe size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="footer-heading bn-text">গুরুত্বপূর্ণ লিংক</h4>
                        <ul className="footer-links bn-text">
                            <li><Link to="/register">সদস্য রেজিস্ট্রেশন</Link></li>
                            <li><Link to="/students">সদস্য তালিকা</Link></li>
                            <li><Link to="/blog">আমাদের ব্লগ</Link></li>
                            <li><Link to="/contact">যোগাযোগ করুন</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="footer-heading bn-text">যোগাযোগের ঠিকানা</h4>
                        <ul className="footer-contact bn-text">
                            <li>
                                <MapPin size={20} className="footer-contact-icon" />
                                <span>টিএসসি (শিক্ষক-ছাত্র কেন্দ্র),<br />ঢাকা বিশ্ববিদ্যালয়, ঢাকা-১০০০</span>
                            </li>
                            <li>
                                <Phone size={20} className="footer-contact-icon" />
                                <span className="en-text">+880 1700-000000</span>
                            </li>
                            <li>
                                <Mail size={20} className="footer-contact-icon" />
                                <span className="en-text">contact@titasdu.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="footer-bottom">
                    <p className="en-text">
                        &copy; {new Date().getFullYear()} Titas (DU). All rights reserved.
                    </p>
                    <p className="dev-credit en-text">
                        Developed with ❤️ by <a href="https://github.com" target="_blank" rel="noopener noreferrer">Titas IT Team</a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

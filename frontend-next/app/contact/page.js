import { MapPin, Phone, Mail, Clock, Globe } from 'lucide-react';
import ContactForm from '../../components/ContactForm';
import '../../styles/Contact.css';

export const metadata = {
    title: 'যোগাযোগ | Titas - Dhaka University',
    description: 'তিতাস পরিবারের যেকোনো প্রয়োজনে নির্দ্বিধায় আমাদের সাথে যোগাযোগ করুন। আমাদের ঠিকানা: টিএসসি, ঢাকা বিশ্ববিদ্যালয়।',
};

export default function ContactPage() {
    return (
        <div className="contact-page-modern">
            {/* HERO SECTION */}
            <section className="contact-hero">
                <div className="contact-overlay"></div>
                <img
                    src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=2000&q=80"
                    alt="Contact Titas"
                    className="contact-bg-img"
                />

                <div className="container contact-hero-content">
                    <div className="contact-badge glass-panel-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.5rem 1rem', borderRadius: '999px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', marginBottom: '1.5rem' }}>
                        <Globe size={16} />
                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Let&apos;s Connect</span>
                    </div>

                    <h1 className="contact-title bn-text" style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '1.5rem' }}>
                        যেকোনো প্রয়োজনে <br />
                        <span className="text-gradient" style={{ background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>যোগাযোগ করুন</span>
                    </h1>

                    <p className="contact-subtitle bn-text" style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', lineHeight: 1.6 }}>
                        আমরা আপনার মতামত, পরামর্শ বা অভিযোগ শুনতে প্রস্তুত। তিতাস পরিবারের যেকোনো প্রয়োজনে নির্দ্বিধায় আমাদের সাথে যোগাযোগ করুন।
                    </p>
                </div>
            </section>

            {/* MAIN CONTENT SECTION */}
            <section className="contact-main" style={{ padding: '5rem 0' }}>
                <div className="container">
                    <div className="contact-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem' }}>

                        {/* LEFT PANE: Contact Information */}
                        <div className="contact-info-panel">
                            <h2 className="bn-text" style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>আমাদের ঠিকানা</h2>
                            <p className="text-muted bn-text" style={{ color: '#64748b', marginBottom: '2.5rem' }}>ঢাকা বিশ্ববিদ্যালয়স্থ ব্রাহ্মণবাড়িয়া জেলার ছাত্র-ছাত্রীদের কল্যাণে আমরা সবসময় অঙ্গীকারবদ্ধ।</p>

                            <div className="info-cards" style={{ display: 'grid', gap: '1.5rem' }}>
                                <div className="info-card glass-panel" style={{ display: 'flex', gap: '1.25rem', padding: '1.5rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                    <div className="icon-wrap bg-blue-light" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <MapPin style={{ color: '#3b82f6' }} />
                                    </div>
                                    <div>
                                        <h4 className="bn-text" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>অফিস</h4>
                                        <p className="bn-text text-muted" style={{ fontSize: '0.875rem', color: '#64748b' }}>টিএসসি, ঢাকা বিশ্ববিদ্যালয়, ঢাকা-১০০০</p>
                                    </div>
                                </div>

                                <div className="info-card glass-panel" style={{ display: 'flex', gap: '1.25rem', padding: '1.5rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                    <div className="icon-wrap bg-green-light" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Phone style={{ color: '#22c55e' }} />
                                    </div>
                                    <div>
                                        <h4 className="bn-text" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>হটলাইন</h4>
                                        <p className="en-text text-muted" style={{ fontSize: '0.875rem', color: '#64748b' }}>+88 015 2126 1069</p>
                                    </div>
                                </div>

                                <div className="info-card glass-panel" style={{ display: 'flex', gap: '1.25rem', padding: '1.5rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                    <div className="icon-wrap bg-purple-light" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Mail style={{ color: '#8b5cf6' }} />
                                    </div>
                                    <div>
                                        <h4 className="bn-text" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>ইমেইল</h4>
                                        <p className="en-text text-muted" style={{ fontSize: '0.875rem', color: '#64748b' }}>rakibulhasan.du7480@gmail.com</p>
                                    </div>
                                </div>

                                <div className="info-card glass-panel" style={{ display: 'flex', gap: '1.25rem', padding: '1.5rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                    <div className="icon-wrap bg-orange-light" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Clock style={{ color: '#f97316' }} />
                                    </div>
                                    <div>
                                        <h4 className="bn-text" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>অফিস সময়</h4>
                                        <p className="bn-text text-muted" style={{ fontSize: '0.875rem', color: '#64748b' }}>রবিবার - বৃহস্পতিবার: সকাল ১০টা - বিকাল ৫টা</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT PANE: The Reusable Form Component */}
                        <div className="contact-form-wrapper">
                            <ContactForm />
                        </div>

                    </div>
                </div>
            </section>

            {/* MAP SECTION */}
            <section className="contact-map">
                <div className="map-placeholder">
                    <iframe
                        title="Titas Location Map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.5414800366624!2d90.39294277632616!3d23.728091192953293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8e90a449e4f%3A0xb7092a9c25197fa4!2sTeacher-Student%20Centre%20(TSC)!5e0!3m2!1sen!2sbd!4v1715016254013!5m2!1sen!2sbd"
                        width="100%"
                        height="450"
                        style={{ border: 0, display: 'block' }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </section>
        </div>
    );
}

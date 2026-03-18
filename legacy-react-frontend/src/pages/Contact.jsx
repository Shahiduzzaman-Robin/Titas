import { MapPin, Phone, Mail, Clock, Globe } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import '../styles/Contact.css';

const Contact = () => {
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
                    <div className="contact-badge glass-panel-dark">
                        <Globe size={16} />
                        <span>Let's Connect</span>
                    </div>

                    <h1 className="contact-title bn-text">
                        যেকোনো প্রয়োজনে <br />
                        <span className="text-gradient">যোগাযোগ করুন</span>
                    </h1>

                    <p className="contact-subtitle bn-text">
                        আমরা আপনার মতামত, পরামর্শ বা অভিযোগ শুনতে প্রস্তুত। তিতাস পরিবারের যেকোনো প্রয়োজনে নির্দ্বিধায় আমাদের সাথে যোগাযোগ করুন।
                    </p>
                </div>
            </section>

            {/* MAIN CONTENT SECTION */}
            <section className="contact-main">
                <div className="container">
                    <div className="contact-layout">

                        {/* LEFT PANE: Contact Information */}
                        <div className="contact-info-panel">
                            <h2 className="bn-text mb-4">আমাদের ঠিকানা</h2>
                            <p className="text-muted bn-text mb-8">ঢাকা বিশ্ববিদ্যালয়স্থ ব্রাহ্মণবাড়িয়া জেলার ছাত্র-ছাত্রীদের কল্যাণে আমরা সবসময় অঙ্গীকারবদ্ধ।</p>

                            <div className="info-cards">
                                <div className="info-card glass-panel">
                                    <div className="icon-wrap bg-blue-light">
                                        <MapPin className="text-blue-primary" />
                                    </div>
                                    <div>
                                        <h4 className="bn-text">অফিস</h4>
                                        <p className="bn-text text-muted">টিএসসি, ঢাকা বিশ্ববিদ্যালয়, ঢাকা-১০০০</p>
                                    </div>
                                </div>

                                <div className="info-card glass-panel">
                                    <div className="icon-wrap bg-green-light">
                                        <Phone className="text-green-primary" />
                                    </div>
                                    <div>
                                        <h4 className="bn-text">হটলাইন</h4>
                                        <p className="en-text text-muted">+88 015 2126 1069</p>
                                    </div>
                                </div>

                                <div className="info-card glass-panel">
                                    <div className="icon-wrap bg-purple-light">
                                        <Mail className="text-purple-primary" />
                                    </div>
                                    <div>
                                        <h4 className="bn-text">ইমেইল</h4>
                                        <p className="en-text text-muted">rakibulhasan.du7480@gmail.com</p>
                                    </div>
                                </div>

                                <div className="info-card glass-panel">
                                    <div className="icon-wrap bg-orange-light">
                                        <Clock className="text-orange-primary" />
                                    </div>
                                    <div>
                                        <h4 className="bn-text">অফিস সময়</h4>
                                        <p className="bn-text text-muted">রবিবার - বৃহস্পতিবার: সকাল ১০টা - বিকাল ৫টা</p>
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

            {/* MAP SECTION PLACEHOLDER */}
            <section className="contact-map">
                <div className="map-placeholder">
                    {/* Embedded Google Map iframe goes here for TSC, Dhaka University */}
                    <iframe
                        title="Titas Location Map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.5414800366624!2d90.39294277632616!3d23.728091192953293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8e90a449e4f%3A0xb7092a9c25197fa4!2sTeacher-Student%20Centre%20(TSC)!5e0!3m2!1sen!2sbd!4v1715016254013!5m2!1sen!2sbd"
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </section>
        </div>
    );
};

export default Contact;

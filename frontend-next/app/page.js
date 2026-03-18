'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserPlus, Calendar, ArrowRight, BookOpen, Users, MapPin, Award, ExternalLink, AlertCircle, Quote, X } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import TrainAnimation from '../components/TrainAnimation';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

// Static assets accessed via public/ directory
const HERO_BG = '/assets/hero/Fruit_Fest.jpg';
const ABOUT_US_BG = '/assets/aboutus.jpg';
const PRESIDENT_PHOTO = '/assets/president.png';
const GS_PHOTO = '/assets/gs.png';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Import CSS
import '../styles/Home.css';

export default function Home() {
    const [latestPosts, setLatestPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [notices, setNotices] = useState([]);
    const [events, setEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [gallery, setGallery] = useState([]);
    const [loadingGallery, setLoadingGallery] = useState(true);
    const [studentProfile, setStudentProfile] = useState(null);

    const [rsvpModalOpen, setRsvpModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
    const [rsvpMessage, setRsvpMessage] = useState({ type: '', text: '' });
    const [rsvpForm, setRsvpForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        department: '',
        session: '',
    });

    // Static leadership data
    const leaders = [
        {
            name: 'রাইয়ান কবির ঐশী',
            nameEn: 'Raiyan Kabir Oishi',
            role: 'সভাপতি',
            department: 'সমাজবিজ্ঞান বিভাগ',
            session: '২০১৯-২০২০',
            photo: PRESIDENT_PHOTO,
            message: 'তিতাস এমন একটি প্রাঙ্গণ যেখানে মেধা, মনন এবং ভ্রাতৃত্ববোধ একই সুতোয় গাঁথা। আমাদের এই পরিবার ঢাকা বিশ্ববিদ্যালয়ে অধ্যয়নরত ব্রাহ্মণবাড়িয়ার সকল শিক্ষার্থীর কল্যাণে কাজ করে যাচ্ছে।',
        },
        {
            name: 'রিফতি-আল-জাবেদ',
            nameEn: 'Rifty Al Zabed',
            role: 'সাধারণ সম্পাদক',
            department: 'কমিউনিকেশন ডিজঅর্ডারস বিভাগ',
            session: '২০২০-২০২১',
            photo: GS_PHOTO,
            message: 'তিতাস শুধু একটি নাম নয়, এটি আমাদের আবেগ, ভালোবাসা এবং ঐক্যের প্রতীক। আসুন কাঁধে কাঁধ মিলিয়ে ব্রাহ্মণবাড়িয়ার মুখ উজ্জ্বল করি পৃথিবীর সবখানে।',
        },
    ];

    const normalizeRegistrationText = (text) => String(text || '').replace(/\bRSVP\b/gi, 'Registration');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/blog/posts?limit=3`);
                setLatestPosts(res.data.posts || []);
            } catch (err) {
                console.error('Failed to fetch latest posts', err);
            } finally {
                setLoadingPosts(false);
            }
        };

        const fetchNotices = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/notices`);
                if (res.data.success) {
                    setNotices(res.data.data);
                }
            } catch (err) {
                console.error("Error fetching notices:", err);
            }
        };

        const fetchEvents = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/events`);
                if (res.data.success) {
                    setEvents(res.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch events', err);
            } finally {
                setLoadingEvents(false);
            }
        };

        const fetchGallery = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/gallery`);
                if (res.data.success) {
                    setGallery(res.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch gallery', err);
            } finally {
                setLoadingGallery(false);
            }
        };

        const fetchStudentProfile = async () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('titas_token') : null;
            if (!token) return;
            try {
                const res = await axios.get(`${API_BASE_URL}/api/students/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStudentProfile(res.data || null);
            } catch (err) {
                setStudentProfile(null);
            }
        };

        fetchPosts();
        fetchNotices();
        fetchEvents();
        fetchGallery();
        fetchStudentProfile();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    const openRsvpModal = (eventItem) => {
        setSelectedEvent(eventItem);
        setRsvpMessage({ type: '', text: '' });
        setRsvpForm({
            fullName: studentProfile?.nameBn || studentProfile?.nameEn || '',
            email: studentProfile?.email || '',
            phone: studentProfile?.mobile || '',
            department: studentProfile?.department || '',
            session: studentProfile?.session || '',
        });
        setRsvpModalOpen(true);
    };

    const handleRsvpSubmit = async (e) => {
        e.preventDefault();
        if (!selectedEvent?._id) return;
        if (!studentProfile) {
            setRsvpMessage({ type: 'error', text: 'রেজিস্টার করতে আগে ছাত্র অ্যাকাউন্টে লগইন করুন।' });
            return;
        }

        setRsvpSubmitting(true);
        setRsvpMessage({ type: '', text: '' });
        try {
            const token = localStorage.getItem('titas_token');
            const config = token
                ? { headers: { Authorization: `Bearer ${token}` } }
                : undefined;
            const { data } = await axios.post(
                `${API_BASE_URL}/api/events/${selectedEvent._id}/rsvp`,
                { ...rsvpForm, response: 'going' },
                config
            );
            setRsvpMessage({
                type: 'success',
                text: normalizeRegistrationText(data.message || 'Registration submitted successfully.'),
            });
            setEvents((prev) => prev.map((item) => (
                item._id === selectedEvent._id
                    ? {
                        ...item,
                        rsvpSummary: data?.data?.summary || item.rsvpSummary,
                    }
                    : item
            )));
        } catch (err) {
            setRsvpMessage({
                type: 'error',
                text: normalizeRegistrationText(err?.response?.data?.message || 'Unable to submit registration right now.'),
            });
        } finally {
            setRsvpSubmitting(false);
        }
    };

    return (
        <div className="home-page-modern">

            {/* 1. HERO SECTION */}
            <section className="hero-modern" id="home">
                <div className="hero-modern-overlay"></div>
                <Image
                    src={HERO_BG}
                    alt="Titas Fruit Fest"
                    className="hero-modern-bg"
                    fill
                    priority
                />

                <div className="container hero-modern-content">
                    <div className="hero-modern-badge glass-panel-dark">
                        <MapPin size={16} />
                        <span>Brahmanbaria to Dhaka University</span>
                    </div>

                    <TrainAnimation className="hero-train-animation" />

                    <h1 className="hero-modern-title bn-text">
                        <span className="title-line-1">তিতাস</span>
                        <span className="title-line-2 text-gradient">কমিউনিটি হাব</span>
                    </h1>

                    <p className="hero-modern-mission bn-text">
                        ঢাকা বিশ্ববিদ্যালয়ে অধ্যয়নরত ব্রাহ্মণবাড়িয়া জেলার শিক্ষার্থীদের মেধা, মনন ও ঐক্যের প্রতীক। আসুন, একসাথে একটি শক্তিশালী নেটওয়ার্ক গড়ে তুলি।
                    </p>

                    <div className="hero-modern-actions">
                        <Link href="/register" className="btn-modern-primary bn-text">
                            <UserPlus size={18} />
                            <span>কমিউনিটিতে যোগ দিন</span>
                        </Link>
                        <a href="#events" className="btn-modern-secondary glass-panel bn-text">
                            <Calendar size={18} />
                            <span>ইভেন্ট দেখুন</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* ACTIVE NOTICE BOARD */}
            <div className="notice-board-modern">
                <div className="notice-label bn-text">
                    <AlertCircle size={18} />
                    জরুরী নোটিশ
                </div>
                <div className="notice-ticker">
                    {notices.length > 0 ? notices.map((notice) => (
                        <div key={notice._id} className="notice-item bn-text">
                            {notice.priority === 'new' && <span className="badge-new">New</span>}
                            {notice.priority === 'urgent' && <AlertCircle size={14} className="text-red-500" />}
                            {notice.priority === 'normal' && <Calendar size={14} />}
                            {notice.link ? (
                                <a href={notice.link} target="_blank" rel="noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>{notice.text}</a>
                            ) : notice.text}
                        </div>
                    )) : (
                        <div className="notice-item bn-text">তিতাস পরিবারে আপনাকে স্বাগতম! নিয়মিত আপডেটের জন্য আমাদের সাথেই থাকুন।</div>
                    )}
                </div>
            </div>

            {/* 2. ABOUT SECTION */}
            <section className="about-modern" id="about">
                <div className="container">
                    <div className="about-modern-grid">
                        <div className="about-modern-text">
                            <div className="section-label">Our Mission</div>
                            <h2 className="section-title bn-text">আমাদের সম্পর্কে</h2>
                            <p className="section-desc bn-text">
                                তিতাস – ঢাকা বিশ্ববিদ্যালয়স্থ ব্রাহ্মণবাড়িয়া জেলা ছাত্রকল্যাণ পরিষদ। এটি শুধুমাত্র একটি সংগঠন নয়, বরং ঢাকা বিশ্ববিদ্যালয়ে অধ্যয়নরত ব্রাহ্মণবাড়িয়া জেলার শিক্ষার্থীদের একটি পরিবার। আমাদের মূল লক্ষ্য শিক্ষার্থীদের মধ্যে ভ্রাতৃত্ববোধ, সহযোগিতা এবং নেতৃত্বের গুণাবলী বিকাশ করা।
                            </p>
                            <p className="section-desc bn-text">
                                আমরা নিয়মিত নবীন বরণ, কৃতি শিক্ষার্থী সংবর্ধনা, রক্তদান কর্মসূচী, শীতবস্ত্র বিতরণসহ নানাবিধ সামাজিক ও সাংস্কৃতিক অনুষ্ঠানের আয়োজন করে থাকি।
                            </p>

                            <div className="about-stats">
                                <div className="stat-box">
                                    <h4 className="stat-number">৫০০+</h4>
                                    <p className="stat-label">বর্তমান সদস্য</p>
                                </div>
                                <div className="stat-box">
                                    <h4 className="stat-number">৫০+</h4>
                                    <p className="stat-label">বার্ষিক ইভেন্ট</p>
                                </div>
                                <div className="stat-box">
                                    <h4 className="stat-number">১৯৯৪</h4>
                                    <p className="stat-label">প্রতিষ্ঠিত</p>
                                </div>
                            </div>
                        </div>
                        <div className="about-modern-image">
                            <div className="image-frame-glass">
                                <div style={{ position: 'relative', width: '100%', height: '400px' }}>
                                    <Image 
                                        src={ABOUT_US_BG} 
                                        alt="About Titas" 
                                        fill
                                        style={{ objectFit: 'cover', borderRadius: '12px' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. ANNOUNCEMENTS & EVENTS SECTION */}
            <section className="events-modern section-bg-light" id="events">
                <div className="container">
                    <div className="section-header-center">
                        <div className="section-label">Updates</div>
                        <h2 className="section-title bn-text">ইভেন্ট ও নোটিশ</h2>
                        <p className="section-subtitle">Stay updated with the latest community happenings</p>
                    </div>

                    <div className="events-grid">
                        {loadingEvents ? (
                            <div className="loading-state col-span-2">Loading events...</div>
                        ) : events.length > 0 ? (
                            events.map(event => (
                                <div key={event._id} className="event-modern-card glass-panel">
                                    <div className="event-date">
                                        <span className="day">{new Date(event.date).getDate()}</span>
                                        <span className="month">{new Date(event.date).toLocaleDateString('bn-BD', { month: 'long' })}</span>
                                    </div>
                                    <div className="event-content">
                                        <h3 className="bn-text">{event.title}</h3>
                                        <p className="event-meta"><MapPin size={14} /> {event.location}</p>
                                        <p className="event-desc line-clamp-2">{event.description}</p>
                                        {event.rsvpEnabled !== false && (
                                            <>
                                                <div className="event-rsvp-stats en-text">
                                                    <span>Going: {event?.rsvpSummary?.going || 0}</span>
                                                    {Number(event?.rsvpSummary?.capacity || 0) > 0 && (
                                                        <span>Seats left: {event?.rsvpSummary?.seatsLeft ?? 0}</span>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    className="btn-rsvp"
                                                    onClick={() => openRsvpModal(event)}
                                                >
                                                    {studentProfile ? 'Register' : 'Register Now'}
                                                </button>
                                            </>
                                        )}
                                        {event.link ? (
                                            <a href={event.link} target="_blank" rel="noreferrer" className="btn-text-link mt-auto">Learn More <ArrowRight size={16} /></a>
                                        ) : (
                                            <div className="mt-auto h-4"></div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="event-modern-card glass-panel highlight">
                                <div className="event-icon">
                                    <Users size={24} />
                                </div>
                                <div className="event-content">
                                    <div className="badge-new">New</div>
                                    <h3 className="bn-text">সদস্য সংগ্রহ চলছে</h3>
                                    <p className="event-meta"><Calendar size={14} /> আমাদের সাথেই থাকুন</p>
                                    <p className="event-desc">২০২৩-২৪ সেশনের নবীন শিক্ষার্থীদের তিতাস ডেটাবেজে তথ্য যুক্ত করার আহ্বান করা হচ্ছে।</p>
                                    <Link href="/register" className="btn-text-link mt-auto">Register Now <ArrowRight size={16} /></Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 4. LATEST BLOG POSTS */}
            <section className="blog-overview-modern" id="blog">
                <div className="container">
                    <div className="section-header-flex">
                        <div>
                            <div className="section-label">Stories & Articles</div>
                            <h2 className="section-title bn-text">সাম্প্রতিক ব্লগ</h2>
                        </div>
                        <Link href="/blog" className="btn-outline-modern">View All Posts <ArrowRight size={16} /></Link>
                    </div>

                    {loadingPosts ? (
                        <div className="loading-state">Loading posts...</div>
                    ) : (
                        <div className="modern-cards-grid">
                            {latestPosts.map(post => (
                                <Link href={`/blog/${post.slug}`} className="modern-blog-card" key={post._id}>
                                    <div className="card-image-wrap">
                                        <div style={{ position: 'relative', height: '200px', width: '100%' }}>
                                            <Image
                                                src={post.featuredImage ? `${API_BASE_URL}${post.featuredImage}` : 'https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&w=600&q=80'}
                                                alt={post.title}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>
                                        <div className="card-category">{post.category?.name || 'General'}</div>
                                    </div>
                                    <div className="card-body">
                                        <h3 className="card-title line-clamp-2">{post.title}</h3>
                                        <p className="card-excerpt line-clamp-2">{post.excerpt || 'Read the full story to learn more about this topic.'}</p>
                                        <div className="card-footer">
                                            <span className="card-author">{post.author}</span>
                                            <span className="card-date">{formatDate(post.publishedAt)}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {latestPosts.length === 0 && !loadingPosts && (
                                <div className="empty-state">No stories published yet.</div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* 5. ALUMNI SPOTLIGHT */}
            <section className="spotlight-modern section-bg-dark">
                <div className="container">
                    <div className="spotlight-layout">
                        <div className="spotlight-content">
                            <div className="section-label light">Alumni Spotlight</div>
                            <h2 className="section-title text-white bn-text">আমাদের গর্ব</h2>
                            <p className="section-desc spotlight-desc bn-text">
                                ঢাকা বিশ্ববিদ্যালয় থেকে পড়াশোনা শেষে আমাদের ব্রাহ্মণবাড়িয়ার সন্তানেরা আজ দেশ-বিদেশের বিভিন্ন গুরুত্বপূর্ণ স্থানে নেতৃত্ব দিচ্ছেন। তাদের সাফল্য আমাদের অনুপ্রেরণা।
                            </p>
                            <div className="spotlight-stats">
                                <div className="spotlight-stat-item">
                                    <span className="value">1200+</span>
                                    <span className="label">Active Alumni</span>
                                </div>
                                <div className="spotlight-stat-item">
                                    <span className="value">25+</span>
                                    <span className="label">Public Leaders</span>
                                </div>
                                <div className="spotlight-stat-item">
                                    <span className="value">40+</span>
                                    <span className="label">Mentors</span>
                                </div>
                            </div>
                            <Link href="/students" className="btn-modern-primary white">
                                <Award size={18} /> Explore Alumni Directory
                            </Link>
                        </div>
                        <div className="spotlight-cards">
                            <div className="spotlight-card spotlight-card-dark spotlight-card-featured">
                                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80" alt="Alumni Placeholder" className="avatar" />
                                <div className="info">
                                    <div className="spotlight-meta-top">
                                        <h4>Dr. Abul Kalam</h4>
                                        <span className="spotlight-pill">Mentor</span>
                                    </div>
                                    <p className="role">Professor, Dept of Physics</p>
                                    <p className="batch">Batch: '98</p>
                                    <p className="summary">Leading research initiatives and mentoring first-generation university students.</p>
                                </div>
                            </div>
                            <div className="spotlight-card spotlight-card-dark">
                                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" alt="Alumni Placeholder" className="avatar" />
                                <div className="info">
                                    <div className="spotlight-meta-top">
                                        <h4>Farhana Yesmin</h4>
                                        <span className="spotlight-pill">Leader</span>
                                    </div>
                                    <p className="role">Joint Secretary, GoB</p>
                                    <p className="batch">Batch: '01</p>
                                    <p className="summary">Working on policy reform and supporting women-focused education programs.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* STUDENT TESTIMONIALS */}
            <section className="testimonials-modern">
                <div className="container">
                    <div className="section-header-center">
                        <div className="section-label">Community Voices</div>
                        <h2 className="section-title bn-text">শিক্ষার্থীদের মতামত</h2>
                        <p className="section-subtitle">আমাদের পরিবারের সদস্যদের কিছু কথা</p>
                    </div>

                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <div className="quote-icon"><Quote size={20} /></div>
                            <p className="testimonial-text bn-text">
                                "ভর্তি পরীক্ষার সময় ঢাকায় এসে থাকার জায়গা নিয়ে খুব চিন্তায় ছিলাম। তিতাসের বড় ভাইয়েরা নিজ দায়িত্বে মেসে থাকার ব্যবস্থা করে দিয়েছিলেন। এই ঋণ কখনো শোধ করার মতো নয়।"
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar"><img src="https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=100&q=80" alt="Student" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /></div>
                                <div className="author-info">
                                    <h4 className="bn-text">আহমেদ ফয়সাল</h4>
                                    <p className="bn-text">ম্যানেজমেন্ট স্টাডিজ (২য় বর্ষ), বাঞ্ছারামপুর</p>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-card">
                            <div className="quote-icon"><Quote size={20} /></div>
                            <p className="testimonial-text bn-text">
                                "নতুন পরিবেশে মানিয়ে নেওয়া সহজ ছিল না। কিন্তু তিতাসের ইভেন্টগুলো এবং বড় আপুদের গাইডলাইন আমাকে অনেক সাহসী করেছে। মনেই হয়নি যে আমি বাড়ির বাইরে আছি।"
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar"><img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80" alt="Student" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /></div>
                                <div className="author-info">
                                    <h4 className="bn-text">সাদিয়া আফরিন</h4>
                                    <p className="bn-text">রাষ্ট্রবিজ্ঞান (৩য় বর্ষ), কসবা</p>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-card">
                            <div className="quote-icon"><Quote size={20} /></div>
                            <p className="testimonial-text bn-text">
                                "পরীক্ষার আগে নোটস জোগাড় করা থেকে শুরু করে যেকোনো দরকারে এই প্ল্যাটফর্মটিকে পাশে পেয়েছি সবসময়। তিতাস শুধু সংগঠন নয়, একটা ভরসার জায়গা।"
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar"><img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80" alt="Student" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /></div>
                                <div className="author-info">
                                    <h4 className="bn-text">মোহাম্মদ তরিকুল</h4>
                                    <p className="bn-text">আইন বিভাগ (৪র্থ বর্ষ), নবীনগর</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. PHOTO GALLERY */}
            <section className="gallery-modern" id="gallery">
                <div className="container">
                    <div className="section-header-center">
                        <div className="section-label">Moments</div>
                        <h2 className="section-title bn-text">ফটো গ্যালারি</h2>
                        <p className="section-subtitle">Glimpses of our vibrant community life</p>
                    </div>

                    <div className="gallery-masonry-wrapper">
                        {loadingGallery ? (
                            <div className="loading-state col-span-3">Loading gallery...</div>
                        ) : gallery.length > 0 ? (
                            gallery.slice(0, 8).map((img) => (
                                <div key={img._id} className="gallery-item-masonry">
                                    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '300px' }}>
                                        <Image 
                                            src={`${API_BASE_URL}${img.imageUrl}`} 
                                            alt={img.title}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="gallery-overlay">
                                        <div className="overlay-content">
                                            <span className="bn-text">{img.title}</span>
                                            <span className="en-text text-sm opacity-80">{img.category}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state text-center w-full col-span-3">গ্যালারিতে কোনো ছবি পাওয়া যায়নি।</div>
                        )}
                    </div>
                </div>
            </section>

            {/* 7. EXECUTIVE COMMITTEE */}
            <section className="committee-modern section-bg-light" id="committee">
                <div className="container">
                    <div className="section-header-center">
                        <div className="section-label">Leadership</div>
                        <h2 className="section-title bn-text">কার্যনির্বাহী কমিটি ২০২৫-২৬</h2>
                    </div>

                    <div className="committee-grid dual">
                        {leaders.map((leader, i) => (
                            <div key={i} className="committee-card-detail glass-panel text-center">
                                <div className="img-wrap">
                                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                        <Image 
                                            src={leader.photo} 
                                            alt={leader.nameEn}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                </div>
                                <h3 className="bn-text mt-4">{leader.name}</h3>
                                <p className="name-en text-sm" style={{ color: '#666', marginBottom: '0.25rem' }}>{leader.nameEn}</p>
                                <p className="role text-primary font-medium">{leader.role}</p>
                                <p className="dept text-muted text-sm mt-1">{leader.department} | সেশন: {leader.session}</p>

                                <div className="writings-quote mt-6">
                                    <p className="bn-text text-sm italic text-gray-600">
                                        "{leader.message}"
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="faq-modern section-bg-light" id="faq">
                <div className="container">
                    <div className="section-header-center">
                        <div className="section-label">Questions?</div>
                        <h2 className="section-title bn-text">সাধারণ জিজ্ঞাসা</h2>
                        <p className="section-subtitle">নবীন শিক্ষার্থীদের মনে সাধারণত যেসব প্রশ্ন জাগে</p>
                    </div>

                    <div className="faq-list">
                        <details className="faq-item">
                            <summary className="bn-text">আমি কিভাবে তিতাসের সদস্য হতে পারি?</summary>
                            <div className="faq-content bn-text">
                                তিতাসের সদস্য হতে হলে আপনাকে অবশ্যই ঢাকা বিশ্ববিদ্যালয়ের রানিং শিক্ষার্থী হতে হবে এবং আপনার স্থায়ী ঠিকানা ব্রাহ্মণবাড়িয়া জেলায় হতে হবে। এই ওয়েবসাইটের 'কমিউনিটিতে যোগ দিন' বাটনে ক্লিক করে অনলাইনে আপনার তথ্য প্রদান করলেই যাচাই-বাছাই শেষে আপনি সদস্য পদ লাভ করবেন।
                            </div>
                        </details>
                        <details className="faq-item">
                            <summary className="bn-text">সংগঠনের সাধারণ সভা কখন হয়?</summary>
                            <div className="faq-content bn-text">
                                আমাদের একটি বাৎসরিক ক্যালেন্ডার রয়েছে। সাধারণত প্রতি মাসের প্রথম শুক্রবার টিএসসিতে আমাদের মিলিত আড্ডা বা সাধারণ সভার আয়োজন করা হয়ে থাকে। এছাড়া বিশেষ প্রয়োজন বা ইভেন্টের আগে জরুরি সভা আহ্বান করা হয়, যার নোটিশ ওয়েবসাইটে এবং ফেসবুক গ্রুপে জানানো হয়।
                            </div>
                        </details>

                        <details className="faq-item">
                            <summary className="bn-text">ক্যাম্পাসে কোনো বিপদে পড়লে কার সাথে যোগাযোগ করবো?</summary>
                            <div className="faq-content bn-text">
                                যেকোনো জরুরি দরকারে আমাদের হেল্পলাইন নম্বর অথবা বর্তমান সভাপতি/সাধারণ সম্পাদকের সাথে সরাসরি যোগাযোগ করতে পারেন। তাঁদের নাম্বার ওয়েবসাইটের যোগাযোগ পৃষ্ঠায় দেয়া আছে। আমরা সবসময় বারিয়ার ভাই-বোনদের পাশে আছি।
                            </div>
                        </details>

                        <details className="faq-item">
                            <summary className="bn-text">এখানে কি স্কলারশিপ বা বৃত্তির কোনো ব্যবস্থা আছে?</summary>
                            <div className="faq-content bn-text">
                                তিতাসের সরাসরি নিজস্ব কোনো স্কলারশিপ নেই, তবে আমাদের অ্যালামনাই এসোসিয়েশনের পক্ষ থেকে অস্বচ্ছল ও মেধাবী শিক্ষার্থীদের জন্য বিভিন্ন সময় এককালীন অনুদান এবং বৃত্তির ব্যবস্থা করা হয়ে থাকে।
                            </div>
                        </details>

                        <details className="faq-item">
                            <summary className="bn-text">রেজিস্ট্রেশন দেওয়ার পর অনুমোদন পেতে কত সময় লাগে?</summary>
                            <div className="faq-content bn-text">
                                সাধারণত ২৪-৭২ ঘণ্টার মধ্যে আবেদন যাচাই করা হয়। প্রয়োজনীয় তথ্য (রেজিস্ট্রেশন নম্বর, বিভাগ, সেশন, যোগাযোগ নম্বর) সঠিক থাকলে দ্রুত অনুমোদন দেওয়া সম্ভব হয়। বিশেষ ব্যস্ত সময়ে একটু বেশি সময় লাগতে পারে।
                            </div>
                        </details>

                        <details className="faq-item">
                            <summary className="bn-text">স্টুডেন্ট প্রোফাইলের ছবি বা তথ্য কি পরে আপডেট করা যাবে?</summary>
                            <div className="faq-content bn-text">
                                অবশ্যই। প্রোফাইলের তথ্য আপডেটের প্রয়োজন হলে অ্যাডমিন প্যানেল বা যোগাযোগ ফর্মের মাধ্যমে অনুরোধ করতে পারবেন। যাচাই শেষে আপনার তথ্য আপডেট করে দেওয়া হবে।
                            </div>
                        </details>

                        <details className="faq-item">
                            <summary className="bn-text">আমি অ্যালামনাই, তবুও কি তিতাসের কার্যক্রমে যুক্ত হতে পারবো?</summary>
                            <div className="faq-content bn-text">
                                হ্যাঁ, অবশ্যই। অ্যালামনাই সদস্যরা মেন্টরিং, ক্যারিয়ার গাইডলাইন, সেমিনার এবং শিক্ষার্থীদের সহায়তা কার্যক্রমে সক্রিয়ভাবে অংশ নিতে পারেন। আমাদের সাথে যোগাযোগ করলে সংশ্লিষ্ট টিম আপনাকে যুক্ত করে নেবে।
                            </div>
                        </details>

                        <details className="faq-item">
                            <summary className="bn-text">ওয়েবসাইটে দেওয়া আমার ব্যক্তিগত তথ্য কতটা নিরাপদ?</summary>
                            <div className="faq-content bn-text">
                                আমরা ব্যক্তিগত তথ্য সুরক্ষায় সর্বোচ্চ গুরুত্ব দিই। সংবেদনশীল তথ্য সীমিতভাবে প্রদর্শন করা হয় এবং অনুমোদিত অ্যাডমিন ছাড়া তা সম্পাদনার সুযোগ থাকে না। নিরাপত্তা ঝুঁকি মনে হলে দ্রুত আমাদের জানাতে পারবেন।
                            </div>
                        </details>

                        <details className="faq-item">
                            <summary className="bn-text">ইভেন্টের আপডেট বা নোটিশ সবচেয়ে দ্রুত কোথায় পাওয়া যাবে?</summary>
                            <div className="faq-content bn-text">
                                সবশেষ আপডেট পেতে ওয়েবসাইটের নোটিশ বোর্ড, ইভেন্ট সেকশন এবং অফিসিয়াল ফেসবুক গ্রুপ নিয়মিত অনুসরণ করুন। জরুরি আপডেটগুলো সাধারণত সবার আগে নোটিশ টিকারে প্রকাশ করা হয়।
                            </div>
                        </details>

                        <details className="faq-item">
                            <summary className="bn-text">ঢাকায় নতুন এলে থাকার ব্যবস্থা বা গাইডলাইন পাওয়া যাবে কি?</summary>
                            <div className="faq-content bn-text">
                                নতুনদের জন্য সিনিয়র ভাই-বোনেরা সাধ্যের মধ্যে থাকা, রুট, এবং প্রয়োজনীয় কাগজপত্র বিষয়ে দিকনির্দেশনা দিয়ে থাকেন। আপনি যোগাযোগ ফর্মে বার্তা দিলে বা হেল্পলাইনে জানালে দ্রুত রেসপন্স পাবেন।
                            </div>
                        </details>
                    </div>
                </div>
            </section>

            {/* QUICK FOOTER CTA & CONTACT */}
            <section className="home-contact-modern" id="contact" style={{ padding: '6rem 0', backgroundColor: '#f8fafc' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <div className="section-header-center mb-10">
                        <div className="section-label">Get In Touch</div>
                        <h2 className="section-title bn-text">আমাদের সাথে যোগাযোগ করুন</h2>
                        <p className="section-subtitle">তিতাস সম্পর্কিত যেকোনো তথ্য, পরামর্শ বা মতামতের জন্য বার্তা পাঠান।</p>
                    </div>

                    <div className="home-active-form">
                        <ContactForm />
                    </div>
                </div>
            </section>

            {/* GLOBAL FOOTER */}
            <Footer />

            {rsvpModalOpen && selectedEvent && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel">
                        <div className="modal-header">
                            <h3 className="bn-text">ইভেন্ট রেজিস্ট্রেশন</h3>
                            <button className="close-btn" onClick={() => setRsvpModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <p className="en-text text-muted" style={{ marginTop: '-1rem', marginBottom: '1rem' }}>
                            {selectedEvent.title}
                        </p>

                        {rsvpMessage.text && (
                            <div className={`rsvp-flash ${rsvpMessage.type === 'success' ? 'success' : 'error'}`}>
                                {rsvpMessage.text}
                            </div>
                        )}

                        <form onSubmit={handleRsvpSubmit} className="notice-form">
                            {studentProfile ? (
                                <div className="rsvp-profile-card">
                                    <h4 className="bn-text">আপনার প্রোফাইল থেকে তথ্য নেওয়া হবে</h4>
                                    <p className="en-text">Name: {studentProfile.nameBn || studentProfile.nameEn || '-'}</p>
                                    <p className="en-text">Email: {studentProfile.email || '-'}</p>
                                    <p className="en-text">Phone: {studentProfile.mobile || '-'}</p>
                                    <p className="en-text">Department: {studentProfile.department || '-'}</p>
                                    <p className="en-text">Session: {studentProfile.session || '-'}</p>
                                </div>
                            ) : (
                                <div className="rsvp-profile-card">
                                    <h4 className="bn-text">লগইন প্রয়োজন</h4>
                                    <p className="bn-text">রেজিস্ট্রেশন ডেটা আপনার স্টুডেন্ট প্রোফাইল থেকে অটো-নেওয়া হবে। তাই আগে লগইন করুন।</p>
                                    <div className="modal-actions" style={{ borderTop: 'none', paddingTop: '0.6rem', marginTop: '0.4rem' }}>
                                        <Link href="/login" className="btn-modern-submit" onClick={() => setRsvpModalOpen(false)}>
                                            Login as Student
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {studentProfile && (
                                <>
                                    <p className="en-text text-muted" style={{ marginTop: '0.7rem', marginBottom: '0.6rem' }}>
                                        You are registering as <strong>Going</strong>.
                                    </p>

                                    <div className="modal-actions registration-actions">
                                        <button type="button" className="btn-modern-secondary registration-cancel-btn" onClick={() => setRsvpModalOpen(false)}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn-modern-submit registration-confirm-btn" disabled={rsvpSubmitting}>
                                            {rsvpSubmitting ? 'Submitting...' : 'Confirm Registration'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
    Heart, BookOpen, Users, Music, Droplets, GraduationCap, 
    Calendar, HeartHandshake, Megaphone, ArrowRight, Star, 
    Target, Eye, Link2, ScrollText, MapPin, Mail, Quote, User 
} from 'lucide-react';

/* ── Counter hook ── */
const useCountUp = (end, duration = 2000) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const start = performance.now();
                    const step = (now) => {
                        const progress = Math.min((now - start) / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.floor(eased * end));
                        if (progress < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, duration]);

    return { count, ref };
};

/* ── Stat Counter Component ── */
const StatCounter = ({ value, suffix, label, labelEn }) => {
    const { count, ref } = useCountUp(value, 2200);
    return (
        <div className="about-stat-item" ref={ref}>
            <span className="about-stat-number">{count}{suffix}</span>
            <span className="about-stat-label bn-text">{label}</span>
            <span className="about-stat-label-en">{labelEn}</span>
        </div>
    );
};

/* ── Section Animation Wrapper ── */
const AnimatedSection = ({ children, className, id }) => {
    const ref = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('about-visible');
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.15 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={ref} className={className} id={id}>
            <div className="about-fade-up">
                {children}
            </div>
        </section>
    );
};

const MISSION_ITEMS = [
    { icon: Heart, title: 'ছাত্রকল্যাণ', titleEn: 'Student Welfare', desc: 'ঢাকা বিশ্ববিদ্যালয়ে অধ্যয়নরত ব্রাহ্মণবাড়িয়া জেলার শিক্ষার্থীদের সার্বিক কল্যাণ নিশ্চিত করা।' },
    { icon: Music, title: 'সংস্কৃতি চর্চা', titleEn: 'Cultural Preservation', desc: 'ব্রাহ্মণবাড়িয়ার সমৃদ্ধ সাংস্কৃতিক ঐতিহ্য সংরক্ষণ ও চর্চা অব্যাহত রাখা।' },
    { icon: GraduationCap, title: 'শিক্ষা সহায়তা', titleEn: 'Academic Support', desc: 'পড়াশোনা সংক্রান্ত পরামর্শ, তথ্য আদান-প্রদান ও পারস্পরিক সহযোগিতা।' },
    { icon: Link2, title: 'ঐক্য ও ভ্রাতৃত্ব', titleEn: 'Unity & Brotherhood', desc: 'বিভিন্ন বিভাগ ও হলের শিক্ষার্থীদের মধ্যে সেতুবন্ধন তৈরি ও সম্প্রীতি বৃদ্ধি।' },
];

const ACTIVITIES = [
    { icon: Star, label: 'নবীনবরণ', labelEn: 'Freshers\' Welcome' },
    { icon: Music, label: 'সাংস্কৃতিক অনুষ্ঠান', labelEn: 'Cultural Events' },
    { icon: Droplets, label: 'রক্তদান কর্মসূচি', labelEn: 'Blood Donation' },
    { icon: GraduationCap, label: 'শিক্ষা সহায়তা', labelEn: 'Academic Aid' },
    { icon: HeartHandshake, label: 'সামাজিক কার্যক্রম', labelEn: 'Social Activities' },
    { icon: Calendar, label: 'ইভেন্ট আয়োজন', labelEn: 'Event Management' },
    { icon: Megaphone, label: 'সচেতনতা কার্যক্রম', labelEn: 'Awareness Campaigns' },
    { icon: BookOpen, label: 'প্রকাশনা ও ব্লগ', labelEn: 'Publications & Blog' },
];

const LEADERS = [
    {
        name: 'রাইয়ান কবির ঐশী',
        nameEn: 'Raiyan Kabir Oishi',
        role: 'সভাপতি',
        roleEn: 'President',
        department: 'সমাজবিজ্ঞান বিভাগ',
        session: '২০১৯-২০২০',
        email: 'oishykabir681@gmail.com',
        photo: '/assets/president.png',
        message: 'তিতাস শুধু একটি সংগঠন নয়, এটি আমাদের পরিবার। ঢাকা বিশ্ববিদ্যালয়ে ব্রাহ্মণবাড়িয়ার প্রতিটি শিক্ষার্থীর পাশে দাঁড়ানোই আমাদের অঙ্গীকার। আমরা বিশ্বাস করি, ঐক্যবদ্ধভাবে আমরা আরও অনেক দূর এগিয়ে যেতে পারি।',
    },
    {
        name: 'রিফতি-আল-জাবেদ',
        nameEn: 'Rifty Al Zabed',
        role: 'সাধারণ সম্পাদক',
        roleEn: 'General Secretary',
        department: 'কমিউনিকেশন ডিজঅর্ডারস বিভাগ',
        session: '২০২০-২০২১',
        email: 'riftyzabed003@gmail.com',
        photo: '/assets/gs.png',
        message: 'ব্রাহ্মণবাড়িয়ার সমৃদ্ধ সংস্কৃতি ও ঐতিহ্যকে ধারণ করে তিতাস এগিয়ে চলেছে। প্রতিটি কার্যক্রমে স্বচ্ছতা ও জবাবদিহিতা নিশ্চিত করা আমাদের প্রধান লক্ষ্য। আপনাদের সকলের সহযোগিতায় তিতাসকে আরও উচ্চতায় নিয়ে যেতে চাই।',
    },
];

const STATS = [
    { value: 200, suffix: '+', label: 'সদস্য', labelEn: 'Members' },
    { value: 25, suffix: '+', label: 'ইভেন্ট আয়োজিত', labelEn: 'Events Organized' },
    { value: 4, suffix: '+', label: 'বছর সক্রিয়', labelEn: 'Years Active' },
    { value: 50, suffix: '+', label: 'রক্তদান', labelEn: 'Blood Donations' },
];

const TIMELINE = [
    { year: '২০২০', title: 'ফেসবুক কমিউনিটি', desc: '"তিতাস—ঢাবিতে একখণ্ড ব্রাহ্মণবাড়িয়া" ফেসবুক গ্রুপ চালুর মাধ্যমে যাত্রা শুরু।' },
    { year: '২০ ২০২১', title: 'আনুষ্ঠানিক প্রতিষ্ঠা', desc: 'একটি সম্পূর্ণ অরাজনৈতিক, ভ্রাতৃত্বমূলক, অলাভজনক ও সেবাধর্মী সংগঠন হিসেবে তিতাসের আনুষ্ঠানিক যাত্রা।' },
    { year: '২০২২', title: 'প্রথম নবীনবরণ', desc: 'ঢাকা বিশ্ববিদ্যালয়ের ব্রাহ্মণবাড়িয়ার নবাগত শিক্ষার্থীদের জন্য প্রথম নবীনবরণ অনুষ্ঠান।' },
    { year: '২০২৩', title: 'সাংস্কৃতিক বিপ্লব', desc: 'বিভিন্ন সাংস্কৃতিক অনুষ্ঠান, রক্তদান ক্যাম্পেইন ও সামাজিক কর্মসূচি সম্প্রসারণ।' },
    { year: '২০২৪', title: 'গণতান্ত্রিক নির্বাচন', desc: 'জুলাই গণঅভ্যুত্থান-পরবর্তী সময়ে ঢাবিতে তিতাসই প্রথম গণতান্ত্রিক দৃষ্টান্ত স্থাপন করে নির্বাচনের মাধ্যমে।' },
    { year: '২০২৫', title: 'ডিজিটাল সম্প্রসারণ', desc: 'তিতাসের নিজস্ব ওয়েবসাইট, ডিজিটাল সদস্যপদ ব্যবস্থাপনা ও অনলাইন উপস্থিতি জোরদার।' },
];

export default function AboutUsClient() {
    return (
        <>
            {/* ═══════ 1. HERO ═══════ */}
            <AnimatedSection className="about-hero">
                <div className="about-hero-overlay" />
                <div className="container about-hero-content">
                    <Image 
                        src="/assets/logo.png" 
                        alt="তিতাস লোগো" 
                        className="about-hero-logo" 
                        width={90} 
                        height={90} 
                    />
                    <h1 className="about-hero-title bn-text">তিতাস</h1>
                    <p className="about-hero-tagline bn-text">
                        শিক্ষা · সহযোগিতা · সংস্কৃতি · ভ্রাতৃত্ব
                    </p>
                    <p className="about-hero-subtitle bn-text">
                        ঢাকা বিশ্ববিদ্যালয়স্থ ব্রাহ্মণবাড়িয়া জেলা ছাত্রকল্যাণ পরিষদ
                    </p>
                    <p className="about-hero-desc bn-text">
                        প্রাচ্যের অক্সফোর্ড খ্যাত ঢাকা বিশ্ববিদ্যালয়ে অধ্যয়নরত ব্রাহ্মণবাড়িয়া জেলার
                        সকল শিক্ষার্থীদের ঐক্য, কল্যাণ ও সংস্কৃতি চর্চার মঞ্চ।
                    </p>
                </div>
            </AnimatedSection>

            {/* ═══════ 2. WHO WE ARE ═══════ */}
            <AnimatedSection className="about-section about-who">
                <div className="container">
                    <div className="about-section-header">
                        <span className="about-label">WHO WE ARE</span>
                        <h2 className="about-section-title bn-text">আমাদের পরিচয়</h2>
                    </div>
                    <div className="about-who-grid">
                        <div className="about-who-text">
                            <p className="bn-text">
                                <strong>তিতাস</strong> হলো ঢাকা বিশ্ববিদ্যালয়ে অধ্যয়নরত ব্রাহ্মণবাড়িয়া জেলার
                                শিক্ষার্থীদের একটি সম্পূর্ণ <strong>অরাজনৈতিক, ভ্রাতৃত্বমূলক, অলাভজনক ও সেবাধর্মী</strong> সংগঠন।
                            </p>
                            <p className="bn-text">
                                ২০২১ সালে প্রতিষ্ঠিত এই সংগঠন ব্রাহ্মণবাড়িয়া জেলার বিভিন্ন উপজেলা থেকে আসা
                                শিক্ষার্থীদের মধ্যে পারস্পরিক পরিচিতি, যোগাযোগ ও সহযোগিতা গড়ে তোলার লক্ষ্যে কাজ করে।
                            </p>
                            <p className="bn-text">
                                ঢাকা বিশ্ববিদ্যালয়ের বিভিন্ন বিভাগ ও হলে ছড়িয়ে থাকা ব্রাহ্মণবাড়িয়ার সন্তানদের
                                একটি পরিবারের মতো বন্ধনে আবদ্ধ করাই তিতাসের মূল উদ্দেশ্য। সাংস্কৃতিক রাজধানী হিসেবে
                                পরিচিত ব্রাহ্মণবাড়িয়ার গর্ব ও ঐতিহ্য ধারণ করে তিতাস এগিয়ে চলেছে।
                            </p>
                        </div>
                        <div className="about-who-highlights">
                            <div className="about-highlight-card">
                                <Target size={28} />
                                <div>
                                    <h4 className="bn-text">অরাজনৈতিক</h4>
                                    <p className="bn-text">সম্পূর্ণ রাজনীতিমুক্ত সেবাধর্মী সংগঠন</p>
                                </div>
                            </div>
                            <div className="about-highlight-card">
                                <Eye size={28} />
                                <div>
                                    <h4 className="bn-text">স্বচ্ছতা</h4>
                                    <p className="bn-text">গণতান্ত্রিক প্রক্রিয়া ও আর্থিক স্বচ্ছতা</p>
                                </div>
                            </div>
                            <div className="about-highlight-card">
                                <Users size={28} />
                                <div>
                                    <h4 className="bn-text">সর্বজনীন</h4>
                                    <p className="bn-text">সকল শিক্ষার্থীর জন্য উন্মুক্ত</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* ═══════ 3. MISSION & VISION ═══════ */}
            <AnimatedSection className="about-section about-mission">
                <div className="container">
                    <div className="about-section-header">
                        <span className="about-label">MISSION & VISION</span>
                        <h2 className="about-section-title bn-text">আমাদের লক্ষ্য ও উদ্দেশ্য</h2>
                        <p className="about-section-subtitle bn-text">
                            শিক্ষার্থীদের কল্যাণে তিতাসের চারটি মূল স্তম্ভ
                        </p>
                    </div>
                    <div className="about-mission-grid">
                        {MISSION_ITEMS.map((item, i) => (
                            <div key={i} className="about-mission-card">
                                <div className="about-mission-icon">
                                    <item.icon size={28} />
                                </div>
                                <h3 className="bn-text">{item.title}</h3>
                                <span className="about-mission-en">{item.titleEn}</span>
                                <p className="bn-text">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </AnimatedSection>

            {/* ═══════ 4. ACTIVITIES ═══════ */}
            <AnimatedSection className="about-section about-activities">
                <div className="container">
                    <div className="about-section-header">
                        <span className="about-label light">WHAT WE DO</span>
                        <h2 className="about-section-title bn-text" style={{ color: '#fff' }}>আমাদের কার্যক্রম</h2>
                        <p className="about-section-subtitle bn-text" style={{ color: '#94a3b8' }}>
                            তিতাস নিয়মিতভাবে বিভিন্ন কার্যক্রম পরিচালনা করে থাকে
                        </p>
                    </div>
                    <div className="about-activities-grid">
                        {ACTIVITIES.map((item, i) => (
                            <div key={i} className="about-activity-card">
                                <div className="about-activity-icon">
                                    <item.icon size={26} />
                                </div>
                                <h4 className="bn-text">{item.label}</h4>
                                <span className="about-activity-en">{item.labelEn}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </AnimatedSection>

            {/* ═══════ 5. COMMITTEE ═══════ */}
            <AnimatedSection className="about-section about-committee">
                <div className="container">
                    <div className="about-section-header">
                        <span className="about-label">LEADERSHIP</span>
                        <h2 className="about-section-title bn-text">কমিটি / নেতৃত্ব</h2>
                        <p className="about-section-subtitle bn-text">
                            তিতাসের কার্যনির্বাহী কমিটির প্রধান নেতৃবৃন্দ
                        </p>
                    </div>

                    <div className="about-leaders-showcase">
                        {LEADERS.map((leader, i) => (
                            <div key={i} className={`about-leader-hero ${i % 2 !== 0 ? 'reverse' : ''}`}>
                                <div className="about-leader-photo-section">
                                    <img src={leader.photo} alt={leader.nameEn} className="about-leader-cutout" />
                                </div>
                                <div className="about-leader-content">
                                    <span className="about-leader-role-tag">
                                        {leader.roleEn}
                                    </span>
                                    <h3 className="about-leader-name bn-text">{leader.name}</h3>
                                    <p className="about-leader-name-en">{leader.nameEn}</p>
                                    <div className="about-leader-meta">
                                        <div className="about-leader-meta-item">
                                            <GraduationCap size={16} />
                                            <span className="bn-text">{leader.department}</span>
                                        </div>
                                        <div className="about-leader-meta-item">
                                            <Calendar size={16} />
                                            <span className="bn-text">সেশন: {leader.session}</span>
                                        </div>
                                        <div className="about-leader-meta-item">
                                            <Mail size={16} />
                                            <span>{leader.email}</span>
                                        </div>
                                    </div>
                                    <div className="about-leader-quote">
                                        <Quote size={24} className="about-leader-quote-mark" />
                                        <p className="bn-text">{leader.message}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </AnimatedSection>

            {/* ═══════ 6. STATS ═══════ */}
            <section className="about-section about-stats-section">
                <div className="container">
                    <div className="about-section-header">
                        <span className="about-label light">BY THE NUMBERS</span>
                        <h2 className="about-section-title bn-text" style={{ color: '#fff' }}>সংখ্যায় তিতাস</h2>
                    </div>
                    <div className="about-stats-grid">
                        {STATS.map((stat, i) => (
                            <StatCounter key={i} {...stat} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════ 7. TIMELINE ═══════ */}
            <AnimatedSection className="about-section about-timeline">
                <div className="container">
                    <div className="about-section-header">
                        <span className="about-label">OUR JOURNEY</span>
                        <h2 className="about-section-title bn-text">আমাদের ইতিহাস</h2>
                        <p className="about-section-subtitle bn-text">
                            একটি ফেসবুক গ্রুপ থেকে পূর্ণাঙ্গ সংগঠনে রূপান্তরের যাত্রা
                        </p>
                    </div>
                    <div className="about-timeline-wrapper">
                        {TIMELINE.map((item, i) => (
                            <div key={i} className={`about-timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
                                <div className="about-timeline-dot" />
                                <div className="about-timeline-card">
                                    <span className="about-timeline-year">{item.year}</span>
                                    <h4 className="bn-text">{item.title}</h4>
                                    <p className="bn-text">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                        <div className="about-timeline-line" />
                    </div>
                </div>
            </AnimatedSection>

            {/* ═══════ 8. CONSTITUTION ═══════ */}
            <AnimatedSection className="about-section about-constitution">
                <div className="container">
                    <div className="about-constitution-box">
                        <div className="about-constitution-content">
                            <ScrollText size={40} className="about-constitution-icon" />
                            <h3 className="bn-text">গঠনতন্ত্র</h3>
                            <p className="bn-text">
                                তিতাসের গঠনতন্ত্রে সংগঠনের কাঠামো, নিয়মাবলী ও গণতান্ত্রিক প্রক্রিয়া বিস্তারিত
                                আলোচনা করা হয়েছে। সংগঠনের সকল কার্যক্রম এই গঠনতন্ত্র অনুযায়ী পরিচালিত হয়।
                            </p>
                            <Link href="/constitution" className="about-constitution-btn">
                                <ScrollText size={18} />
                                <span className="bn-text">গঠনতন্ত্র দেখুন</span>
                                <span className="about-sep">|</span>
                                <span>View Constitution</span>
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* ═══════ 9. CONTACT CTA ═══════ */}
            <AnimatedSection className="about-section about-cta">
                <div className="container">
                    <div className="about-cta-inner">
                        <h2 className="bn-text">আমাদের সাথে যুক্ত হোন</h2>
                        <p className="bn-text">
                            আপনি যদি ঢাকা বিশ্ববিদ্যালয়ে অধ্যয়নরত ব্রাহ্মণবাড়িয়া জেলার শিক্ষার্থী হন,
                            তাহলে আজই তিতাসে যোগ দিন এবং আমাদের কার্যক্রমে অংশগ্রহণ করুন।
                        </p>
                        <div className="about-cta-buttons">
                            <Link href="/register" className="about-cta-btn primary">
                                <Users size={18} />
                                <span className="bn-text">সদস্য হোন</span>
                            </Link>
                            <Link href="/contact" className="about-cta-btn secondary">
                                <Mail size={18} />
                                <span className="bn-text">যোগাযোগ করুন</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </AnimatedSection>
        </>
    );
}

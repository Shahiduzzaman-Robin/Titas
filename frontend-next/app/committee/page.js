import { GraduationCap, Calendar, Mail, Quote } from 'lucide-react';
import Image from 'next/image';

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
        message: 'তিতাস এমন একটি প্রাঙ্গণ যেখানে মেধা, মনন এবং ভ্রাতৃত্ববোধ একই সুতোয় গাঁথা। আমাদের এই পরিবার ঢাকা বিশ্ববিদ্যালয়ে অধ্যয়নরত ব্রাহ্মণবাড়িয়ার সকল শিক্ষার্থীর কল্যাণে কাজ করে যাচ্ছে।',
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
        message: 'তিতাস শুধু একটি নাম নয়, এটি আমাদের আবেগ, ভালোবাসা এবং ঐক্যের প্রতীক। আসুন কাঁধে কাঁধ মিলিয়ে ব্রাহ্মণবাড়িয়ার মুখ উজ্জ্বল করি পৃথিবীর সবখানে।',
    },
];

export const metadata = {
    title: 'কার্যনির্বাহী কমিটি | Titas - Dhaka University',
    description: 'তিতাস- ঢাকা বিশ্ববিদ্যালয়স্থ ব্রাহ্মণবাড়িয়া জেলা ছাত্রকল্যাণ পরিষদের কার্যনির্বাহী কমিটি ২০২৫-২৬।',
};

export default function CommitteePage() {
    return (
        <div className="container" style={{ padding: '5rem 1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <span style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '700', 
                    color: '#3b82f6', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.1em',
                    marginBottom: '0.5rem',
                    display: 'block'
                }}>Leadership</span>
                <h1 className="bn-text" style={{ fontSize: '2.5rem', color: '#0f172a' }}>কার্যনির্বাহী কমিটি ২০২৫-২৬</h1>
                <div style={{ width: '60px', height: '4px', background: '#3b82f6', margin: '1.5rem auto', borderRadius: '2px' }}></div>
            </div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                gap: '3rem', 
                maxWidth: '1000px', 
                margin: '0 auto' 
            }}>
                {LEADERS.map((leader, i) => (
                    <div 
                        key={i} 
                        style={{ 
                            background: '#fff', 
                            borderRadius: '24px', 
                            overflow: 'hidden', 
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                            transition: 'transform 0.3s ease'
                        }}
                    >
                        <div style={{ 
                            height: '350px', 
                            position: 'relative', 
                            background: 'linear-gradient(to bottom, #f8fafc, #eff6ff)' 
                        }}>
                             <img 
                                src={leader.photo} 
                                alt={leader.nameEn} 
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'contain', 
                                    objectPosition: 'bottom' 
                                }} 
                            />
                        </div>
                        <div style={{ padding: '2rem', textAlign: 'center' }}>
                            <div style={{ 
                                display: 'inline-block', 
                                padding: '0.35rem 1rem', 
                                background: '#1e293b', 
                                color: '#fff', 
                                borderRadius: '999px', 
                                fontSize: '0.75rem', 
                                fontWeight: '700', 
                                textTransform: 'uppercase',
                                marginBottom: '1rem'
                            }}>
                                {leader.roleEn}
                            </div>
                            <h3 className="bn-text" style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '0.25rem' }}>{leader.name}</h3>
                            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem' }}>{leader.nameEn}</p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#475569' }}>
                                    <GraduationCap size={16} />
                                    <span className="bn-text">{leader.department}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#475569' }}>
                                    <Calendar size={16} />
                                    <span className="bn-text">সেশন: {leader.session}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#475569' }}>
                                    <Mail size={16} />
                                    <span>{leader.email}</span>
                                </div>
                            </div>

                            <div style={{ 
                                background: '#f8fafc', 
                                padding: '1.25rem', 
                                borderRadius: '16px', 
                                borderLeft: '4px solid #cbd5e1',
                                position: 'relative'
                            }}>
                                <Quote size={20} style={{ position: 'absolute', top: '-10px', left: '10px', color: '#cbd5e1', background: '#f8fafc', padding: '0 4px' }} />
                                <p className="bn-text" style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.7', fontStyle: 'italic' }}>
                                    {leader.message}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

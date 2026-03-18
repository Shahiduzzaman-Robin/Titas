import axios from 'axios';
import { AlertCircle, Calendar, ExternalLink } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export const metadata = {
    title: 'নোটিশ বোর্ড | Titas - Dhaka University',
    description: 'তিতাস- ঢাকা বিশ্ববিদ্যালয়স্থ ব্রাহ্মণবাড়িয়া জেলা ছাত্রকল্যাণ পরিষদের সর্বশেষ নোটিশ এবং আপডেটসমূহ।',
};

async function getNotices() {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/notices`);
        if (res.data.success) {
            return res.data.data;
        }
        return [];
    } catch (err) {
        console.error("Error fetching notices:", err);
        return [];
    }
}

export default async function NoticesPage() {
    const notices = await getNotices();

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('bn-BD', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    return (
        <div className="container" style={{ padding: '4rem 1rem', minHeight: '70vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="bn-text" style={{ fontSize: '2.5rem', color: '#0f172a', marginBottom: '1rem' }}>নোটিশ বোর্ড</h1>
                <p className="bn-text" style={{ color: '#64748b' }}>সংগঠনের সর্বশেষ তথ্য ও ঘোষণা জানতে নিয়মিত চোখ রাখুন।</p>
            </div>

            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                {notices.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {notices.map((notice) => (
                            <div 
                                key={notice._id} 
                                style={{ 
                                    background: '#fff', 
                                    border: '1px solid #e2e8f0', 
                                    borderRadius: '16px', 
                                    padding: '1.5rem',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    display: 'flex',
                                    gap: '1.5rem',
                                    alignItems: 'flex-start'
                                }}
                            >
                                <div style={{ 
                                    background: notice.priority === 'urgent' ? '#fee2e2' : '#eef2ff', 
                                    color: notice.priority === 'urgent' ? '#ef4444' : '#6366f1',
                                    padding: '0.75rem',
                                    borderRadius: '12px'
                                }}>
                                    {notice.priority === 'urgent' ? <AlertCircle size={24} /> : <Calendar size={24} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{formatDate(notice.createdAt)}</span>
                                        {notice.priority === 'new' && (
                                            <span style={{ 
                                                background: '#dcfce7', 
                                                color: '#16a34a', 
                                                fontSize: '0.75rem', 
                                                padding: '0.2rem 0.6rem', 
                                                borderRadius: '999px',
                                                fontWeight: 'bold'
                                            }}>New</span>
                                        )}
                                    </div>
                                    <h3 className="bn-text" style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '1rem', lineHeight: '1.6' }}>
                                        {notice.text}
                                    </h3>
                                    {notice.link && (
                                        <a 
                                            href={notice.link} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            style={{ 
                                                display: 'inline-flex', 
                                                alignItems: 'center', 
                                                gap: '0.5rem', 
                                                color: '#3b82f6', 
                                                fontSize: '0.875rem', 
                                                fontWeight: '600',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            আরও পড়ুন <ExternalLink size={16} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem', background: '#f8fafc', borderRadius: '20px' }}>
                        <p className="bn-text" style={{ color: '#64748b' }}>এই মুহূর্তে কোনো সচল নোটিশ নেই।</p>
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, UserCircle, Phone, Mail, MapPin, Building, BookOpen, Briefcase, Calendar, Droplets } from 'lucide-react';
import Image from 'next/image';
import CustomSelect from './CustomSelect';
import TrainAnimation from './TrainAnimation';
import { departmentOptions, sessionOptions, hallOptions, bloodGroupOptions, upazilaOptions } from '../lib/constants';

export default function StudentsClient({ initialStudents, initialFilters, apiBaseUrl }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [students, setStudents] = useState(initialStudents);
    const [filters, setFilters] = useState(initialFilters);

    // Update students when initialStudents (from server) change
    useEffect(() => {
        setStudents(initialStudents);
    }, [initialStudents]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);

        const params = new URLSearchParams(searchParams);
        if (value) params.set(name, value);
        else params.delete(name);

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    return (
        <div className="students-page">
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>

                {/* Header Area */}
                <div className="page-header flex-between" style={{ marginBottom: '2rem' }}>
                    <div className="title-group flex-center">
                        <h2 className="bn-text" style={{ fontSize: '1.5rem', margin: 0 }}>শিক্ষার্থী তালিকা</h2>
                        <div className="student-count badge bn-text">{students.length} জন</div>
                    </div>
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={(e) => {
                                const val = e.target.value;
                                setFilters(prev => ({ ...prev, search: val }));
                                // We might want to debounce this in a real app, but for now simple update
                                const params = new URLSearchParams(searchParams);
                                if (val) params.set('search', val);
                                else params.delete('search');
                                startTransition(() => {
                                    router.push(`${pathname}?${params.toString()}`);
                                });
                            }}
                            placeholder="নাম, ফোন ইত্যাদি দিয়ে খুঁজুন..."
                            className="bn-text search-input"
                        />
                    </div>
                </div>

                {/* Filters Area - Capsule Style */}
                <div className="filters-capsule">
                    <div className="filters-row">
                        <div className="filter-item dept-f">
                            <CustomSelect
                                name="department" value={filters.department} onChange={handleFilterChange}
                                options={departmentOptions} placeholder="সকল ডিপার্টমেন্ট" Icon={Building}
                            />
                        </div>
                        <div className="filter-item session-f">
                            <CustomSelect
                                name="session" value={filters.session} onChange={handleFilterChange}
                                options={sessionOptions} placeholder="সকল সেশন" Icon={Calendar}
                            />
                        </div>
                        <div className="filter-item hall-f">
                            <CustomSelect
                                name="hall" value={filters.hall} onChange={handleFilterChange}
                                options={hallOptions} placeholder="সকল হল" Icon={MapPin}
                            />
                        </div>
                        <div className="filter-item blood-f">
                            <CustomSelect
                                name="bloodGroup" value={filters.bloodGroup} onChange={handleFilterChange}
                                options={bloodGroupOptions} placeholder="রক্তের গ্রুপ" Icon={Droplets}
                            />
                        </div>
                        <div className="filter-item upazila-f">
                            <CustomSelect
                                name="upazila" value={filters.upazila} onChange={handleFilterChange}
                                options={upazilaOptions} placeholder="সকল উপজেলা" Icon={MapPin}
                            />
                        </div>
                        <div className="filter-train-container">
                            <TrainAnimation className="filter-train" />
                        </div>
                    </div>
                </div>

                {/* Student Grid */}
                <div className={`student-grid ${isPending ? 'opacity-50' : ''}`}>
                    {students.map(student => (
                        <div key={student._id} className="student-card card">

                            {/* Card Header Profile */}
                            <div className="card-profile">
                                {student.photo ? (
                                    <div style={{ position: 'relative', width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden' }}>
                                        <Image 
                                            src={`${apiBaseUrl}${student.photo}`} 
                                            alt={student.nameBn} 
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                ) : (
                                    <div className="profile-placeholder bg-gray">
                                        <UserCircle size={48} className="text-gray" />
                                    </div>
                                )}

                                <div className="profile-info">
                                    <h3 className="bn-text">{student.nameBn}</h3>
                                    <div className="profile-meta flex-center">
                                        <span className="id-badge bn-text">ID: {student.originalId || (student.regNo || '').slice(-4)}</span>
                                        <span className="session-text bn-text">| {student.session}</span>
                                    </div>
                                </div>

                                <div className="blood-badge">
                                    <span className="drop-icon">🩸</span>
                                    {student.bloodGroup}
                                </div>
                            </div>

                            {/* Card Details */}
                            <div className="card-details">
                                {student.isEmployed && student.jobTitle && (
                                    <div className="detail-item role-item">
                                        <Briefcase size={16} className="text-blue" />
                                        <div>
                                            <div className="primary-text bn-text">{student.jobTitle}</div>
                                            {student.organization && (
                                                <div className="secondary-text bn-text">{student.organization}</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div className="detail-item">
                                    <BookOpen size={16} className="text-muted" />
                                    <span className="bn-text">{student.department}</span>
                                </div>
                                <div className="detail-item">
                                    <Building size={16} className="text-muted" />
                                    <span className="bn-text">{student.hall}</span>
                                </div>
                                <div className="detail-item">
                                    <MapPin size={16} className="text-muted" />
                                    <span className="bn-text">{student.upazila}, ব্রাহ্মণবাড়িয়া</span>
                                </div>
                            </div>

                            {/* Contact Footer */}
                            <div className="card-contact">
                                <div className="contact-item">
                                    <Phone size={14} className="text-muted" />
                                    <span className="en-text">{student.mobileMasked}</span>
                                </div>
                                <div className="contact-item">
                                    <Mail size={14} className="text-muted" />
                                    <span className="en-text">{student.email}</span>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

                {students.length === 0 && (
                    <div className="text-center" style={{ padding: '4rem 0', color: 'var(--text-muted)' }}>
                        <p className="bn-text">কোনো শিক্ষার্থী পাওয়া যায়নি।</p>
                    </div>
                )}

            </div>
        </div>
    );
}

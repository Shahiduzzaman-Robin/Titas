import { useState, useEffect } from 'react';
import { Search, UserCircle, Phone, Mail, MapPin, Building, BookOpen, Briefcase, Calendar, Droplets } from 'lucide-react';
import axios from 'axios';
import CustomSelect from '../components/CustomSelect';
import TrainAnimation from '../components/TrainAnimation';
import { departmentOptions, sessionOptions, hallOptions, bloodGroupOptions, upazilaOptions, API_BASE_URL } from '../constants';
import '../styles/Students.css';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        department: '',
        session: '',
        hall: '',
        bloodGroup: '',
        upazila: '',
    });

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const res = await axios.get(`${API_BASE_URL}/api/students?${queryParams}`);
            setStudents(res.data);
        } catch (err) {
            console.error('Error fetching students:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
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
                            onChange={handleFilterChange}
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
                {loading ? (
                    <div className="text-center" style={{ padding: '4rem 0' }}>লোডিং...</div>
                ) : (
                    <div className="student-grid">
                        {students.map(student => (
                            <div key={student._id} className="student-card card">

                                {/* Card Header Profile */}
                                <div className="card-profile">
                                    {student.photo ? (
                                        <img src={`${API_BASE_URL}${student.photo}`} alt={student.nameBn} className="profile-img" />
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
                )}

                {!loading && students.length === 0 && (
                    <div className="text-center" style={{ padding: '4rem 0', color: 'var(--text-muted)' }}>
                        <p className="bn-text">কোনো শিক্ষার্থী পাওয়া যায়নি।</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Students;

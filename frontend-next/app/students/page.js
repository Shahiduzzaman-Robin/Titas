import axios from 'axios';
import StudentsClient from '../../components/StudentsClient';
import '../../styles/Students.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export const metadata = {
    title: 'Students Directory | Titas Community Hub',
    description: 'Connect with fellow students and alumni from Brahmanbaria studying at Dhaka University.',
};

export default async function StudentsPage({ searchParams }) {
    const params = await searchParams;
    const filters = {
        search: params.search || '',
        department: params.department || '',
        session: params.session || '',
        hall: params.hall || '',
        bloodGroup: params.bloodGroup || '',
        upazila: params.upazila || '',
    };

    let students = [];
    try {
        const queryParams = new URLSearchParams(filters).toString();
        const res = await axios.get(`${API_BASE_URL}/api/students?${queryParams}`);
        students = res.data || [];
    } catch (err) {
        console.error('Error fetching students:', err);
    }

    return (
        <StudentsClient 
            initialStudents={students} 
            initialFilters={filters}
            apiBaseUrl={API_BASE_URL}
        />
    );
}

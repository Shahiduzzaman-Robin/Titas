import AdminStudentsClient from '../../../components/AdminStudentsClient';

export const metadata = {
    title: 'শিক্ষার্থী তালিকা | Titas - Admin',
    description: 'সকল নিবন্ধিত শিক্ষার্থীদের তথ্য ব্যবস্থাপনা।',
};

export default function AdminStudentsPage() {
    return <AdminStudentsClient />;
}

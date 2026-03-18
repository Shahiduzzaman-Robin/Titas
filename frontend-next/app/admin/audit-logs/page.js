import AdminAuditLogsClient from '../../../components/AdminAuditLogsClient';

export const metadata = {
    title: 'অডিট লগস | Titas - Admin',
    description: 'অ্যাডমিন প্যানেলে কে কোন কাজ করেছেন তার সম্পূর্ণ রেকর্ড।',
};

export default function AdminAuditLogsPage() {
    return <AdminAuditLogsClient />;
}

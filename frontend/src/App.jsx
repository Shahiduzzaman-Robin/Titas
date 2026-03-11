import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages placeholders
import Home from './pages/Home';
import Register from './pages/Register';
import Students from './pages/Students';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AdminDashboard from './pages/AdminDashboard';
import AdminStudents from './pages/AdminStudents';
import AdminStudentDetail from './pages/AdminStudentDetail';
import AdminEdits from './pages/AdminEdits';
import AdminBlog from './pages/AdminBlog';
import AdminMessages from './pages/AdminMessages';
import AdminNotices from './pages/AdminNotices';
import AdminGallery from './pages/AdminGallery';
import AdminEvents from './pages/AdminEvents';
import AdminAuditLogs from './pages/AdminAuditLogs';
import AdminNotifications from './pages/AdminNotifications';
import AdminBlogComments from './pages/AdminBlogComments';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';

const getAdminRole = () => {
    try {
        const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');
        return adminUser?.role || 'Admin';
    } catch (error) {
        return 'Admin';
    }
};

const RequireAdminAuth = ({ children, allowedRoles = null, fallback = '/admin/blog' }) => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
        const role = getAdminRole();
        if (!allowedRoles.includes(role)) {
            return <Navigate to={fallback} replace />;
        }
    }

    return children;
};

function App() {
    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/students" element={<Students />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:slug" element={<BlogPost />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/admin/dashboard" element={
                            <RequireAdminAuth allowedRoles={['Super Admin', 'Admin']}>
                                <AdminDashboard />
                            </RequireAdminAuth>
                        } />
                        <Route path="/admin/students" element={
                            <RequireAdminAuth allowedRoles={['Super Admin', 'Admin']}>
                                <AdminStudents />
                            </RequireAdminAuth>
                        } />
                        <Route path="/admin/students/:id" element={
                            <RequireAdminAuth allowedRoles={['Super Admin', 'Admin']}>
                                <AdminStudentDetail />
                            </RequireAdminAuth>
                        } />
                        <Route path="/admin/edits" element={
                            <RequireAdminAuth allowedRoles={['Super Admin', 'Admin']}>
                                <AdminEdits />
                            </RequireAdminAuth>
                        } />
                        <Route path="/admin/blog" element={
                            <RequireAdminAuth allowedRoles={['Super Admin', 'Admin', 'Content Admin']}>
                                <AdminBlog />
                                    <Route path="/admin/blog-comments" element={
                                        <RequireAdminAuth allowedRoles={['Super Admin', 'Admin', 'Content Admin']}>
                                            <AdminBlogComments />
                                        </RequireAdminAuth>
                                    } />
                            </RequireAdminAuth>
                        } />
                        <Route path="/admin/messages" element={
                            <RequireAdminAuth allowedRoles={['Super Admin', 'Admin']}>
                                <AdminMessages />
                            </RequireAdminAuth>
                        } />
                        <Route path="/admin/notices" element={
                            <RequireAdminAuth allowedRoles={['Super Admin', 'Admin', 'Content Admin']}>
                                <AdminNotices />
                            </RequireAdminAuth>
                        } />
                        <Route path="/admin/gallery" element={
                            <RequireAdminAuth allowedRoles={['Super Admin', 'Admin', 'Content Admin']}>
                                <AdminGallery />
                            </RequireAdminAuth>
                        } />
                        <Route path="/admin/events" element={
                            <RequireAdminAuth allowedRoles={['Super Admin', 'Admin', 'Content Admin']}>
                                <AdminEvents />
                            </RequireAdminAuth>
                        } />
                        <Route path="/admin/notifications" element={
                            <RequireAdminAuth allowedRoles={['Super Admin', 'Admin']}>
                                <AdminNotifications />
                            </RequireAdminAuth>
                        } />
                        <Route path="/admin/audit-logs" element={
                            <RequireAdminAuth allowedRoles={['Super Admin', 'Admin']}>
                                <AdminAuditLogs />
                            </RequireAdminAuth>
                        } />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;

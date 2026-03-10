import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe, User, LogOut, ChevronDown } from 'lucide-react';

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
import Contact from './pages/Contact';
import Navbar from './components/Navbar';

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
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/students" element={<AdminStudents />} />
                        <Route path="/admin/students/:id" element={<AdminStudentDetail />} />
                        <Route path="/admin/edits" element={<AdminEdits />} />
                        <Route path="/admin/blog" element={<AdminBlog />} />
                        <Route path="/admin/messages" element={<AdminMessages />} />
                        <Route path="/admin/notices" element={<AdminNotices />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;

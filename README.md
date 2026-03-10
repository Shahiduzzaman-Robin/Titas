# Titas DU Student Portal 🎓🇧🇩

A modern, high-performance community platform for the students of **Dhaka University** hailing from **Brahmanbaria** district (**Titas**). Built with the MERN stack and a focus on visual excellence and security.

## 🚀 Key Features

### 🏢 Student Directory
- **Searchable Database**: Quickly find fellow students by name, registration number, or phone.
- **Privacy First**: Implemented server-side masking for mobile numbers to protect student data.
- **Academic Profiles**: Detailed profiles including department, session, and hall information.

### ✍️ Dynamic Blog System
- **Editorial Experience**: Integrated a custom blog editor with dynamic image resizing and text-wrapping options.
- **Category Management**: Organize content by Announcements, Events, Alumni Stories, and more.
- **Social Integration**: Optimized Open Graph (OG) meta tags for beautiful social media previews (Facebook, WhatsApp, etc.).

### 📢 Active Notice Board
- **Emergency Ticker**: Real-time scrolling ticker for urgent announcements (Schedules, Admission help, Deadlines).
- **Admin CMS**: Dedicated interface for administrators to publish and manage notices with priority levels (New, Urgent, Normal).

### 🛠️ Admin Dashboard
- **Inbox System**: Manage student inquiries and contact form submissions.
- **Member Management**: Approve new registrations and verify student records.
- **Content Control**: Full CRUD capabilities for blogs and notices.

## 💻 Tech Stack

- **Frontend**: React (Vite), Lucide Icons, Vanilla CSS (Custom Design System).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Security**: JWT Authentication, BCrypt Password Hashing, Server-side data masking.

## 🛠️ Installation & Setup

1. **Clone the repo**:
   ```bash
   git clone https://github.com/Shahiduzzaman-Robin/Titas.git
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create a .env file with PORT, MONGO_URI, and JWT_SECRET
   npm start
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---
*Developed as part of the Titas DU Digital Transformation Project.*

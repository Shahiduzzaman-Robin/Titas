# 🌊 Titas Community Hub | পূর্ণাঙ্গ ডিজিটাল প্লাটফর্ম

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.x-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

**তিতাস (Titas)** is a premium, high-performance community management ecosystem designed for **Dhaka University students and alumni from Brahmanbaria**. Migrated from a legacy SPA to a modern **Next.js 15+ App Router** architecture, it offers lightning-fast performance, superior SEO, and a sophisticated admin infrastructure.

---

## ✨ Key Features & Visuals

### 🎡 Modern Cinematic Slider
A lightweight, high-performance custom carousel featuring **glassmorphism** controls, infinite seamless looping, and cinematic shadows.
![Homepage Hero & Slider](/Users/robin/.gemini/antigravity/brain/3f220bfb-c368-446a-9ec7-22e23bdbe554/homepage_hero_slider_1773799887722.png)

### 👥 Advanced Student Directory
A fully searchable and filterable directory with real-time API integration. Supports masked mobile numbers and privacy-first data handling.
![Students Directory](/Users/robin/.gemini/antigravity/brain/3f220bfb-c368-446a-9ec7-22e23bdbe554/students_directory_page_1773799920034.png)

### ✍️ Premium Blog Engine
Full-featured journalism platform with dynamic SEO meta tags, view counting, and a rich-text editor for administrators.
![Blog List](/Users/robin/.gemini/antigravity/brain/3f220bfb-c368-446a-9ec7-22e23bdbe554/blog_list_page_1773799911043.png)

### 📱 Superior Mobile Responsiveness
Every component is meticulously tuned for mobile viewports using `clamp()` typography and adaptive layouts.
````carousel
![Mobile Hero](/Users/robin/.gemini/antigravity/brain/3f220bfb-c368-446a-9ec7-22e23bdbe554/hero_mobile_390_attempt_1773798971562.png)
<!-- slide -->
![Mobile Filters](/Users/robin/.gemini/antigravity/brain/3f220bfb-c368-446a-9ec7-22e23bdbe554/students_mobile_view_extended_1773799522494.png)
<!-- slide -->
![Mobile Constitution](/Users/robin/.gemini/antigravity/brain/3f220bfb-c368-446a-9ec7-22e23bdbe554/constitution_mobile_view_1773799634101.png)
````

---

## 🛠 Tech Stack

### Frontend (Modern)
- **Framework**: Next.js 15+ (App Router)
- **State Management**: React 19 Hooks & Server Components
- **Typography**: Optimized local font delivery (SolaimanLipi, Hind Siliguri, Li Ador Noirrit)
- **Icons**: Lucide React
- **Styling**: Vanilla CSS3 + Modern CSS Variables (Theming)

### Backend (Robust)
- **Server**: Node.js & Express.js
- **Database**: MongoDB
- **Auth**: JWT-based Secure Authentication
- **Media**: Optimized image handling with `next/image`

---

## 📂 Project Structure

```bash
├── backend/                # Express API Server (Port 5010)
├── frontend-next/          # Modern Next.js Application (Port 3000)
│   ├── app/                # App Router (Pages, Layouts)
│   ├── components/         # Reusable UI Components
│   ├── public/             # Static Assets & Local Fonts
│   └── styles/             # Modular CSS System
└── legacy-react-frontend/  # Archived Original SPA
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18.x or higher
- MongoDB running locally or a remote URI

### 1. Backend Setup
```bash
cd backend
npm install
# Create a .env file based on .env.example
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend-next
npm install
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 🔒 Security & Performance
- **Hydration Safety**: Built-in protection against browser-extension-induced hydration mismatches.
- **Privacy**: Automated data masking for sensitive student contact information.
- **Speed**: Optimized LCP via `priority` loading and `next/image` conversion.

---
*Developed with ❤️ by the Titas DU Digital Transformation Team.*

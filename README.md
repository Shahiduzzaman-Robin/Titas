# Titas Community Hub (Next.js)

A complete community management system for Dhaka University students from Brahmanbaria, migrated to **Next.js 15+** for superior performance and SEO.

## Project Structure

- **frontend-next/**: The modern Next.js frontend using App Router and Server Components.
- **backend/**: The Node.js/Express API server (Port 5010).
- **legacy-react-frontend/**: The original React-Vite project (archived).

## Key Features

- **SEO Optimized**: Server-side rendering for blog posts and dynamic sitemap.
- **Admin Dashboard**: Comprehensive management for students, blogs, events, and notices.
- **Student Profiles**: Secure registration and profile management with privacy masking.
- **Responsive**: Fully optimized for mobile and desktop views.

## Quick Start

### 1. Start the Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Start the Next.js Frontend
```bash
cd frontend-next
npm install
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

## Build for Production
```bash
cd frontend-next
npm run build
npm start
```

## API Groups
- `/api/students`, `/api/blog`, `/api/admin`, `/api/events`, `/api/notices`

---
Developed for the Titas DU Digital Transformation.

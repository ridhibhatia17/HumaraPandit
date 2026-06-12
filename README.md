# AstroCRM 🌟

A full-stack role-based Astrologer CRM platform built for managing customers, astrologers (pandits), consultations, follow-ups, remedies, gemstone recommendations, reports, payments, and analytics.

---

## 🚀 Project Overview

AstroCRM is a comprehensive Customer Relationship Management system tailored specifically for astrological consultations. It bridges the gap between astrologers and users by providing a unified platform for managing appointments, spiritual remedies, and detailed astrological reports, while giving administrators complete oversight of the platform's operations.

## 🎯 Problem Statement

Managing astrological consultations traditionally involves fragmented tools for scheduling, payments, and maintaining user records. AstroCRM solves this by offering a centralized, secure, and user-friendly platform that handles the entire consultation lifecycle—from initial booking to follow-up remedies and analytics—ensuring a seamless experience for all roles involved.

---

## ✨ Features

### 🛡️ Admin Features
- Comprehensive dashboard with platform-wide analytics and revenue tracking.
- Manage Pandit profiles (approve, suspend, or verify astrologers).
- Oversee user accounts and monitor platform activity.
- View platform-wide consultation history and reports.
- Manage system settings and configurations.

### 🔮 Pandit Features
- Dedicated astrologer dashboard with upcoming consultations and earnings.
- Manage appointments and availability slots.
- Add follow-up recommendations, remedies, and gemstone suggestions for clients.
- Upload and share detailed astrological reports with customers.
- View individual consultation history and client details.

### 👤 Customer Features
- User-friendly portal to browse and book astrologers.
- View upcoming and past consultations.
- Access prescribed remedies, gemstone recommendations, and shared reports.
- Manage personal profile and track consultation status.

---


## 🏗️ System Architecture

AstroCRM follows a modern client-server architecture:
- **Frontend (Client):** Built with React and TypeScript, providing a responsive and interactive user interface. It utilizes React Router for navigation and state management, communicating with the backend via RESTful APIs.
- **Backend (Server):** Powered by Node.js and Express.js, handling business logic, user authentication, and data processing.
- **Database:** MongoDB serves as the primary NoSQL database, storing user profiles, consultation records, and analytics data securely.
- **Authentication:** JWT (JSON Web Tokens) are used for stateless, secure authentication, coupled with robust Role-Based Access Control (RBAC) to isolate features based on user roles (Admin, Pandit, Customer).

---

## 💻 Tech Stack

| Category | Technologies Used |
|----------|-------------------|
| **Frontend** | React, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion, React Router |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Authentication**| JWT, Role-Based Access Control (RBAC) |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 📁 Folder Structure

```text
AstroCRM/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components (Shadcn UI)
│   │   ├── pages/            # Role-specific views (Admin, Pandit, Customer)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API integration services
│   │   └── utils/            # Helper functions
│   └── package.json
├── backend/                  # Node.js backend application
│   ├── src/
│   │   ├── controllers/      # Route controllers (Business logic)
│   │   ├── models/           # MongoDB Mongoose schemas
│   │   ├── routes/           # API route definitions
│   │   ├── middleware/       # Auth, validation, and error handling
│   │   └── utils/            # Utilities and helpers
│   └── package.json
├── README.md                 # Project documentation
└── AI_USAGE.md               # AI Usage declaration
```

---

## 🛠️ Installation Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or Atlas URI)

### 1. Database Setup
Ensure you have a MongoDB cluster ready. Obtain your connection string.

### 2. Backend Setup
```bash
cd backend
npm install
# Configure environment variables (see below)
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Configure environment variables (see below)
npm run dev
```

### Environment Variables
Create a `.env` file in both `frontend` and `backend` directories.

**Backend (`backend/.env`):**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

**Frontend (`frontend/.env`):**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🔌 API Endpoints Overview

Here is a high-level overview of the RESTful APIs provided by the backend:

- **Authentication APIs:** `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- **Customer APIs:** `/api/customers/:id`, `/api/customers/appointments`
- **Pandit APIs:** `/api/pandits/:id`, `/api/pandits/availability`, `/api/pandits/earnings`
- **Consultation APIs:** `/api/consultations/book`, `/api/consultations/:id/remedies`, `/api/consultations/:id/reports`
- **Analytics APIs:** `/api/analytics/revenue`, `/api/analytics/users`

---

## 🔐 Security Features

- **JWT Authentication:** Secure, stateless session management.
- **Protected Routes:** Both frontend and backend restrict access based on authentication state.
- **Role-Based Access Control (RBAC):** Strict isolation of Admin, Pandit, and Customer privileges.
- **Input Validation:** Backend validation to prevent injection and ensure data integrity.

---

## 🚀 Future Improvements

- Integration of a payment gateway (e.g., Stripe or Razorpay) for automated consultation billing.
- Real-time chat and video/audio consultation capabilities using WebRTC/Socket.io.
- Automated email and SMS reminders for upcoming consultations.
- AI-driven personalized horoscope generation.

---

## 🌐 Deployment Guide

This project is optimized for deployment on Vercel and Render.

1. **Backend (Render):**
   - Connect your repository to Render as a Web Service.
   - Set the Root Directory to `backend`.
   - Add environment variables.
   - Deploy.

2. **Frontend (Vercel):**
   - Connect your repository to Vercel.
   - Set the Root Directory to `frontend`.
   - Add the `VITE_API_BASE_URL` pointing to your deployed Render backend URL.
   - Deploy.

## 🔗 Live Demo

**[View Live Application Here](#https://humara-pandit.vercel.app/)** 

---

## 👤 Author

Developed for the Humara Pandit Tech Intern Assignment.

## 📄 License

This project is licensed under the MIT License.

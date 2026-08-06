# 🏥 MediQueue AI — Smart Hospital Management System

> An industry-grade, AI-powered Hospital & Clinic Management Platform built with the MERN stack, Socket.IO real-time queues, and Google Gemini AI.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit-6366f1?style=for-the-badge)](https://your-live-url.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-24292e?style=for-the-badge&logo=github)](https://github.com/yourusername/mediqueue-ai)

---

## 🚀 Features

### 👤 Patient Portal
- 📅 Smart appointment booking with real-time slot availability
- 🎫 Live OPD token queue tracking (Socket.IO)
- 🤖 AI Symptom Checker (Google Gemini) — triage & department recommendation
- 📋 Digital Medical History — appointments, prescriptions, bills
- 💊 View & download prescriptions

### 🩺 Doctor Portal
- 📊 Real-time patient queue management
- ✍️ Digital prescription writing with AI suggestions
- 🤖 AI-assisted medicine & dosage recommendations
- 📁 Patient EMR (Electronic Medical Records)
- 📈 Daily stats dashboard

### 🏥 Admin Portal
- 📊 Analytics dashboard with charts (Recharts)
- 👨‍⚕️ Doctor approval & management
- 👥 Patient management
- 💰 Revenue tracking & reporting
- 🏢 Department-wise statistics

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Redux Toolkit, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Real-time** | Socket.IO |
| **AI** | Google Gemini 2.0 Flash API |
| **Auth** | JWT + bcryptjs |
| **Styling** | Vanilla CSS (Glassmorphism, Dark Mode) |
| **Icons** | Lucide React |
| **Charts** | Recharts |

---

## 📁 Project Structure

```
mediqueue-ai/
├── server/                 # Node.js + Express Backend
│   ├── config/db.js        # MongoDB connection
│   ├── controllers/        # Business logic (7 controllers)
│   ├── middleware/         # Auth, error handling
│   ├── models/             # Mongoose schemas (5 models)
│   ├── routes/             # API routes (7 route files)
│   ├── services/           # Gemini AI service
│   ├── socket/             # Socket.IO queue handlers
│   └── server.js           # Express entry point
│
└── client/                 # React + Vite Frontend
    └── src/
        ├── api/            # Axios instance
        ├── components/     # Shared components
        ├── pages/
        │   ├── patient/    # Patient dashboard, booking, queue, AI checker
        │   ├── doctor/     # Doctor dashboard, queue, prescriptions
        │   └── admin/      # Admin dashboard, doctor management
        ├── socket/         # Socket.IO client
        └── store/          # Redux Toolkit slices
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free) — [mongodb.com/atlas](https://mongodb.com/atlas)
- Google Gemini API key (free) — [aistudio.google.com](https://aistudio.google.com)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/mediqueue-ai.git
cd mediqueue-ai
```

### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and Gemini API key
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```

### 4. Open in Browser
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

---

## 🔑 Environment Variables

Create `server/.env` with:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mediqueue
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 🤖 AI Features (Powered by Google Gemini 2.0 Flash)

1. **Symptom Triage** — Patient describes symptoms → AI returns urgency level (Emergency/Urgent/Routine) + recommended department + possible conditions
2. **Prescription Assistant** — Doctor enters diagnosis → AI suggests medicines, dosage, frequency, precautions
3. **AI Chatbot** — 24/7 assistant for hospital FAQs

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Patient registration |
| POST | `/api/auth/login` | Login (all roles) |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/appointments` | List appointments |
| POST | `/api/appointments` | Book appointment |
| GET | `/api/queue/doctor/:id` | Get doctor's queue |
| PUT | `/api/queue/token/:id/call` | Call next patient |
| POST | `/api/prescriptions` | Write prescription |
| POST | `/api/ai/symptom-check` | AI symptom analysis |
| POST | `/api/ai/prescription-assist` | AI prescription suggestions |
| GET | `/api/admin/stats` | Dashboard statistics |

---

## 🚀 Deployment

### Frontend → Vercel
```bash
cd client
npm run build
# Deploy dist/ folder to Vercel
```

### Backend → Render
1. Create new Web Service on [render.com](https://render.com)
2. Connect GitHub repository
3. Set environment variables
4. Deploy!

---

## 👨‍💻 Author

**Ashu** — Full Stack Developer

- Built with ❤️ using MERN Stack + Google Gemini AI
- Solves real-world healthcare digitization problem in India
- Aligned with SIH (Smart India Hackathon) MedTech themes

---

## 📄 License

MIT License — feel free to use for learning and portfolio purposes.

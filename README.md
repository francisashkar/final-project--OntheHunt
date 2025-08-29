# 🎯 OnTheHunt - AI-Powered Job Finder Platform

A modern job search platform built with React, Flask, and AI-powered features.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Python 3.8+
- MongoDB
- Git

### Install Dependencies
```bash
# Frontend
npm install

# Backend
cd backend
pip install Flask==3.0.0 Flask-CORS==4.0.0 pymongo==4.6.0 python-dotenv==1.0.0 Werkzeug==3.0.1 requests==2.31.0 Pillow==10.1.0 numpy==1.24.3 pandas==2.0.3 scikit-learn==1.3.0 python-dateutil==2.8.2

# AI Service
cd ../backend
npm install
```

### Run the Project
```bash
# Terminal 1: Frontend (React)
npm run dev

# Terminal 2: Backend (Flask)
cd backend
flask run

# Terminal 3: AI Service
cd backend
npm start
```

The app will be available at `http://localhost:8080`

## 🛠️ Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Flask, MongoDB
- **AI**: Custom AI service
- **Auth**: Firebase

## 📁 Project Structure
```
├── src/                 # React frontend
├── backend/            # Flask backend
├── add_jobs/          # Job data scripts
└── dist/              # Built frontend
```

## 🔧 Development
- Frontend runs on port 8080
- Backend runs on Flask default port
- AI service runs on its configured port

## 📝 License
MIT License

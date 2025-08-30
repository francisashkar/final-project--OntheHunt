# 🚀 OnTheHunt - AI-Powered Job Finder & Career Assistant

A modern, full-stack job search platform powered by AI that helps users find jobs, optimize resumes, and get personalized career advice.

## ✨ Features

### 🤖 AI-Powered Career Assistant
- **Intelligent Career Guidance** - Get personalized advice from GPT-4
- **Resume Analysis** - AI-powered resume optimization and feedback
- **Job Analysis** - Detailed insights into job postings and requirements
- **Interview Preparation** - Comprehensive interview guidance and mock scenarios
- **Skills Gap Analysis** - Identify areas for professional development

### 🔍 Job Search & Management
- **Smart Job Matching** - AI-powered job recommendations
- **Job Favorites** - Save and organize interesting positions
- **Advanced Search** - Filter by location, salary, experience level
- **Job Tracking** - Monitor application status and progress

### 🔐 User Authentication & Profiles
- **Firebase Authentication** - Secure sign-up/sign-in with Google & GitHub
- **User Profiles** - Customizable profiles with avatar uploads
- **Progress Tracking** - Monitor your job search journey
- **Data Persistence** - Your data syncs across devices

### 🎨 Modern UI/UX
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Dark/Light Themes** - Toggle between themes for your preference
- **Smooth Animations** - Beautiful interactions powered by Framer Motion
- **Accessible Components** - Built with Radix UI for accessibility

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Framer Motion** - Smooth animations and interactions

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **OpenAI API** - GPT-4 integration for AI features
- **CORS** - Cross-origin resource sharing

### Database & Services
- **Firebase** - Authentication, Firestore database
- **MongoDB** - Job data storage
- **Firebase Storage** - File uploads (profile images)

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd job-finder-factory-main
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 3. Environment Setup

#### Create Backend Environment File
Create a `.env` file in the `backend` folder:
```bash
cd backend
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
```

**Important**: Replace `your_openai_api_key_here` with your actual OpenAI API key.

#### Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and paste it in your `.env` file

### 4. Run the Project

#### Start Backend Server (Terminal 1)
```bash
cd backend
npm run dev
```
Keep this terminal running - your backend will start on port 3001.

#### Start Frontend Server (Terminal 2)
```bash
npm run dev
```
Your React app will start on port 5173.

### 5. Access Your Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 🔧 Available Scripts

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Scripts
```bash
cd backend
npm run dev          # Start with nodemon (auto-restart)
npm start            # Start production server
```

## 🌐 API Endpoints

### AI Features
- `POST /api/chat` - AI career advisor chat
- `POST /api/analyze-job` - Job posting analysis
- `POST /api/resume-feedback` - Resume optimization feedback
- `POST /api/interview-prep` - Interview preparation guidance

### Job Management
- `GET /api/jobs` - Fetch all jobs
- `GET /api/jobs/featured` - Get featured jobs
- `POST /api/jobs` - Create new job posting

### User Management
- `POST /api/upload-profile-image` - Upload user avatar
- `GET /api/profile-image/:userId` - Get user profile image
- `DELETE /api/delete-profile-image` - Remove profile image

### Health & Testing
- `GET /api/health` - Server health check
- `POST /api/test` - Test OpenAI integration

## 🔐 Environment Variables

### Required Environment Variables
```env
# Backend (.env file)
OPENAI_API_KEY=sk-your-actual-api-key-here

# Frontend (.env.local file - optional)
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
```

## 🚨 Troubleshooting

### Common Issues

#### 1. "OPENAI_API_KEY environment variable is missing"
- Check that your `.env` file exists in the `backend` folder
- Verify the API key format: `OPENAI_API_KEY=sk-...`
- Restart your backend server after making changes

#### 2. "Module not found" errors
- Run `npm install` in both root and backend folders
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

#### 3. Port already in use
- Change ports in your configuration files
- Kill processes using the ports: `npx kill-port 3001 5173`

#### 4. CORS errors
- Ensure your backend is running on port 3001
- Check that CORS is properly configured in `server.js`

### Getting Help
- Check the console for error messages
- Verify all environment variables are set
- Ensure both frontend and backend servers are running

## 📱 Features in Detail

### AI Career Assistant
The AI assistant uses GPT-4 to provide:
- **Personalized career advice** based on your background
- **Resume optimization** with specific improvement suggestions
- **Job analysis** highlighting requirements and opportunities
- **Interview preparation** with common questions and strategies
- **Skills development** recommendations for career growth

### Job Search Engine
- **Smart filtering** by location, salary, experience, and skills
- **AI-powered matching** based on your profile and preferences
- **Job tracking** to monitor your application progress
- **Favorite system** to save interesting positions

### User Experience
- **Responsive design** that works on all devices
- **Dark/light themes** for comfortable viewing
- **Smooth animations** for engaging interactions
- **Accessibility features** for inclusive design

## 🔒 Security Features

- **Environment variables** for sensitive API keys
- **Firebase authentication** with secure user management
- **CORS protection** for secure API communication
- **Input validation** to prevent malicious requests

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
```
Deploy the `dist` folder to your hosting service (Netlify, Vercel, etc.)

### Backend Deployment
```bash
cd backend
npm run build
npm start
```
Deploy to services like Heroku, Railway, or DigitalOcean.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit: `git commit -m 'Add feature'`
5. Push: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 API access
- **Firebase** for authentication and database services
- **shadcn/ui** for beautiful UI components
- **Tailwind CSS** for utility-first styling
- **Vite** for fast development experience

## 📞 Support

If you encounter any issues or have questions:
- Check the troubleshooting section above
- Review the console logs for error messages
- Ensure all dependencies are properly installed
- Verify environment variables are correctly set

---

**Happy job hunting! 🎯**

Built with ❤️ using modern web technologies and AI-powered insights.

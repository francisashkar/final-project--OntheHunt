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
pip install flask flask-cors pymongo openai
### 3. Environment Setup
for openapi key please contact us!

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

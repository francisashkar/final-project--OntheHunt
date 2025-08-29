# Firebase Setup Guide

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "onthehunt-job-finder")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project, click on "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Click "Enable" and save
   - **Google**: Click "Enable", add your support email, and save
   - **GitHub**: Click "Enable", add your GitHub OAuth app details, and save

## 3. Get Your Firebase Config

1. In your Firebase project, click on the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "OnTheHunt Web App")
6. Copy the Firebase configuration object

## 4. Update Your Firebase Config

1. Open `src/lib/firebase.ts`
2. Replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-actual-messaging-sender-id",
  appId: "your-actual-app-id"
};
```

## 5. Install Dependencies

Run this command in your project directory:

```bash
npm install
```

## 6. Test the Authentication

1. Start your development server: `npm run dev`
2. Go to `/signup` to create a new account
3. Go to `/signin` to sign in with existing credentials
4. Try social login with Google or GitHub

## 7. GitHub OAuth Setup (Optional)

If you want to enable GitHub authentication:

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set Application name: "OnTheHunt"
4. Set Homepage URL: `http://localhost:8080`
5. Set Authorization callback URL: `http://localhost:8080`
6. Copy the Client ID and Client Secret
7. Add them to Firebase GitHub provider settings

## 8. Google OAuth Setup (Optional)

Google OAuth should work automatically with Firebase, but if you encounter issues:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to "APIs & Services" > "Credentials"
4. Make sure the OAuth 2.0 Client IDs are properly configured

## Troubleshooting

- **"Firebase App named '[DEFAULT]' already exists"**: This usually means Firebase is already initialized elsewhere
- **"auth/unauthorized-domain"**: Add your domain to Firebase Authentication > Settings > Authorized domains
- **"auth/popup-closed-by-user"**: User closed the popup before completing authentication
- **"auth/network-request-failed"**: Check your internet connection and Firebase project status

## Security Rules

For production, make sure to:
1. Set up proper Firestore security rules
2. Configure authorized domains in Firebase Authentication
3. Set up proper CORS policies if needed
4. Use environment variables for sensitive config values

## Environment Variables (Recommended)

For better security, create a `.env.local` file:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Then update `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

Don't forget to add `.env.local` to your `.gitignore` file!

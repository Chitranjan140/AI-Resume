# Firebase Setup Instructions

## Fix: Firebase Error (auth/operation-not-allowed)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Sign-in method**
4. Enable these providers:
   - **Email/Password** - Click and toggle "Enable"
   - **Google** - Click, toggle "Enable", add your email as authorized domain

## Quick Setup:
1. Create new Firebase project at https://console.firebase.google.com/
2. Enable Authentication → Sign-in method → Email/Password + Google
3. Get config from Project Settings → General → Your apps
4. Update `.env.local` with your Firebase config

## Required Environment Variables:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```
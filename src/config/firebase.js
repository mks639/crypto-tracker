import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// Check if Firebase is configured
const isFirebaseConfigured = () => {
  return process.env.REACT_APP_FIREBASE_API_KEY && 
         process.env.REACT_APP_FIREBASE_API_KEY.startsWith('AIzaSy') &&
         process.env.REACT_APP_FIREBASE_PROJECT_ID &&
         process.env.REACT_APP_FIREBASE_PROJECT_ID !== 'crypto-dashboard-demo';
};

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase only if properly configured
let app = null;
let auth = null;
let db = null;
let realtimeDb = null;
let googleProvider = null;

if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    realtimeDb = getDatabase(app);
    googleProvider = new GoogleAuthProvider();
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.warn('Firebase initialization failed:', error.message);
  }
} else {
  console.warn('Firebase not configured properly - using localStorage only');
}

export { auth, db, realtimeDb, googleProvider };
export default app;
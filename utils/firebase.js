import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  getRedirectResult
} from 'firebase/auth';

/**
 * Firebase configuration object
 * Values are loaded from environment variables
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase app
let app;
let auth;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  
  // Log successful initialization
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  
  // Create fallback app object if Firebase fails to initialize
  // This prevents runtime errors in the app if Firebase is misconfigured
  if (!app) {
    console.warn('Using Firebase fallback');
    
    // This is just to prevent runtime errors - authentication won't work
    // until Firebase is properly configured
    auth = {
      currentUser: null,
      onAuthStateChanged: (callback) => {
        callback(null);
        return () => {};
      }
    };
  }
}

// Create and configure Google provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account' // Force account selection even when one account is available
});

// Export Firebase authentication objects and methods
export {
  app,
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  sendPasswordResetEmail,
  firebaseSignOut,
  GoogleAuthProvider
};
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  onAuthStateChanged,
  firebaseSignOut 
} from '../utils/firebase';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

// Create auth context
const AuthContext = createContext();

// Auth context provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // User registration with Firebase and API
  const signup = async (userData) => {
    try {
      setLoading(true);
      // First create the user in Firebase Auth
      const { email, password, first_name, last_name, certification_target } = userData;
      
      const firebaseResponse = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = firebaseResponse.user;
      
      // After Firebase auth is successful, register user with the API
      const apiResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/b/manage_user/users`, 
        {
          first_name,
          last_name,
          email,
          certification_target,
          password
        }
      );
      
      // Get the user token and set in cookies
      const token = await firebaseUser.getIdToken();
      Cookies.set('auth_token', token, { expires: 7 }); // expires in 7 days
      
      // Set user in state and redirect to dashboard
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: `${first_name} ${last_name}`,
        apiData: apiResponse.data,
      });
      
      toast.success('Account created successfully!');
      router.push('/dashboard');
      return apiResponse.data;
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error(error.message || 'Failed to create account. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // User login with Firebase
  const login = async (email, password) => {
    try {
      setLoading(true);
      const firebaseResponse = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = firebaseResponse.user;
      
      // Get the user token and set in cookies
      const token = await firebaseUser.getIdToken();
      Cookies.set('auth_token', token, { expires: 7 }); // expires in 7 days
      
      toast.success('Logged in successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error(error.message || 'Failed to log in. Please check your credentials.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google sign-in with Firebase
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Get the user token and set in cookies
      const token = await user.getIdToken();
      Cookies.set('auth_token', token, { expires: 7 }); // expires in 7 days
      
      toast.success('Logged in with Google successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error(error.message || 'Failed to log in with Google. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // User logout
  const logout = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      Cookies.remove('auth_token');
      setUser(null);
      toast.success('Logged out successfully!');
      router.push('/');
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error(error.message || 'Failed to log out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Check authentication state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in
        try {
          // Get the user token and set in cookies
          const token = await firebaseUser.getIdToken();
          Cookies.set('auth_token', token, { expires: 7 });
          
          // Set user in state
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email,
            photoURL: firebaseUser.photoURL,
          });
        } catch (error) {
          console.error("Error setting user:", error);
        }
      } else {
        // User is not logged in
        Cookies.remove('auth_token');
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Auth context value
  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}
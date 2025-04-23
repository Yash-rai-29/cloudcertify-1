import { createContext, useContext, useState, useEffect } from "react";
import {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  firebaseSignOut,
} from "../utils/firebase";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

// Create auth context
const AuthContext = createContext();

// Auth context provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // User registration with both Firebase Auth and external API
  const signup = async (userData) => {
    try {
      setLoading(true);
      const { email, password, first_name, last_name, certification_target } =
        userData;

      const certificationMapping = {
        "associate-cloud-engineer": "Google Cloud Certified - Cloud Engineer",
        "professional-cloud-architect":
          "Google Cloud Certified - Professional Cloud Architect",
        "professional-data-engineer":
          "Google Cloud Certified - Professional Data Engineer",
        "professional-cloud-developer":
          "Google Cloud Certified - Professional Cloud Developer",
        "professional-cloud-devops-engineer":
          "Google Cloud Certified - Professional DevOps Engineer",
        "professional-cloud-security-engineer":
          "Google Cloud Certified - Professional Security Engineer",
        "professional-cloud-network-engineer":
          "Google Cloud Certified - Professional Network Engineer",
        "professional-machine-learning-engineer":
          "Google Cloud Certified - Professional ML Engineer",
      };

      const mappedCertification =
        certificationMapping[certification_target] || "Other";

      // Step 1: Create user via external API
      const response = await axios.post(
        "https://base-service-6070296894.us-central1.run.app/b/manage_user/users",
        {
          first_name,
          last_name,
          email,
          password,
          certification_target: mappedCertification,
        },
      );

      const responseData = response.data;

      const userDataForStorage = {
        uid: responseData.uid,
        uuid: responseData.uuid,
        email: responseData.email,
        displayName: responseData.full_name,
        firstName: responseData.first_name,
        lastName: responseData.last_name,
        certificationTarget: certification_target,
        mappedCertification: responseData.certification_target,
        createdAt: new Date(responseData.created_at).toISOString(),
      };

      localStorage.setItem(
        `user_${responseData.uid}`,
        JSON.stringify(userDataForStorage),
      );

      // ✅ Step 2: Auto login with Firebase using same email/password
      const firebaseUser = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const idToken = await firebaseUser.user.getIdToken();

      // ✅ Step 3: Store Firebase access token
      Cookies.set("auth_token", idToken, { expires: 7 });

      // Set user in state
      setUser({
        uid: responseData.uid,
        uuid: responseData.uuid,
        email: responseData.email,
        displayName: responseData.full_name,
        photoURL: responseData.avatar_url,
        certificationTarget: certification_target,
        firstName: responseData.first_name,
        lastName: responseData.last_name,
      });

      toast.success("Account created successfully!");
      router.push("/dashboard");
      return userDataForStorage;
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create account. Please try again.",
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // User login with Firebase
  const login = async (email, password) => {
    try {
      setLoading(true);
      const firebaseResponse = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const firebaseUser = firebaseResponse.user;

      // Get the user token and set in cookies
      const token = await firebaseUser.getIdToken();
      Cookies.set("auth_token", token, { expires: 7 }); // expires in 7 days

      toast.success("Logged in successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error(
        error.message || "Failed to log in. Please check your credentials.",
      );
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
      Cookies.set("auth_token", token, { expires: 7 }); // expires in 7 days

      toast.success("Logged in with Google successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error(
        error.message || "Failed to log in with Google. Please try again.",
      );
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
      Cookies.remove("auth_token");
      setUser(null);
      toast.success("Logged out successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error(error.message || "Failed to log out. Please try again.");
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
          Cookies.set("auth_token", token, { expires: 7 });

          // Try to get additional user data from localStorage
          let additionalData = {};
          try {
            const storedData = localStorage.getItem(`user_${firebaseUser.uid}`);
            if (storedData) {
              const parsedData = JSON.parse(storedData);
              additionalData = {
                certificationTarget: parsedData.certificationTarget,
                firstName: parsedData.firstName,
                lastName: parsedData.lastName,
              };
            }
          } catch (localStorageError) {
            console.error(
              "Error getting data from localStorage:",
              localStorageError,
            );
          }

          // Set user in state with combined data
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            ...additionalData,
          });
        } catch (error) {
          console.error("Error setting user:", error);
        }
      } else {
        // User is not logged in
        Cookies.remove("auth_token");
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}
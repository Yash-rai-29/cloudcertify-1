import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getUserInfo } from '../utils/services/dashboardService';
import { useAuth } from './AuthContext';

// Create the context
const UserProfileContext = createContext();

/**
 * Provider component for the user profile data
 * This ensures user data is loaded only once and shared across components
 */
export function UserProfileProvider({ children }) {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  // First try to load from sessionStorage to prevent flicker during navigation
  useEffect(() => {
    // Try to get cached data immediately to prevent UI flicker
    if (typeof window !== 'undefined') {
      try {
        const cachedData = sessionStorage.getItem('userProfileData');
        if (cachedData) {
          setUserInfo(JSON.parse(cachedData));
          setLastUpdated(new Date(sessionStorage.getItem('userProfileLastUpdated') || Date.now()));
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading cached user profile:", error);
      }
    }
  }, []);

  // Fetch user info only once when component mounts or when user auth changes
  useEffect(() => {
    if (user) {
      // Don't fetch if we already have data (from session storage) and it's recent (less than 5 minutes old)
      const cachedTime = sessionStorage.getItem('userProfileLastUpdated');
      const isCacheValid = cachedTime && 
        (new Date() - new Date(cachedTime)) < 15 * 60 * 1000 && // 15 minutes
        userInfo !== null;
      
      if (!isCacheValid) {
        fetchUserInfo();
      } else {
        setLoading(false);
      }
    } else {
      setUserInfo(null);
      setLoading(false);
      // Clear cached data when user logs out
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('userProfileData');
        sessionStorage.removeItem('userProfileLastUpdated');
      }
    }
  }, [user]);

  // Function to fetch user info
  const fetchUserInfo = async () => {
    setLoading(true);
    try {
      const response = await getUserInfo();
      if (response.success) {
        setUserInfo(response.data);
        setLastUpdated(new Date());
        
        // Store in sessionStorage to persist across page navigations
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('userProfileData', JSON.stringify(response.data));
          sessionStorage.setItem('userProfileLastUpdated', new Date().toISOString());
        }
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      
      // Try to get from sessionStorage if the API call fails
      if (typeof window !== 'undefined') {
        const cachedData = sessionStorage.getItem('userProfileData');
        if (cachedData) {
          setUserInfo(JSON.parse(cachedData));
          setLastUpdated(new Date(sessionStorage.getItem('userProfileLastUpdated')));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to manually refresh user data (for use after profile updates)
  const refreshUserInfo = () => {
    fetchUserInfo();
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    userInfo,
    loading,
    lastUpdated,
    refreshUserInfo
  }), [userInfo, loading, lastUpdated]);

  return (
    <UserProfileContext.Provider value={contextValue}>
      {children}
    </UserProfileContext.Provider>
  );
}

// Custom hook to use the user profile context
export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

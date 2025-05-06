import { useState, memo, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../contexts/UserProfileContext';
import { useLoading } from '../../contexts/LoadingContext';
import { getDailyStreak } from '../../utils/services/dashboardService';
import Avatar from '../ui/Avatar';
import { 
  IconBell, 
  IconChevronDown,
  IconSettings,
  IconLogout,
  IconMenu2,
  IconCloud,
  IconFlame
} from '@tabler/icons-react';

/**
 * Dashboard header component with profile dropdown and notifications
 * Memoized to prevent unnecessary re-renders during page transitions
 */
const DashboardHeader = memo(forwardRef(({ toggleSidebar, onToggleDailyQuiz }, ref) => {
  const { signOut } = useAuth();
  const { startLoading, stopLoading } = useLoading();
  const { userInfo, loading } = useUserProfile();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [streakData, setStreakData] = useState({ current_streak: 0 });
  const [fetchTrigger, setFetchTrigger] = useState(0);

  // Fetch streak data directly within the header
  const fetchStreakData = useCallback(async () => {
    try {
      const response = await getDailyStreak();
      if (response.success) {
        setStreakData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch streak data:", error);
    }
  }, []);

  // Fetch streak data on mount and whenever the fetchTrigger changes
  useEffect(() => {
    fetchStreakData();
  }, [fetchStreakData, fetchTrigger]);

  // Public method to trigger a streak data refresh
  const refreshStreakData = useCallback(() => {
    setFetchTrigger(prev => prev + 1);
  }, []);

  // Expose refreshStreakData method to parent components
  useImperativeHandle(ref, () => ({
    refreshStreakData
  }), [refreshStreakData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if clicking outside the dropdown
      if (profileDropdownOpen && !event.target.closest('.profile-dropdown-container')) {
        setProfileDropdownOpen(false);
      }
    };

    // Attach the event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  // Handle profile dropdown toggle
  const toggleProfileDropdown = (e) => {
    e.stopPropagation(); // Prevent event from bubbling to document
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  // Handle sign out
  const handleSignOut = async (e) => {
    // Prevent default action and stop propagation
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    try {
      setProfileDropdownOpen(false); // Close dropdown before starting the sign out process
      startLoading(); // Show loading indicator while signing out
      await signOut();
      // No need to handle redirects here as it's handled in the auth context
    } catch (error) {
      console.error("Sign out failed:", error);
      stopLoading();
    }
  };

  // Support Next.js image loading optimization
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <>
      {/* Combined Header for both mobile and desktop */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 w-full">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-2 sm:px-6">
          <button
            type="button"
            className="p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
            onClick={toggleSidebar}
          >
            <span className="sr-only">Open sidebar</span>
            <IconMenu2 className="h-6 w-6" />
          </button>
          <div className="flex items-center">
            <IconCloud className="h-6 w-6 text-blue-600 mr-2" />
            <span className="text-lg font-bold text-blue-600 relative">
              Cloud Certify
            </span>
          </div>
          
          {/* Mobile Header Actions */}
          <div className="flex items-center space-x-2">
            {/* Streak Counter */}
            {onToggleDailyQuiz && (
              <div className="flex items-center text-orange-500 mr-1" onClick={() => {
                refreshStreakData(); // Refresh streak data when clicked
                onToggleDailyQuiz();
              }}>
                <IconFlame className="h-5 w-5" />
                <span className="text-sm font-medium ml-1">{streakData.current_streak}</span>
              </div>
            )}
            
            {/* Notifications */}
            <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
              <IconBell size={20} />
            </button>

            {/* User profile photo on click open dropdown - Mobile */}
            <div className="relative profile-dropdown-container">
              <button
                className="flex items-center bg-gray-50 rounded-full overflow-hidden border border-gray-200 focus:outline-none"
                onClick={toggleProfileDropdown}
              >
                {!loading && userInfo?.photo_url ? (
                  <div className="h-8 w-8 rounded-full overflow-hidden">
                    <img
                      src={userInfo.photo_url}
                      alt="User Profile"
                      className={`h-full w-full object-cover transition-opacity duration-200 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={handleImageLoad}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '';
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = `<div class="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 font-medium">
                          ${userInfo?.first_name?.charAt(0) || userInfo?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </div>`;
                      }}
                    />
                  </div>
                ) : (
                  <Avatar
                    initials={
                      userInfo?.first_name?.charAt(0) ||
                      userInfo?.email?.charAt(0)?.toUpperCase() || 'U'
                    }
                    size="sm"
                  />
                )}
              </button>
              
              {/* Dropdown Menu - Mobile */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200" onClick={(e) => e.stopPropagation()}>
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-700">{userInfo?.first_name || "User"}</p>
                    <p className="text-xs text-gray-500 truncate">{userInfo?.email}</p>
                  </div>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfileDropdownOpen(false);
                    }}
                  >
                    <IconSettings size={16} className="mr-2" />
                    Settings
                  </Link>
                  <button
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={(e) => handleSignOut(e)}
                  >
                    <IconLogout size={16} className="mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between h-16 px-4 sm:px-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">
              {/* Placeholder for page title if needed */}
            </h1>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Streak Counter for Desktop */}
            {onToggleDailyQuiz && (
              <div className="flex items-center text-orange-500 cursor-pointer mr-4" 
                onClick={() => {
                  refreshStreakData(); // Refresh streak data when clicked
                  onToggleDailyQuiz();
                }}
              >
                <IconFlame className="h-5 w-5" />
                <span className="text-sm font-medium ml-1">{streakData.current_streak}</span>
              </div>
            )}
            
            {/* Notification Button */}
            <button className="p-2 text-gray-500 hover:text-gray-700 relative">
              <IconBell className="h-5 w-5" />
              {/* Notification indicator dot */}
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* User Profile Dropdown */}
            <div className="relative profile-dropdown-container">
              <button
                className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full focus:outline-none"
                onClick={toggleProfileDropdown}
              >
                {!loading && userInfo?.photo_url ? (
                  <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-200">
                    <img
                      src={userInfo.photo_url}
                      alt="User Profile"
                      className={`h-full w-full object-cover transition-opacity duration-200 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={handleImageLoad}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '';
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = `<div class="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 font-medium">
                          ${userInfo?.first_name?.charAt(0) || userInfo?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </div>`;
                      }}
                    />
                  </div>
                ) : (
                  <Avatar
                    initials={
                      userInfo?.first_name?.charAt(0) ||
                      userInfo?.email?.charAt(0)?.toUpperCase() || 'U'
                    }
                    size="sm"
                  />
                )}
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {userInfo?.first_name || userInfo?.email || 'User'}
                </span>
                <IconChevronDown size={16} className="text-gray-500" />
              </button>
              
              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200" onClick={(e) => e.stopPropagation()}>
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-700">{userInfo?.first_name || "User"}</p>
                    <p className="text-xs text-gray-500 truncate">{userInfo?.email}</p>
                  </div>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfileDropdownOpen(false);
                    }}
                  >
                    <IconSettings size={16} className="mr-2" />
                    Settings
                  </Link>
                  <button
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={(e) => handleSignOut(e)}
                  >
                    <IconLogout size={16} className="mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}));

// Set display name for debugging
DashboardHeader.displayName = 'DashboardHeader';

export default DashboardHeader;

import { useState, useEffect } from "react";
import Head from "next/head";
import { useAuth } from "../../contexts/AuthContext";
import ProtectedRoute from "../common/ProtectedRoute";
import Avatar from "../ui/Avatar";
import { 
  IconMenu2, 
  IconCloud, 
  IconBell, 
  IconChevronDown,
  IconSettings,
  IconLogout,
  IconFlame
} from "@tabler/icons-react";
import Link from "next/link";
import Sidebar from "./Sidebar";
import { getDailyStreak, getUserInfo } from "../../utils/services/dashboardService";
import DailyQuizModal from "../dashboard/DailyQuizModal";

/**
 * Dashboard layout component with sidebar navigation for authenticated users
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.title - Page title
 */
export default function DashboardLayout({ children, title = "Dashboard" }) {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [streakData, setStreakData] = useState({ current_streak: 0 });
  const [showDailyQuiz, setShowDailyQuiz] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  console.log("user data  ", user);
  // Fetch user streak data
  useEffect(() => {
    async function fetchStreakData() {
      try {
        const response = await getDailyStreak();
        if (response.success) {
          setStreakData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch streak data:", error);
      }
    }

    fetchStreakData();
  }, []);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await getUserInfo();
        if (response.success) {
          setUserInfo(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    }

    fetchUserInfo();
  }, []);

  console.log("user info  ", userInfo);

  useEffect(() => {
    // Get sidebar expanded state from localStorage on component mount
    const savedExpandedState = localStorage.getItem('sidebarExpanded');
    if (savedExpandedState !== null) {
      setSidebarExpanded(savedExpandedState === 'true');
    }
    
    // Listen for changes to localStorage and update state
    const handleStorageChange = () => {
      const currentState = localStorage.getItem('sidebarExpanded');
      if (currentState !== null) {
        setSidebarExpanded(currentState === 'true');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener for sidebar toggle from within the app
    const handleSidebarToggle = (e) => {
      setSidebarExpanded(e.detail.expanded);
    };
    
    window.addEventListener('sidebarToggle', handleSidebarToggle);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sidebarToggle', handleSidebarToggle);
    };
  }, []);

  // Handle profile dropdown toggle
  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
  };

  // Handle toggle daily quiz modal
  const toggleDailyQuiz = () => {
    setShowDailyQuiz(!showDailyQuiz);
  };

  // Update streak data after daily quiz submission
  const onQuizSubmit = (newStreakData) => {
    setStreakData(newStreakData);
  };

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  const closeSidebarOnMobileClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 relative">
        <Head>
          <title>{title} | Cloud Certify</title>
        </Head>

        {/* Sidebar Component */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          sidebarExpanded ? 'lg:pl-64' : 'lg:pl-20'
        }`}>
          {/* Mobile Top Navigation */}
          <div className="top-0 z-10 lg:hidden flex items-center justify-between bg-white px-4 py-2 border-b border-gray-200 sm:px-6 relative">
            <button
              type="button"
              className="p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
              onClick={() => setSidebarOpen(true)}
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
              <div className="flex items-center text-orange-500 mr-1" onClick={toggleDailyQuiz}>
                <IconFlame className="h-5 w-5" />
                <span className="text-sm font-medium ml-1">{streakData.current_streak}</span>
              </div>
              
              {/* Notifications */}
              <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                <IconBell size={20} />
              </button>
              
              {/* Avatar */}
              <div onClick={toggleProfileDropdown}>
                {userInfo?.photo_url ? (
                  <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-200">
                    <img
                      src={userInfo?.photo_url}
                      alt="User Profile"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '';
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = `<div class="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 font-medium">
                          ${userInfo?.full_name
                            ?.charAt(0) || userInfo?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </div>`;
                      }}
                    />
                  </div>
                ) : (
                  <Avatar
                    initials={
                      userInfo?.full_name
                      ?.charAt(0) ||
                      userInfo?.email?.charAt(0)?.toUpperCase()
                    }
                    size="sm"
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Desktop Header */}
          <div className="hidden lg:flex sticky top-0 z-10 items-center justify-end bg-white px-6 py-3 border-b border-gray-200">
            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Streak Counter */}
              <div 
                className="flex items-center text-orange-500 cursor-pointer hover:bg-orange-50 px-3 py-1.5 rounded-full"
                onClick={toggleDailyQuiz}
              >
                <IconFlame className="h-5 w-5" />
                <span className="text-sm font-medium ml-1">{streakData.current_streak}</span>
              </div>
              
              {/* Notifications */}
              <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 relative">
                <IconBell size={20} />
                {/* Notification indicator dot */}
                <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full focus:outline-none"
                  onClick={toggleProfileDropdown}
                >
                  {userInfo?.photo_url ? (
                    <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-200">
                      <img
                        src={userInfo?.photo_url}
                        alt="User Profile"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '';
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = `<div class="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 font-medium">
                            ${userInfo?.full_name?.charAt(0) || userInfo?.email?.charAt(0)?.toUpperCase() || 'U'}
                          </div>`;
                        }}
                      />
                    </div>
                  ) : (
                    <Avatar
                      initials={
                        userInfo?.full_name?.charAt(0) ||
                        userInfo?.email?.charAt(0)?.toUpperCase()
                      }
                      size="sm"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {userInfo?.full_name || userInfo?.email}
                  </span>
                  <IconChevronDown size={16} className="text-gray-500" />
                </button>
                
                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-700">{userInfo?.full_name || "User"}</p>
                      <p className="text-xs text-gray-500 truncate">{userInfo?.email}</p>
                    </div>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <IconSettings size={16} className="mr-2" />
                      Settings
                    </Link>
                    <button
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleSignOut}
                    >
                      <IconLogout size={16} className="mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Page Content with Title */}
          <main className="">{children}</main>
        </div>
        
        {/* Daily Quiz Modal */}
        {showDailyQuiz && (
          <DailyQuizModal 
            isOpen={showDailyQuiz} 
            onClose={toggleDailyQuiz}
            onSubmit={onQuizSubmit}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

/**
 * Helper function to wrap a page with the dashboard layout
 * @param {React.ReactNode} page - The page component to wrap
 * @param {string} pageTitle - The title for the page
 * @returns {React.ReactNode} - The wrapped page
 */
export const getDashboardLayout = (page, pageTitle) => (
  <DashboardLayout title={pageTitle}>{page}</DashboardLayout>
);

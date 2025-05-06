import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useAuth } from "../../contexts/AuthContext";
import ProtectedRoute from "../common/ProtectedRoute";
import DailyQuizModal from "../dashboard/DailyQuizModal";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import { UserProfileProvider } from "../../contexts/UserProfileContext";

/**
 * Dashboard layout component with sidebar navigation for authenticated users
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.title - Page title
 */
export default function DashboardLayout({ children, title = "Dashboard" }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDailyQuiz, setShowDailyQuiz] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const headerRef = useRef(null);

  // Function to refresh streak data - can be called after quiz submission
  const refreshHeaderStreakData = () => {
    // Call the header's refreshStreakData method if available
    if (headerRef.current && typeof headerRef.current.refreshStreakData === 'function') {
      headerRef.current.refreshStreakData();
    }
  };

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

  // Handle toggle daily quiz modal
  const toggleDailyQuiz = () => {
    setShowDailyQuiz(!showDailyQuiz);
  };

  // Update streak data after daily quiz submission
  const onQuizSubmit = () => {
    // Just refresh the header streak data
    refreshHeaderStreakData();
  };

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ProtectedRoute>
      <UserProfileProvider>
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
            {/* Header Component */}
            <DashboardHeader
              ref={headerRef}
              toggleSidebar={toggleSidebar}
              onToggleDailyQuiz={toggleDailyQuiz}
            />

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
      </UserProfileProvider>
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

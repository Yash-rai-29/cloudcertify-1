import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { getDailyStreak } from '../../utils/services/activityService';
import { trackUserActivity } from '../../utils/services/activityService';
import { Toaster } from 'react-hot-toast';
import DashboardHeader from '../dashboard/DashboardHeader';
import { 
  FiHome, 
  FiBook, 
  FiActivity, 
  FiFileText, 
  FiMessageSquare, 
  FiAward,
  FiUser, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiCloud
} from 'react-icons/fi';

/**
 * Dashboard layout component with sidebar navigation for authenticated users
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.title - Page title
 */
export default function DashboardLayout({ children, title = 'Dashboard' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [streak, setStreak] = useState({ current_streak: 0, longest_streak: 0 });
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const router = useRouter();

  // Navigation items for the sidebar
  const navItems = [
    { 
      name: 'Dashboard', 
      icon: <FiHome size={20} />, 
      href: '/dashboard',
      onClick: () => trackUserActivity('navigate_to_dashboard')
    },
    { 
      name: 'Test Library', 
      icon: <FiBook size={20} />, 
      href: '/dashboard/tests',
      onClick: () => trackUserActivity('navigate_to_tests')
    },
    { 
      name: 'My History', 
      icon: <FiActivity size={20} />, 
      href: '/dashboard/history',
      onClick: () => trackUserActivity('navigate_to_history')
    },
    { 
      name: 'Resources', 
      icon: <FiFileText size={20} />, 
      href: '/dashboard/resources',
      onClick: () => trackUserActivity('navigate_to_resources')
    },
    { 
      name: 'Leaderboard', 
      icon: <FiAward size={20} />, 
      href: '/dashboard/leaderboard',
      onClick: () => trackUserActivity('navigate_to_leaderboard')
    },
    { 
      name: 'AI Chatbot', 
      icon: <FiMessageSquare size={20} />, 
      href: '/dashboard/chat',
      onClick: () => trackUserActivity('navigate_to_chat')
    },
    { 
      name: 'Profile', 
      icon: <FiUser size={20} />, 
      href: '/dashboard/profile',
      onClick: () => trackUserActivity('navigate_to_profile')
    },
  ];

  // Fetch user streak
  useEffect(() => {
    const fetchStreak = async () => {
      setLoading(true);
      try {
        const response = await getDailyStreak();
        if (response.success) {
          setStreak(response.data);
        }
      } catch (error) {
        console.error('Error fetching user streak:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStreak();
    }
  }, [user]);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle logout click
  const handleLogout = async () => {
    try {
      await trackUserActivity('user_logout');
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Handle navigation item click
  const handleNavItemClick = (item) => {
    if (item.onClick) {
      item.onClick();
    }
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Toast notifications container */}
      <Toaster position="top-right" />
      
      {/* Mobile menu toggle */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-white shadow-md text-gray-700 hover:bg-gray-50"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-6 border-b">
            <Link href="/dashboard" 
              className="flex items-center gap-2"
              onClick={() => trackUserActivity('click_logo')}
            >
              <FiCloud className="text-blue-600 text-2xl" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Cloud Certify
              </span>
            </Link>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="font-medium text-gray-800 truncate">
                  {user?.displayName || user?.email || 'User'}
                </p>
                {user?.email && (
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      router.pathname === item.href || router.pathname.startsWith(`${item.href}/`)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => handleNavItemClick(item)}
                  >
                    <span className={`${
                      router.pathname === item.href || router.pathname.startsWith(`${item.href}/`) 
                        ? 'text-blue-600' 
                        : 'text-gray-500'
                    }`}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout button */}
          <div className="px-3 py-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-500">
                <FiLogOut size={20} />
              </span>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Fixed header - Temporarily removed for debugging */}
        <div className="p-4 border-b bg-white">
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Helper function to wrap a page with the dashboard layout
 * 
 * @param {React.ReactNode} page - The page component to wrap
 * @param {string} pageTitle - The title for the page
 * @returns {React.ReactNode} - The wrapped page
 */
export const getDashboardLayout = (page, pageTitle) => (
  <DashboardLayout title={pageTitle}>{page}</DashboardLayout>
);
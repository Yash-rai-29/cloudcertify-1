import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiHome, 
  FiBook, 
  FiActivity, 
  FiFileText, 
  FiMessageSquare, 
  FiUser, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiCloud
} from 'react-icons/fi';
import ProtectedRoute from '../auth/ProtectedRoute';

// Dashboard layout component with sidebar navigation
export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  // Navigation items for the sidebar
  const navItems = [
    { name: 'Dashboard', icon: <FiHome size={20} />, href: '/dashboard' },
    { name: 'Test Library', icon: <FiBook size={20} />, href: '/dashboard/test-library' },
    { name: 'Test History', icon: <FiActivity size={20} />, href: '/dashboard/test-history' },
    { name: 'Resources', icon: <FiFileText size={20} />, href: '/dashboard/resources' },
    { name: 'AI Chatbot', icon: <FiMessageSquare size={20} />, href: '/dashboard/ai-chatbot' },
    { name: 'Profile', icon: <FiUser size={20} />, href: '/dashboard/profile' },
  ];

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
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile menu toggle */}
        {isMobile && (
          <div className="fixed top-4 left-4 z-50">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-white shadow-md text-gray-700 hover:bg-gray-50"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        )}

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out ${isMobile ? 'lg:translate-x-0' : ''}`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-center h-16 px-6 border-b">
              <div className="flex items-center gap-2">
                <FiCloud className="text-blue-600 text-2xl" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Cloud Certify
                </span>
              </div>
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
                        router.pathname === item.href
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className={`${
                        router.pathname === item.href ? 'text-blue-600' : 'text-gray-500'
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
        <div className={`${isOpen ? 'md:ml-64' : 'ml-0'} transition-margin duration-300 ease-in-out`}>
          <main className="p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Helper function for page components to use this layout
export const getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiBook, FiBarChart2, FiUser, FiLogOut, FiMenu, FiX, FiCloud } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';
import { cn } from '../../utils/helpers';

/**
 * Dashboard layout component with sidebar navigation for authenticated users
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.title - Page title
 */
export default function DashboardLayout({ 
  children,
  title = 'Dashboard - Cloud Certify'
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  // Close mobile sidebar on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileSidebarOpen(false);
    };
    
    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);
  
  // Navigation items for the sidebar
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Test Library', href: '/dashboard/test-library', icon: FiBook },
    { name: 'Test History', href: '/dashboard/test-history', icon: FiBarChart2 },
    { name: 'Profile', href: '/dashboard/profile', icon: FiUser },
  ];
  
  // Get the current path for navigation highlighting
  const currentPath = router.pathname;
  
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Cloud Certify dashboard - Track your GCP certification progress" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div className="flex h-screen bg-gray-50">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200">
          <div className="flex flex-col h-full">
            {/* Logo and Branding */}
            <div className="flex items-center h-16 px-4 border-b border-gray-200">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-8 h-8 rounded-md flex items-center justify-center">
                  <FiCloud className="text-white text-xl" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Cloud Certify
                </span>
              </Link>
            </div>
            
            {/* Navigation Menu */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = currentPath === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                      isActive 
                        ? "bg-blue-50 text-blue-700" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <item.icon className={cn(
                      "mr-3 text-lg",
                      isActive ? "text-blue-600" : "text-gray-500"
                    )} />
                    {item.name}
                    {isActive && (
                      <div className="ml-auto w-1.5 h-5 bg-blue-600 rounded-sm" />
                    )}
                  </Link>
                );
              })}
            </nav>
            
            {/* User Profile and Logout */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar 
                    src={user?.photoURL}
                    initials={user?.displayName?.charAt(0) || user?.email?.charAt(0)}
                    size="md"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {user?.displayName || user?.email}
                    </span>
                    <span className="text-xs text-gray-500 truncate max-w-[120px]">
                      {user?.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                  aria-label="Logout"
                >
                  <FiLogOut className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 md:hidden"
            >
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gray-900"
                onClick={() => setIsMobileSidebarOpen(false)}
              />
              
              {/* Sidebar */}
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 25 }}
                className="absolute top-0 left-0 bottom-0 w-64 bg-white shadow-lg"
              >
                <div className="flex flex-col h-full">
                  {/* Logo and Close Button */}
                  <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                    <Link href="/dashboard" className="flex items-center space-x-2">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-8 h-8 rounded-md flex items-center justify-center">
                        <FiCloud className="text-white text-xl" />
                      </div>
                      <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Cloud Certify
                      </span>
                    </Link>
                    <button
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className="p-1.5 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                      aria-label="Close sidebar"
                    >
                      <FiX className="text-lg" />
                    </button>
                  </div>
                  
                  {/* Navigation Menu */}
                  <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                      const isActive = currentPath === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                            isActive 
                              ? "bg-blue-50 text-blue-700" 
                              : "text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          <item.icon className={cn(
                            "mr-3 text-lg",
                            isActive ? "text-blue-600" : "text-gray-500"
                          )} />
                          {item.name}
                          {isActive && (
                            <div className="ml-auto w-1.5 h-5 bg-blue-600 rounded-sm" />
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                  
                  {/* User Profile and Logout */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar 
                          src={user?.photoURL}
                          initials={user?.displayName?.charAt(0) || user?.email?.charAt(0)}
                          size="md"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {user?.displayName || user?.email}
                          </span>
                          <span className="text-xs text-gray-500 truncate max-w-[120px]">
                            {user?.email}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="p-1.5 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                        aria-label="Logout"
                      >
                        <FiLogOut className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main Content Area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Mobile Header */}
          <header className="flex items-center h-16 px-4 bg-white border-b border-gray-200 md:hidden">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="mr-4 p-1.5 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Open sidebar"
            >
              <FiMenu className="text-xl" />
            </button>
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-7 h-7 rounded-md flex items-center justify-center">
                <FiCloud className="text-white text-lg" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Cloud Certify
              </span>
            </Link>
          </header>
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </>
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
  <DashboardLayout title={pageTitle}>
    {page}
  </DashboardLayout>
);
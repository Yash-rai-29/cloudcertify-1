import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../common/ProtectedRoute';
import Avatar from '../ui/Avatar';
import {
  IconLayoutDashboard,
  IconFileDescription,
  IconCertificate,
  IconBookmarks,
  IconTrophy,
  IconRobot,
  IconLogout,
  IconMenu2,
  IconX,
  IconUser
} from '@tabler/icons-react';

/**
 * Dashboard layout component with sidebar navigation for authenticated users
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.title - Page title
 */
export default function DashboardLayout({ 
  children, 
  title = 'Dashboard' 
}) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: IconLayoutDashboard, exact: true },
    { name: 'Test Library', href: '/dashboard/tests', icon: IconFileDescription },
    { name: 'Test History', href: '/dashboard/history', icon: IconCertificate },
    { name: 'Resources', href: '/dashboard/resources', icon: IconBookmarks },
    { name: 'Leaderboard', href: '/dashboard/leaderboard', icon: IconTrophy },
    { name: 'AI Chatbot', href: '/dashboard/chat', icon: IconRobot },
    { name: 'Profile', href: '/dashboard/profile', icon: IconUser },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 relative">
        <Head>
          <title>{title} | Cloud Certify</title>
        </Head>

        {/* Mobile sidebar */}
        <div className="lg:hidden">
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 flex">
              {/* Overlay */}
              <div 
                className="fixed inset-0 bg-gray-600 bg-opacity-75"
                onClick={() => setSidebarOpen(false)}
              ></div>
              
              {/* Sidebar */}
              <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <IconX className="h-6 w-6 text-white" />
                  </button>
                </div>
                
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <div className="flex-shrink-0 flex items-center px-4">
                    <Link href="/" className="text-xl font-bold text-blue-600">
                      Cloud Certify
                    </Link>
                  </div>
                  <nav className="mt-5 px-2 space-y-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md relative ${
                          (item.exact ? router.pathname === item.href : 
                           router.pathname === item.href || router.pathname.startsWith(`${item.href}/`))
                            ? 'bg-gray-100 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <item.icon
                          className={`mr-4 flex-shrink-0 h-6 w-6 ${
                            (item.exact ? router.pathname === item.href : 
                             router.pathname === item.href || router.pathname.startsWith(`${item.href}/`))
                              ? 'text-blue-600'
                              : 'text-gray-400 group-hover:text-gray-500'
                          }`}
                        />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
                
                <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                  <div className="flex items-center">
                    <div>
                      <Avatar 
                        src={user?.photoURL}
                        initials={user?.displayName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
                        size="md"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-gray-700 truncate">
                        {user?.displayName || user?.email}
                      </p>
                      <button
                        onClick={handleSignOut}
                        className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center"
                      >
                        <IconLogout className="mr-1 h-3 w-3" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0 w-14">
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </div>
          )}
        </div>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <Link href="/" className="text-xl font-bold text-blue-600">
                Cloud Certify
              </Link>
            </div>
            <nav className="mt-8 flex-1 px-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md relative ${
                    (item.exact ? router.pathname === item.href : 
                     router.pathname === item.href || router.pathname.startsWith(`${item.href}/`))
                      ? 'bg-gray-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      (item.exact ? router.pathname === item.href : 
                       router.pathname === item.href || router.pathname.startsWith(`${item.href}/`))
                        ? 'text-blue-600'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div>
                <Avatar 
                  src={user?.photoURL}
                  initials={user?.displayName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
                  size="md"
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {user?.displayName || user?.email}
                </p>
                <div className="flex mt-1">
                  <Link
                    href="/dashboard/profile"
                    className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center mr-3"
                  >
                    <IconUser className="mr-1 h-3 w-3" />
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center"
                  >
                    <IconLogout className="mr-1 h-3 w-3" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64 flex flex-col flex-1 relative">
          {/* Mobile top navigation */}
          <div className="sticky top-0 z-10 lg:hidden flex items-center justify-between bg-white px-4 py-2 border-b border-gray-200 sm:px-6 relative">
            <button
              type="button"
              className="p-2 -ml-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <IconMenu2 className="h-6 w-6" />
            </button>
            <div className="text-lg font-bold text-blue-600 relative">
              Cloud Certify
            </div>
            <Link href="/dashboard/profile" className="relative">
              <Avatar 
                src={user?.photoURL}
                initials={user?.displayName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
                size="sm"
              />
            </Link>
          </div>

          {/* Page content */}
          <main className="flex-1 relative">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
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
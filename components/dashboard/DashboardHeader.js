import { useState, useRef, useEffect } from 'react';
import { 
  IconCalendarEvent, 
  IconBell, 
  IconChevronDown, 
  IconCloud, 
  IconCloudComputing,
  IconFlame,
  IconSettings,
  IconLogout,
  IconHelp,
  IconChevronRight 
} from '@tabler/icons-react';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/helpers';

/**
 * Dashboard Header component with improved functionality including streak display,
 * notifications, and profile dropdown
 * 
 * @param {Object} props - Component props
 * @param {Object} props.userData - User data from API
 * @param {Object} props.streak - User streak data
 * @param {Object} props.authUser - User object from auth context
 * @param {Function} props.onStartTest - Handler for Continue Learning button
 * @param {Function} props.onViewProfile - Handler for View Profile button
 */
export default function DashboardHeader({ 
  userData = {},
  streak = { streak: 0, last_streak_date: '' },
  authUser = {},
  onStartTest,
  onViewProfile
}) {
  const { signOut } = useAuth();
  const router = useRouter();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  
  // Notification data - In a real app, this would come from an API
  const notifications = [
    {
      id: 1,
      title: "New practice test available",
      message: "A new GCP Professional Cloud Architect practice test has been added.",
      time: "1 hour ago",
      read: false
    },
    {
      id: 2,
      title: "Daily streak reminder",
      message: "Don't forget to answer today's question to maintain your streak!",
      time: "5 hours ago",
      read: true
    }
  ];
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="top-0 z-20 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <h1 className="text-lg md:text-xl font-semibold text-blue-700">
              Welcome back, {userData?.first_name || authUser?.displayName?.split(' ')[0] || 'User'}
            </h1>
            
            {/* Show streak on larger screens in header */}
            {streak?.streak > 0 && (
              <div className="hidden md:flex items-center ml-4 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <div className="p-1 bg-amber-100 rounded-full text-amber-600 mr-2">
                  <IconFlame size={14} />
                </div>
                <span className="text-xs font-medium text-amber-800">
                  {streak.streak} day streak
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Continue Learning button */}
            <Button
              onClick={onStartTest}
              className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white"
              rightIcon={<IconChevronRight size={16} />}
            >
              Continue Learning
            </Button>
            
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 focus:outline-none"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <IconBell size={20} />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
              </button>
              
              {/* Notification dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-700">Notifications</p>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id}
                        className={cn(
                          "px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50",
                          !notification.read && "bg-blue-50"
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <span className="text-xs text-gray-500 ml-2">{notification.time}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      </div>
                    ))}
                    
                    {notifications.length === 0 && (
                      <div className="px-4 py-6 text-center">
                        <p className="text-sm text-gray-500">No new notifications</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="px-4 py-2 border-t border-gray-100 text-center">
                    <button className="text-xs text-blue-600 font-medium hover:text-blue-800">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                className="flex items-center space-x-1 rounded-full focus:outline-none"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <Avatar 
                  src={userData?.avatar_url || authUser?.photoURL}
                  initials={
                    userData?.first_name?.charAt(0) || 
                    authUser?.displayName?.charAt(0) || 
                    authUser?.email?.charAt(0)?.toUpperCase()
                  }
                  size="md"
                />
                <IconChevronDown size={16} className="text-gray-500" />
              </button>
              
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {userData?.first_name ? 
                        `${userData.first_name} ${userData.last_name || ''}` : 
                        authUser?.displayName || authUser?.email
                      }
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-1">{authUser?.email}</p>
                    
                    {/* Show streak in dropdown */}
                    {streak?.streak > 0 && (
                      <div className="mt-2 flex items-center">
                        <div className="p-1 bg-amber-100 rounded-full text-amber-600 mr-1.5">
                          <IconFlame size={14} />
                        </div>
                        <span className="text-xs font-medium text-amber-800">
                          {streak.streak} day streak
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Menu items */}
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        router.push('/dashboard/settings');
                        setShowProfileDropdown(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <IconSettings className="w-4 h-4 mr-2 text-gray-500" />
                      Settings
                    </button>
                    
                    <button 
                      onClick={() => {
                        router.push('/dashboard/help');
                        setShowProfileDropdown(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <IconHelp className="w-4 h-4 mr-2 text-gray-500" />
                      Help & Support
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-100 mt-1">
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <IconLogout className="w-4 h-4 mr-2 text-gray-500" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { IconCalendarEvent, IconBell, IconChevronDown, IconCloud, IconCloudComputing } from '@tabler/icons-react';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';

/**
 * Dashboard Header component
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
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="sticky top-0 z-20 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <h1 className="text-lg md:text-xl font-semibold text-gray-900">
              Welcome back, {userData?.first_name || authUser?.displayName?.split(' ')[0] || 'User'}!
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={onStartTest}
              className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue Learning
            </Button>
            
            {/* Notifications */}
            <div className="relative">
              <button
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 focus:outline-none"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <IconBell size={20} />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>
              
              {/* Notification dropdown would go here */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-700">Notifications</p>
                  </div>
                  <div className="max-h-60 overflow-y-auto py-2">
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm font-medium text-gray-900">New practice test available</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm font-medium text-gray-900">Your streak is at risk!</p>
                      <p className="text-xs text-gray-500">5 hours ago</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile dropdown */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 rounded-full focus:outline-none"
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {authUser?.displayName || authUser?.email}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{authUser?.email}</p>
                  </div>
                  <a href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Your Profile</a>
                  <a href="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</a>
                  <div className="border-t border-gray-100">
                    <button 
                      onClick={onViewProfile}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
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
import { IconCalendarEvent, IconTrophy } from '@tabler/icons-react';
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
 * @param {Function} props.onStartTest - Handler for Start Practice Test button
 * @param {Function} props.onViewProfile - Handler for View Profile button
 */
export default function DashboardHeader({ 
  userData = {},
  streak = { current: 0, longest: 0 },
  authUser = {},
  onStartTest,
  onViewProfile
}) {
  return (
    <div className="py-6 md:py-8 relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between relative">
        <div className="flex items-center">
          <Avatar 
            src={userData?.avatar_url || authUser?.photoURL}
            initials={
              userData?.first_name?.charAt(0) || 
              authUser?.displayName?.charAt(0) || 
              authUser?.email?.charAt(0)?.toUpperCase()
            }
            size="lg"
            className="mr-4"
          />
          <div className="relative">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {userData?.first_name || authUser?.displayName?.split(' ')[0] || 'User'}!
              </h1>
              {userData?.certification_level && (
                <Badge 
                  variant="blue" 
                  size="sm"
                  className="ml-2"
                >
                  {userData.certification_level}
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {userData?.certification_target 
                ? `Preparing for ${userData.certification_target}`
                : 'Preparing for Google Cloud certification'
              }
            </p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 relative">
          <Button
            variant="outline"
            leftIcon={<IconTrophy size={18} />}
            onClick={onViewProfile}
          >
            View Profile
          </Button>
          <Button
            leftIcon={<IconCalendarEvent size={18} />}
            onClick={onStartTest}
          >
            Start Practice Test
          </Button>
        </div>
      </div>
      
      {/* Streak indicator */}
      {streak && (
        <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200 flex items-center relative">
          <div className="p-2 bg-amber-100 rounded-full text-amber-600">
            <IconCalendarEvent size={20} />
          </div>
          <div className="ml-3 relative">
            <p className="text-sm font-medium text-gray-900">
              {streak.current === 0 
                ? 'Start your learning streak today!'
                : `${streak.current} day${streak.current !== 1 ? 's' : ''} streak! Keep going!`
              }
            </p>
            <p className="text-xs text-gray-500">
              {streak.current === 0
                ? 'Complete a test or answer the daily question to begin your streak'
                : `Your longest streak is ${streak.longest} day${streak.longest !== 1 ? 's' : ''}`
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
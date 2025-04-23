import React from 'react';
import { FiCalendar, FiAward, FiPlay, FiUser } from 'react-icons/fi';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

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
const DashboardHeader = ({
  userData,
  streak,
  authUser,
  onStartTest,
  onViewProfile
}) => {
  // Get user name from userData or authUser fallback
  const firstName = userData?.firstName || authUser?.displayName?.split(' ')[0] || 'User';
  const avatarSrc = userData?.avatarUrl || null;
  const avatarInitial = firstName.charAt(0);
  const certificationTarget = userData?.certificationTarget || 'GCP Certification';
  const streakCount = streak?.currentStreak || 0;

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-4">
        <Avatar 
          src={avatarSrc}
          initials={avatarInitial}
          size="lg"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {firstName}
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="flex items-center">
              <FiCalendar className="mr-1 text-blue-500" />
              {streakCount} day streak
            </span>
            <span className="flex items-center">
              <FiAward className="mr-1 text-amber-500" />
              {certificationTarget}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-3">
        <Button
          variant="primary"
          leftIcon={<FiPlay size={16} />}
          onClick={onStartTest}
        >
          Start Practice Test
        </Button>
        
        <Button
          variant="secondary"
          leftIcon={<FiUser size={16} />}
          onClick={onViewProfile}
        >
          View Profile
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
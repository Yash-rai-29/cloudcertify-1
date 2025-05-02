import React from 'react';
import { FiUser, FiCalendar, FiClock, FiMail, FiAward } from 'react-icons/fi';
import Avatar from '../ui/Avatar';
import { formatDate } from '../../utils/helpers';

/**
 * User Profile Display component for showing user information
 */
const UserProfileDisplay = ({ userData }) => {
  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative">
        <Avatar 
          src={userData.avatarUrl} 
          initials={userData.firstName?.charAt(0)} 
          alt={userData.firstName}
          size="xl"
        />
        
        <div className="space-y-2 text-center sm:text-left relative">
          <h2 className="text-xl font-semibold text-gray-900">
            {userData.firstName} {userData.lastName}
          </h2>
          <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-1 relative">
            <FiMail className="text-blue-500" />
            {userData.email}
          </p>
          <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-1 relative">
            <FiAward className="text-amber-500" />
            {userData.certificationTarget}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100 relative">
        <div className="flex items-center gap-2 relative">
          <FiCalendar className="text-blue-500" />
          <div className="relative">
            <p className="text-sm text-gray-500">Account Created</p>
            <p className="font-medium">{userData.createdAt ? formatDate(userData.createdAt) : 'N/A'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 relative">
          <FiClock className="text-indigo-500" />
          <div className="relative">
            <p className="text-sm text-gray-500">Last Login</p>
            <p className="font-medium">{userData.activity?.lastLogin ? formatDate(userData.activity.lastLogin) : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDisplay;
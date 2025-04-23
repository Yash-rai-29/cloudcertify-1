import React from 'react';
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import { formatDate } from '../../utils/services/dashboardService';

const UserProfile = ({ user, loading, error }) => {
  if (!user || error) return null;

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-8">
      {/* User Avatar */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full w-20 h-20 flex items-center justify-center text-white text-3xl font-semibold">
        {user.avatar_url ? (
          <img 
            src={user.avatar_url} 
            alt={user.full_name} 
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          user.first_name?.charAt(0) || 'U'
        )}
      </div>
      
      {/* User Info */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-gray-900 text-center md:text-left">
          {user.full_name || `${user.first_name} ${user.last_name}`}
        </h1>
        <p className="text-gray-500 text-center md:text-left">{user.email}</p>
        <div className="flex flex-wrap gap-3 mt-2 justify-center md:justify-start">
          <div className="flex items-center text-sm text-gray-500">
            <FiUser className="mr-1 text-blue-500" />
            <span>{user.certification_target}</span>
          </div>
          {user.created_at && (
            <div className="flex items-center text-sm text-gray-500">
              <FiCalendar className="mr-1 text-blue-500" />
              <span>Member since {formatDate(user.created_at)}</span>
            </div>
          )}
          {user.activity?.last_login && (
            <div className="flex items-center text-sm text-gray-500">
              <FiClock className="mr-1 text-blue-500" />
              <span>Last login: {formatDate(user.activity.last_login)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
import React from 'react';
import { FiSettings, FiMail, FiClock } from 'react-icons/fi';

/**
 * Preference Display component for showing user preferences
 */
const PreferenceDisplay = ({ preferences }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiSettings className="text-gray-400" />
          <span className="text-gray-700">Daily Reminder</span>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${preferences?.dailyReminder ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {preferences?.dailyReminder ? 'Enabled' : 'Disabled'}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiMail className="text-gray-400" />
          <span className="text-gray-700">Email Notifications</span>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${preferences?.emailNotifications ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {preferences?.emailNotifications ? 'Enabled' : 'Disabled'}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiSettings className="text-gray-400" />
          <span className="text-gray-700">Theme</span>
        </div>
        <span className="font-medium text-gray-900 capitalize">
          {preferences?.theme || 'Light'}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiClock className="text-gray-400" />
          <span className="text-gray-700">Daily Study Goal</span>
        </div>
        <span className="font-medium text-gray-900">
          {preferences?.studyGoalMinutesPerDay || 30} minutes
        </span>
      </div>
    </div>
  );
};

export default PreferenceDisplay;
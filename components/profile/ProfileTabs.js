import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Tab navigation component for profile page
 */
export default function ProfileTabs({ activeTab, onChange }) {
  // Tab items configuration
  const tabs = [
    { id: 'profile', label: 'User Profile', icon: '👤' },
    { id: 'account', label: 'Account', icon: '🔐' },
    { id: 'about', label: 'About', icon: 'ℹ️' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              relative flex-1 flex items-center justify-center py-4 px-4 text-sm font-medium 
              ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}
              border-b-2 ${activeTab === tab.id ? 'border-blue-500' : 'border-transparent'}
              transition-colors
            `}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                layoutId="activeTab"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

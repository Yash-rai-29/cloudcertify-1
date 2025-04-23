import React from 'react';

const DashboardCard = ({ 
  title, 
  children, 
  className = '', 
  headerClassName = '',
  bodyClassName = '',
  rightHeaderContent = null
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      <div className={`flex items-center justify-between px-6 py-4 border-b ${headerClassName}`}>
        <h2 className="text-lg font-medium text-gray-800">{title}</h2>
        {rightHeaderContent}
      </div>
      <div className={`p-6 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
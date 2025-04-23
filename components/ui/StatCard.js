import React from 'react';

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon,
  className = '',
  iconClassName = ''
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 flex flex-col border border-gray-100 ${className}`}>
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-sm font-medium text-gray-500">{title}</h2>
        <div className={`${iconClassName}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline mt-1">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {description && (
          <p className="ml-2 text-sm text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
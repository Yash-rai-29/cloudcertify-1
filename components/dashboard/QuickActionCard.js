import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Quick Action Card component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.icon - Action icon
 * @param {string} props.iconColor - Icon background color
 * @param {string} props.title - Action title
 * @param {string} props.description - Action description
 * @param {function} props.onClick - Click handler for the card
 */
const QuickActionCard = ({
  icon,
  iconColor = 'bg-blue-100 text-blue-600',
  title,
  description,
  onClick,
  className = '',
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all flex items-center gap-3 w-full text-left",
        className
      )}
      {...props}
    >
      <div className={cn('p-3 rounded-lg', iconColor)}>
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-gray-800">{title}</h3>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </button>
  );
};

export default QuickActionCard;
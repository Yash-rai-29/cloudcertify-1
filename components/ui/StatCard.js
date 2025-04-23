"use client";
import { cn } from '../../utils/helpers';

/**
 * StatCard component for displaying key statistics
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Statistic title/name
 * @param {string|number} props.value - Statistic value
 * @param {string} props.description - Additional description for the value
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {React.ReactNode} props.trend - Optional trend indicator
 * @param {string} props.className - Additional classes for container
 */
export default function StatCard({ 
  title, 
  value, 
  description = '', 
  icon = null,
  trend = null,
  className,
}) {
  return (
    <div className={cn(
      "bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow",
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">
            {title}
          </p>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">
              {value}
            </p>
            {description && (
              <p className="ml-2 text-sm text-gray-500">
                {description}
              </p>
            )}
          </div>
          {trend && (
            <div className="mt-2">
              {trend}
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2 bg-gray-50 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
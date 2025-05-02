"use client";
import { cn } from '../../utils/helpers';

/**
 * DashboardCard component for displaying content in a consistent card format
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string|React.ReactNode} props.title - Card title
 * @param {React.ReactNode} props.rightHeaderContent - Optional content to display on the right side of the header
 * @param {string} props.className - Additional classes for the card container
 * @param {string} props.contentClassName - Additional classes for the content area
 * @param {string} props.headerClassName - Additional classes for the header
 * @param {React.ReactNode} props.icon - Optional icon to display
 * @param {number|string} props.value - Optional value to display as a metric
 * @param {string} props.unit - Optional unit for the value
 */
export default function DashboardCard({ 
  children, 
  title, 
  rightHeaderContent,
  className,
  contentClassName,
  headerClassName,
  icon,
  value,
  unit
}) {
  // Check if this is a metric card (with icon and value)
  const isMetricCard = icon !== undefined && value !== undefined;

  return (
    <div className={cn(
      "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative",
      className
    )}>
      {isMetricCard ? (
        // Metric card layout
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">{title}</h3>
              <div className="mt-2 flex items-baseline">
                <span className="text-2xl font-semibold text-gray-900">{value}</span>
                {unit && <span className="ml-1 text-sm text-gray-500">{unit}</span>}
              </div>
            </div>
            <div>
              {icon}
            </div>
          </div>
        </div>
      ) : (
        // Standard card layout
        <>
          {title && (
            <div className={cn(
              "px-5 py-4 border-b border-gray-200 flex items-center justify-between relative",
              headerClassName
            )}>
              <h3 className="font-medium text-gray-800">
                {title}
              </h3>
              {rightHeaderContent && (
                <div className="flex items-center">
                  {rightHeaderContent}
                </div>
              )}
            </div>
          )}
          <div className={cn("p-5 relative", contentClassName)}>
            {children}
          </div>
        </>
      )}
    </div>
  );
}
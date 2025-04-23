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
 */
export default function DashboardCard({ 
  children, 
  title, 
  rightHeaderContent,
  className,
  contentClassName,
  headerClassName
}) {
  return (
    <div className={cn(
      "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden",
      className
    )}>
      {title && (
        <div className={cn(
          "px-5 py-4 border-b border-gray-200 flex items-center justify-between",
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
      <div className={cn("p-5", contentClassName)}>
        {children}
      </div>
    </div>
  );
}
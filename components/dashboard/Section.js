import { cn } from '../../utils/helpers';

/**
 * Dashboard section component with consistent spacing and styling
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.title - Section title
 * @param {React.ReactNode} props.description - Section description
 * @param {React.ReactNode} props.headerContent - Additional content to display in header
 * @param {string} props.className - Additional CSS classes for container
 * @param {string} props.contentClassName - Additional CSS classes for content area
 * @param {string} props.headerClassName - Additional CSS classes for header
 */
export default function Section({
  title,
  description,
  headerContent,
  children,
  className,
  contentClassName,
  headerClassName
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Section Header */}
      {(title || description || headerContent) && (
        <div className={cn(
          'flex flex-col md:flex-row md:items-center md:justify-between',
          headerClassName
        )}>
          {/* Title and Description */}
          {(title || description) && (
            <div>
              {title && (
                <h2 className="text-lg font-medium text-gray-900">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-sm text-gray-500">
                  {description}
                </p>
              )}
            </div>
          )}
          
          {/* Header Right Content */}
          {headerContent && (
            <div className="mt-2 md:mt-0">
              {headerContent}
            </div>
          )}
        </div>
      )}
      
      {/* Content */}
      <div className={contentClassName}>
        {children}
      </div>
    </div>
  );
}
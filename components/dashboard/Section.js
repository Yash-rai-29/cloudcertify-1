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
  className,
  contentClassName,
  headerClassName,
  children
}) {
  return (
    <div className={cn('', className)}>
      {(title || description || headerContent) && (
        <div className={cn(
          'flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:justify-between sm:items-center mb-4',
          headerClassName
        )}>
          <div>
            {title && (
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            )}
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
          </div>
          {headerContent && (
            <div className="mt-2 sm:mt-0">
              {headerContent}
            </div>
          )}
        </div>
      )}
      <div className={cn('', contentClassName)}>
        {children}
      </div>
    </div>
  );
}
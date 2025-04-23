import React from 'react';
import { cn } from '../../utils/cn';

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
const Section = ({
  title,
  description,
  headerContent,
  children,
  className = '',
  contentClassName = '',
  headerClassName = '',
  ...props
}) => {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {(title || headerContent) && (
        <div className={cn('flex justify-between items-center', headerClassName)}>
          <div>
            {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
          {headerContent && (
            <div>{headerContent}</div>
          )}
        </div>
      )}
      <div className={contentClassName}>
        {children}
      </div>
    </div>
  );
};

export default Section;
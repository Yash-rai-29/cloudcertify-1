import React from 'react';

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
 * @param {React.ReactNode} props.children - Section content
 */
export default function Section({
  title,
  description,
  headerContent,
  className = '',
  contentClassName = '',
  headerClassName = '',
  children
}) {
  return (
    <div className={`mb-8 ${className}`}>
      {/* Section header */}
      {(title || description || headerContent) && (
        <div className={`mb-4 ${headerClassName}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              {title && (
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
              )}
              {description && (
                <p className="mt-1 text-sm text-gray-500">{description}</p>
              )}
            </div>
            {headerContent && (
              <div className="ml-auto">{headerContent}</div>
            )}
          </div>
        </div>
      )}
      
      {/* Section content */}
      <div className={contentClassName}>
        {children}
      </div>
    </div>
  );
}
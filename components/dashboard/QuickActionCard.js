import { cn } from '../../utils/helpers';

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
export default function QuickActionCard({
  icon,
  iconColor,
  title,
  description,
  onClick,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        'bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      <div className="flex items-start">
        {icon && (
          <div className={`p-2 rounded-md ${iconColor || 'bg-blue-100 text-blue-600'}`}>
            {icon}
          </div>
        )}
        <div className="ml-4">
          <h3 className="font-medium text-gray-900">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
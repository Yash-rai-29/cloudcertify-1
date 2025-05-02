import { motion } from 'framer-motion';

/**
 * Tabbed navigation component for settings page
 * 
 * @param {Object} props - Component props
 * @param {Array} props.items - Tab items with id, label and icon
 * @param {string} props.active - Active tab id
 * @param {Function} props.onChange - Function to call when a tab is clicked
 */
export default function SettingsTabs({ items, active, onChange }) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-6 px-6" aria-label="Settings tabs">
        {items.map((item) => {
          const isActive = active === item.id;
          
          return (
            <button
              key={item.id}
              className={`
                relative py-4 px-1 flex items-center text-sm font-medium border-b-2 whitespace-nowrap
                ${isActive
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
              aria-current={isActive ? "page" : undefined}
              onClick={() => onChange(item.id)}
            >
              <item.icon
                className={`mr-2 h-5 w-5 ${isActive ? 'text-blue-500' : 'text-gray-400'}`}
                aria-hidden="true"
              />
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                  layoutId="underline"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

import { IconRocket } from '@tabler/icons-react';
import Button from '../ui/Button';

/**
 * Call to Action Card component for dashboard
 * 
 * @param {Object} props - Component props 
 * @param {string} props.title - Card title
 * @param {string} props.description - Card description
 * @param {string} props.buttonText - Primary action button text
 * @param {Function} props.onButtonClick - Primary action handler
 * @param {string} props.className - Additional CSS classes
 */
export default function CTACard({
  title = "Ready to elevate your cloud skills?",
  description = "Take a practice test, explore our resources, or use the AI assistant to help with your certification journey.",
  buttonText = "Take Practice Test",
  onButtonClick,
  className
}) {
  return (
    <div className={`bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg overflow-hidden relative ${className || ''}`}>
      <div className="p-6 sm:p-8 relative z-10">
        <div className="flex items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-xl text-white">{title}</h3>
            <p className="mt-2 text-blue-100">{description}</p>
            
            <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Button
                className="bg-white text-blue-600 hover:bg-blue-50 font-medium"
                onClick={onButtonClick}
                leftIcon={<IconRocket size={18} />}
              >
                {buttonText}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500 bg-opacity-20 rounded-full"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-500 bg-opacity-20 rounded-full"></div>
    </div>
  );
}
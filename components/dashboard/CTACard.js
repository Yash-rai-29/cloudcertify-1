import { FiArrowRight } from 'react-icons/fi';

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
  title,
  description,
  buttonText = 'Get Started',
  onButtonClick,
  className = ''
}) {
  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="mb-4 opacity-90">{description}</p>
        <button
          onClick={onButtonClick}
          className="flex items-center px-5 py-2.5 bg-white text-blue-700 rounded-md font-medium hover:bg-blue-50 transition-colors shadow-sm"
        >
          {buttonText}
          <FiArrowRight className="ml-2" size={16} />
        </button>
      </div>
    </div>
  );
}
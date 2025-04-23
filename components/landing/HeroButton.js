import React from 'react';
import { motion } from 'framer-motion';

/**
 * Hero Button component for the landing page
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button text
 * @param {React.ReactNode} props.icon - Optional icon to display
 * @param {string} props.href - Button link
 * @param {boolean} props.primary - Whether button is primary or secondary
 * @param {string} props.className - Additional classes
 */
const HeroButton = ({
  children,
  icon,
  href,
  primary = true,
  className = '',
  ...props
}) => {
  return (
    <motion.a
      href={href}
      whileHover={
        primary 
          ? { scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }
          : { scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }
      }
      whileTap={{ scale: 0.95 }}
      className={`
        ${primary 
          ? 'bg-white text-blue-600 shadow-lg hover:shadow-xl' 
          : 'bg-transparent border-2 border-white/30 text-white'
        }
        px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center
        ${className}
      `}
      {...props}
    >
      {children}
      {icon && <span className="ml-2">{icon}</span>}
    </motion.a>
  );
};

export default HeroButton;
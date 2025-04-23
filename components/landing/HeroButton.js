"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '../../utils/helpers';

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
  href = "#",
  primary = true,
  className
}) => {
  return (
    <Link 
      href={href}
      className={cn(
        "flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 text-base",
        primary 
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-700/30 hover:shadow-blue-700/40" 
          : "bg-white/20 text-white backdrop-blur-md border border-white/30 hover:bg-white/30",
        className
      )}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-center gap-2"
      >
        {children}
        {icon && <span className="ml-1">{icon}</span>}
      </motion.div>
    </Link>
  );
};

export default HeroButton;
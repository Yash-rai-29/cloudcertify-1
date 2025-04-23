"use client";
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

/**
 * Hero Badge component for displaying highlighted information in the hero section
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.icon - Icon to display in the badge
 * @param {string} props.text - Text to display in the badge
 * @param {string} props.className - Additional CSS classes
 */
const HeroBadge = ({ icon, text, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-sm text-white/90 font-medium",
        className
      )}
    >
      {icon && <span className="text-blue-300">{icon}</span>}
      <span>{text}</span>
    </motion.div>
  );
};

export default HeroBadge;
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Hero Badge component for displaying highlighted information in the hero section
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.icon - Icon to display in the badge
 * @param {string} props.text - Text to display in the badge
 * @param {string} props.className - Additional CSS classes
 */
const HeroBadge = ({ icon, text, className = '', ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`inline-block ${className}`}
      {...props}
    >
      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white border border-white/20">
        {icon}
        <span className="text-sm font-medium">{text}</span>
      </div>
    </motion.div>
  );
};

export default HeroBadge;
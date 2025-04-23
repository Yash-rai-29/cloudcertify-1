import React from 'react';
import { motion } from 'framer-motion';

/**
 * Statistic Item component for displaying statistics on the landing page
 * 
 * @param {Object} props - Component props
 * @param {string} props.value - Statistic value to display
 * @param {string} props.label - Description of the statistic
 * @param {string} props.className - Additional CSS classes
 */
const StatItem = ({ value, label, className = '', ...props }) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.05, 
        boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)",
        backgroundColor: "rgba(255, 255, 255, 0.15)" 
      }}
      className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-all ${className}`}
      {...props}
    >
      <div className="text-2xl md:text-3xl font-bold mb-1">
        {value}
      </div>
      <div className="text-blue-100 text-sm">{label}</div>
    </motion.div>
  );
};

export default StatItem;
"use client";
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

/**
 * Statistic Item component for displaying statistics on the landing page
 * 
 * @param {Object} props - Component props
 * @param {string} props.value - Statistic value to display
 * @param {string} props.label - Description of the statistic
 * @param {string} props.className - Additional CSS classes
 */
const StatItem = ({ value, label, className }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10",
        className
      )}
    >
      <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
        {value}
      </span>
      <span className="text-xs sm:text-sm text-blue-100 mt-1 text-center">
        {label}
      </span>
    </motion.div>
  );
};

export default StatItem;
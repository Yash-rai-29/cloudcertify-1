"use client";
import React, { useState } from "react";
import { cn } from "../../utils/cn";
import { motion } from "framer-motion";

export const AnimatedCard = ({
  items,
  className,
  cardClassName,
}) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {items.map((item, idx) => (
        <AnimatedCardItem
          key={idx}
          item={item}
          className={cardClassName}
        />
      ))}
    </div>
  );
};

const AnimatedCardItem = ({ item, className }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * item.id }}
      viewport={{ once: true }}
      className={cn(
        "relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-md transition-all hover:shadow-xl",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${item.gradientColors}`}></div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
          {item.badge && (
            <div className={`text-xs px-2 py-1 rounded-full font-medium ${item.badgeColor}`}>
              {item.badge}
            </div>
          )}
        </div>
        
        {item.stats && (
          <div className="flex flex-wrap gap-2 mb-6">
            {item.stats.map((stat, index) => (
              <div key={index} className={`text-sm flex items-center px-3 py-1.5 rounded-full ${stat.bgColor} ${stat.textColor}`}>
                {stat.icon && <span className="mr-1.5">{stat.icon}</span>}
                <span>{stat.text}</span>
              </div>
            ))}
          </div>
        )}
        
        <motion.div 
          className="w-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            className={`w-full text-white px-5 py-3 rounded-lg font-medium shadow-md transition-all flex items-center justify-center ${item.buttonBg}`}
          >
            {item.buttonText}
            {item.buttonIcon && <span className="ml-2">{item.buttonIcon}</span>}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};
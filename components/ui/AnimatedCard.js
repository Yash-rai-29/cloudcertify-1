"use client";
import React, { useState } from "react";
import { cn } from "../../utils/cn";
import { motion } from "framer-motion";

export const AnimatedCard = ({
  items,
  className,
  cardClassName,
}) => {
  // Animation variants for consistent animations throughout the site
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (idx) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: idx * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -8,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {items.map((item, idx) => (
        <AnimatedCardItem
          key={idx}
          item={item}
          className={cardClassName}
          custom={idx}
          variants={itemVariants}
        />
      ))}
    </motion.div>
  );
};

const AnimatedCardItem = ({ item, className, custom, variants }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={variants}
      custom={custom}
      whileHover="hover"
      className={cn(
        "relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-all",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`h-2 w-full bg-gradient-to-r ${item.gradientColors}`}></div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-xl text-gray-800">{item.title}</h3>
          {item.badge && (
            <div className={`text-xs px-2.5 py-1 rounded-full font-medium ${item.badgeColor}`}>
              {item.badge}
            </div>
          )}
        </div>
        
        {item.stats && (
          <div className="flex flex-wrap gap-2 mb-6">
            {item.stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className={`text-sm flex items-center px-3 py-1.5 rounded-full ${stat.bgColor} ${stat.textColor}`}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)" 
                }}
                transition={{ duration: 0.2 }}
              >
                {stat.icon && <span className="mr-1.5">{stat.icon}</span>}
                <span>{stat.text}</span>
              </motion.div>
            ))}
          </div>
        )}
        
        {item.buttonText && (
          <motion.div 
            className="w-full"
            whileHover={{ 
              scale: 1.03,
              transition: { duration: 0.2 } 
            }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              className={`w-full text-white px-5 py-3 rounded-lg font-medium shadow-md transition-all flex items-center justify-center ${item.buttonBg}`}
            >
              {item.buttonText}
              {item.buttonIcon && <span className="ml-2">{item.buttonIcon}</span>}
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
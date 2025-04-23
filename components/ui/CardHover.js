"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const CardHover = ({
  items,
  className,
  cardClassName,
}) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);

  // Animation variants for consistent animations throughout the site
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (idx) => ({
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
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
    >
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          className={cn(
            "relative group block p-6 h-full w-full rounded-xl overflow-hidden",
            cardClassName
          )}
          variants={cardVariants}
          initial="initial"
          whileInView="animate"
          whileHover="hover"
          custom={idx}
          viewport={{ once: true, margin: "-50px" }}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div
            className={cn(
              "absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl",
              hoveredIndex === idx && "opacity-100"
            )}
          />
          <div className="absolute inset-0 rounded-xl bg-white dark:bg-black z-10 m-[1px]" />

          <div className="relative z-20 p-4">
            <div className="relative z-20">
              <div className="mb-2 transition-colors group-hover:text-white">
                {item.badge && (
                  <div className="inline-block text-xs font-medium bg-blue-100 text-blue-700 py-1 px-2.5 rounded-full">
                    {item.badge}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 mb-4">
                {item.icon && (
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 group-hover:bg-white/20 transition-colors">
                    <div className="group-hover:text-white transition-colors">{item.icon}</div>
                  </div>
                )}
                <h3 className="font-semibold text-xl text-gray-800 group-hover:text-white transition-colors">
                  {item.title}
                </h3>
              </div>
              <p className="text-gray-600 group-hover:text-white/90 text-sm transition-colors leading-relaxed">
                {item.description}
              </p>
            </div>
            
            {item.footer && (
              <div className="mt-4 pt-4 border-t border-gray-100 group-hover:border-white/20 transition-colors">
                {item.footer}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
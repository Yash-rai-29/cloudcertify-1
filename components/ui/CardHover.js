"use client";
import React, { useState, useRef } from "react";
import { cn } from "../../utils/cn";

export const CardHover = ({
  items,
  className,
  cardClassName,
}) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className={cn(
            "relative group block p-6 h-full w-full",
            cardClassName
          )}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div
            className={cn(
              "absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg",
              hoveredIndex === idx && "opacity-100"
            )}
          />
          <div className="absolute inset-0 rounded-xl bg-white dark:bg-black z-10 m-[1px]" />

          <div className="relative z-20 p-4">
            <div className="relative z-20">
              <div className="mb-2 text-neutral-600 dark:text-neutral-400 transition-colors group-hover:text-white">
                {item.badge && (
                  <div className="inline-block text-xs font-medium bg-purple-100 text-purple-800 py-1 px-2 rounded-full">
                    {item.badge}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mb-4">
                {item.icon && <div className="text-xl text-blue-500 group-hover:text-white">{item.icon}</div>}
                <h3 className="font-semibold text-xl text-neutral-800 dark:text-neutral-100 group-hover:text-white transition-colors">
                  {item.title}
                </h3>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 group-hover:text-white/80 text-sm transition-colors">
                {item.description}
              </p>
            </div>
            
            {item.footer && (
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 group-hover:border-white/20 transition-colors">
                {item.footer}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
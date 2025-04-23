"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const TextReveal = ({
  words,
  className,
  containerClassName,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const hoverTimer = useRef(null);

  // Handle real animation after mounting to prevent SSR issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseEnter = (index) => {
    clearTimeout(hoverTimer.current);
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    hoverTimer.current = setTimeout(() => {
      setHoveredIndex(null);
    }, 400);
  };

  if (!isMounted) {
    return (
      <div className={cn("flex gap-2 flex-wrap", containerClassName)}>
        {words.map((word, index) => (
          <div key={index} className={cn("relative", className)}>
            <span>{word}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex gap-2 flex-wrap", containerClassName)}>
      {words.map((word, index) => (
        <div
          key={index}
          className={cn("relative", className)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <div className="relative h-full w-full">
              {hoveredIndex === index && (
                <motion.div
                  initial={{ left: 0 }}
                  animate={{ left: "100%" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-blue-600/30 to-transparent"
                  style={{ top: 0, height: "100%", width: "50%" }}
                />
              )}
            </div>
          </div>
          <span
            className={cn(
              "relative z-20 transition-colors duration-300",
              hoveredIndex === index
                ? "text-blue-500 dark:text-blue-400"
                : ""
            )}
          >
            {word}
          </span>
        </div>
      ))}
    </div>
  );
};
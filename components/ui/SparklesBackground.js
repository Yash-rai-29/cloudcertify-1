"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

/**
 * SparklesBackground component with animated dots pattern
 */
export const SparklesBackground = ({
  children,
  className,
  containerClassName,
  ...props
}) => {
  return (
    <div className={cn("relative w-full", containerClassName)} style={{ position: "relative" }}>
      {/* Blue gradient background */}
      <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900" />
      
      {/* Static blue dots pattern that's always visible */}
      <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] bg-[size:16px_16px] opacity-20" />
      
      {/* Content container with proper animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={cn(
          "relative h-full w-full",
          className,
        )}
        {...props}
      >
        {children}
      </motion.div>
    </div>
  );
};

/**
 * Sparkles component for individual sparkle effect containers
 */
export const Sparkles = ({ className, children, ...props }) => {
  return (
    <motion.div 
      className={cn("relative w-full h-full", className)} 
      {...props}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5 }
      }}
    >
      {/* Static blue dots pattern for consistency */}
      <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] bg-[size:10px_10px] opacity-20"></div>
      
      {/* Content container */}
      <motion.div 
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

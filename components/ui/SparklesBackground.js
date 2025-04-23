"use client";
import React from "react";
import { cn } from "../../utils/cn";

export const SparklesBackground = ({
  children,
  className,
  containerClassName,
  ...props
}) => {
  return (
    <div className={cn("relative w-full", containerClassName)}>
      <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-indigo-600" />
      <div
        className={cn(
          "h-full w-full bg-dot-white/[0.2]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};

export const Sparkles = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"></div>
      {children}
    </div>
  );
};
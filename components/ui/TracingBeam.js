"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useTransform, useScroll, useSpring } from "framer-motion";
import { cn } from "../../utils/cn";

export const TracingBeam = ({ children, className, containerClassName }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const contentRef = useRef(null);
  const [svgHeight, setSvgHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setSvgHeight(contentRef.current.offsetHeight);
    }
  }, []);

  const y1 = useTransform(scrollYProgress, [0, 1], [50, svgHeight - 50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [50, svgHeight - 50]);

  const springyY1 = useSpring(y1, {
    stiffness: 100,
    damping: 30,
  });
  const springyY2 = useSpring(y2, {
    stiffness: 100,
    damping: 30,
  });

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full max-w-7xl mx-auto px-4", // Increased max width for consistency
        containerClassName,
      )}
      style={{ position: "relative" }}
    >
      <motion.div 
        ref={contentRef} 
        className={cn("relative z-10", className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>

      <div className="absolute inset-0 z-0">
        <motion.div
          transition={{ duration: 0.2 }}
          className="relative h-full w-full"
        >
          <svg
            className="absolute left-8 top-0 h-full w-[40px] sm:left-14"
            viewBox={`0 0 40 ${svgHeight}`}
            width="40"
            height={svgHeight}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Subtle dotted line */}
            <motion.path
              d={`M20 0L20 ${svgHeight}`}
              stroke="url(#gradient)"
              strokeWidth="2"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />

            {/* Tracing beam */}
            <motion.path
              d={`M20 ${springyY1} L20 ${springyY2}`}
              stroke="url(#gradient-bright)"
              strokeWidth="4"
              strokeLinecap="round"
            />

            <defs>
              <motion.linearGradient
                id="gradient"
                x1="0"
                y1="0"
                x2="0"
                y2={svgHeight}
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#3B82F6" stopOpacity="0" />
                <stop offset="0.3" stopColor="#3B82F6" stopOpacity="0.2" />
                <stop offset="0.5" stopColor="#3B82F6" stopOpacity="0.4" />
                <stop offset="0.7" stopColor="#3B82F6" stopOpacity="0.2" />
                <stop offset="1" stopColor="#3B82F6" stopOpacity="0" />
              </motion.linearGradient>

              <motion.linearGradient
                id="gradient-bright"
                x1="0"
                y1={springyY1}
                x2="0"
                y2={springyY2}
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#3B82F6" />
                <stop offset="0.5" stopColor="#1D4ED8" />
                <stop offset="1" stopColor="#3B82F6" />
              </motion.linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

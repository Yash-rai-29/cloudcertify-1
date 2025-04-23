"use client";
import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../utils/cn";

export const GlowingBackground = ({
  children,
  className,
  containerClassName,
  glowSize = "300px",
  glowOpacity = 0.3,
  glowColor = "rgba(120, 119, 198, 0.4)",
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const containerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPosition({ x, y });
      setOpacity(1);
    };

    const handleMouseLeave = () => {
      setOpacity(0);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [isMounted]);

  const glowStyles = {
    position: "absolute",
    width: glowSize,
    height: glowSize,
    background: glowColor,
    borderRadius: "50%",
    filter: "blur(80px)",
    opacity: opacity,
    left: `${position.x - parseInt(glowSize) / 2}px`,
    top: `${position.y - parseInt(glowSize) / 2}px`,
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
    transition: "opacity 0.2s",
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", containerClassName)}
    >
      {isMounted && <div style={glowStyles} />}
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
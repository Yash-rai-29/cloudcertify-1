"use client";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const FloatingNavbar = ({
  navItems,
  className,
  logoContent,
  buttonContent,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Update active index based on scroll position
      const sections = navItems.map(item => 
        document.querySelector(item.href)
      ).filter(Boolean);
      
      if (sections.length) {
        const scrollY = window.scrollY;
        // Find the section that's currently in view
        const currentSectionIdx = sections.findIndex(section => {
          const sectionTop = section.offsetTop - 100;
          const sectionBottom = sectionTop + section.offsetHeight;
          return scrollY >= sectionTop && scrollY < sectionBottom;
        });
        
        if (currentSectionIdx !== -1) {
          setActiveIdx(currentSectionIdx);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed top-6 inset-x-0 mx-auto w-fit z-[5000] flex justify-center",
          className
        )}
      >
        <div
          className={cn(
            "px-2 py-2 rounded-full flex items-center justify-center space-x-2",
            scrolled 
              ? "bg-white shadow-lg border border-neutral-200" 
              : "bg-black/10 backdrop-blur-md border border-white/20"
          )}
        >
          {logoContent && (
            <div className="flex items-center px-2">
              {logoContent}
            </div>
          )}

          <nav className="hidden md:flex items-center">
            {navItems.map((item, idx) => (
              <motion.a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.querySelector(item.href);
                  if (element) {
                    window.scrollTo({
                      top: element.offsetTop - 100,
                      behavior: "smooth",
                    });
                  }
                  setActiveIdx(idx);
                }}
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  activeIdx === idx
                    ? "text-white"
                    : scrolled
                    ? "text-neutral-600 hover:text-neutral-900"
                    : "text-white/90 hover:text-white"
                )}
              >
                {activeIdx === idx && (
                  <motion.div
                    layoutId="pill-tab"
                    transition={{ type: "spring", duration: 0.5 }}
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                  ></motion.div>
                )}
                <span className="relative z-10">{item.name}</span>
              </motion.a>
            ))}
          </nav>
          
          {buttonContent && (
            <div className="flex items-center ml-2">
              {buttonContent}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
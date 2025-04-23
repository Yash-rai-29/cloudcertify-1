"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiCloud, FiUser } from "react-icons/fi";
import { SparklesBackground } from "./ui/SparklesBackground";
import { TextReveal } from "./ui/TextReveal";
import { GlowingBackground } from "./ui/GlowingBackground";
import { useAuth } from "../contexts/AuthContext";

// Import reusable landing components
import HeroButton from "./landing/HeroButton";
import StatItem from "./landing/StatItem";
import HeroBadge from "./landing/HeroBadge";

/**
 * Hero section component for the landing page
 */
const HeroSection = () => {
  const { user } = useAuth();
  
  // Stats data for the hero section
  const stats = [
    { value: "15,000+", label: "Certified Professionals" },
    { value: "94%", label: "Success Rate" },
    { value: "2,500+", label: "Practice Questions" },
    { value: "4 Weeks", label: "Avg. Prep Time" },
  ];
  
  return (
    <section id="hero" className="relative w-full overflow-hidden">
      <SparklesBackground containerClassName="min-h-screen">
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* GCP Certification Badge */}
            <HeroBadge 
              icon={<FiCloud className="text-lg" />}
              text="Google Cloud Platform Certification"
              className="mb-6"
            />

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            >
              Become a{" "}
              <motion.span 
                className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent px-3 relative inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                certified
                <motion.div 
                  className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                />
              </motion.span>{" "}
              GCP professional
            </motion.h1>

            {/* Subtitle with Text Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <TextReveal
                words={[
                  "Interactive",
                  "practice",
                  "tests,",
                  "performance",
                  "analytics,",
                  "and",
                  "expert-curated",
                  "content."
                ]}
                className="text-xl md:text-2xl font-medium text-blue-100"
                containerClassName="justify-center mb-10 mt-4"
              />
            </motion.div>

            {/* CTA Buttons */}
            <GlowingBackground 
              containerClassName="py-4"
              glowSize="250px"
              glowColor="rgba(79, 70, 229, 0.4)"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
              >
                {user ? (
                  // Dashboard button for logged in users
                  <HeroButton 
                    href="/dashboard" 
                    icon={<FiUser />}
                  >
                    Go to Dashboard
                  </HeroButton>
                ) : (
                  // Sign up and login buttons for visitors
                  <>
                    <HeroButton 
                      href="/signup"
                      icon={<FiArrowRight />}
                    >
                      Sign Up Now
                    </HeroButton>
                    <HeroButton 
                      href="/login"
                      primary={false}
                    >
                      Log In
                    </HeroButton>
                  </>
                )}
              </motion.div>
            </GlowingBackground>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-white max-w-3xl mx-auto"
            >
              {stats.map((stat, index) => (
                <StatItem
                  key={index}
                  value={stat.value}
                  label={stat.label}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </SparklesBackground>
    </section>
  );
};

export default HeroSection;
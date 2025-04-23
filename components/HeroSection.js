"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiCloud, FiUser } from "react-icons/fi";
import { SparklesBackground } from "./ui/SparklesBackground";
import { TextReveal } from "./ui/TextReveal";
import { GlowingBackground } from "./ui/GlowingBackground";
import { useAuth } from "../contexts/AuthContext";

const HeroSection = () => {
  const { user } = useAuth();
  
  return (
    <section id="hero" className="relative w-full overflow-hidden">
      <SparklesBackground containerClassName="min-h-screen">
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6"
            >
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white border border-white/20">
                <FiCloud className="text-lg" />
                <span className="text-sm font-medium">
                  Google Cloud Platform Certification
                </span>
              </div>
            </motion.div>

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
                  // Show dashboard button if logged in
                  <motion.a
                    href="/dashboard"
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                  >
                    Go to Dashboard <FiUser className="ml-2" />
                  </motion.a>
                ) : (
                  // Show login/signup buttons if not logged in
                  <>
                    <motion.a
                      href="/signup"
                      whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                    >
                      Sign Up Now <FiArrowRight className="ml-2" />
                    </motion.a>
                    <motion.a
                      href="/login"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center"
                    >
                      Log In
                    </motion.a>
                  </>
                )}
              </motion.div>
            </GlowingBackground>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-white max-w-3xl mx-auto"
            >
              {[
                { value: "15,000+", label: "Certified Professionals" },
                { value: "94%", label: "Success Rate" },
                { value: "2,500+", label: "Practice Questions" },
                { value: "4 Weeks", label: "Avg. Prep Time" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)",
                    backgroundColor: "rgba(255, 255, 255, 0.15)" 
                  }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-all"
                >
                  <div className="text-2xl md:text-3xl font-bold mb-1">
                    {stat.value}
                  </div>
                  <div className="text-blue-100 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </SparklesBackground>
    </section>
  );
};

export default HeroSection;
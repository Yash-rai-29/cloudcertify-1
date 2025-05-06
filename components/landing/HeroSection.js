"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiCloud, FiUser } from "react-icons/fi";
import { SparklesBackground } from "../ui/SparklesBackground";
import { TextReveal } from "../ui/TextReveal";
import { GlowingBackground } from "../ui/GlowingBackground";
import { useAuth } from "../../contexts/AuthContext";
import { ContainerScroll, Card, Header } from "../ui/container-scroll-animation";
import Image from "next/image";

// Import reusable landing components
import HeroButton from "./HeroButton";
import StatItem from "./StatItem";
import HeroBadge from "./HeroBadge";

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
  
  // Create heading component for ContainerScroll
  const titleComponent = (
    <div className="flex flex-col items-center justify-center">
      <HeroBadge 
        icon={<FiCloud className="text-lg" />}
        text="Google Cloud Platform Certification"
        className="mb-6"
      />
      
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-center">
        Become a{" "}
        <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent px-3 relative inline-block">
          certified
          <div className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full" />
        </span>{" "}
        GCP professional
      </h1>
      
      <p className="text-xl md:text-2xl font-medium text-blue-100 mb-8 text-center max-w-4xl">
        Interactive practice tests, performance analytics, and expert-curated content.
      </p>
    </div>
  );
  
  return (
    <section id="hero" className="relative w-full overflow-hidden">
      <SparklesBackground containerClassName="min-h-screen">
        <div className="container mx-auto px-4 py-4 md:py-8 relative z-10">
          {/* Container Scroll with just the dashboard image */}
          <ContainerScroll titleComponent={titleComponent}>
            <div className="flex items-center justify-center h-full w-full">
              <img
                src="/images/dashboard.png"
                alt="Cloud Certify Dashboard"
                className="w-full h-full object-cover"
              />
            </div>
          </ContainerScroll>
    
        </div>
      </SparklesBackground>
    </section>
  );
};

export default HeroSection;
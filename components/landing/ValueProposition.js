"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  FiTarget,
  FiTrendingUp,
  FiClock,
  FiBarChart,
  FiShield,
  FiBook,
} from "react-icons/fi";
import { GlowingBackground } from "../ui/GlowingBackground";
import { Sparkles } from "../ui/SparklesBackground";
// import { TracingBeam } from "../ui/TracingBeam";
import dynamic from 'next/dynamic';
import GoogleCloudAnimation from "../../assets/GoogleCloudAnimation.json";

// Import Lottie as a client-side only component
const ClientLottie = dynamic(() => import('../ui/ClientLottie'), { 
  ssr: false,
  loading: () => <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg animate-pulse" />
});

const valueItems = [
  {
    id: 1,
    title: "Targeted Learning Paths",
    description:
      "Customized study plans based on your strengths and weaknesses to accelerate your certification journey",
    icon: <FiTarget size={20} />,
    badge: "Popular",
  },
  {
    id: 2,
    title: "Performance Analytics",
    description:
      "Detailed insights into your test performance and improvement areas with visual dashboards",
    icon: <FiTrendingUp size={20} />,
  },
  {
    id: 3,
    title: "Time Management Tools",
    description:
      "Learn to optimize your time during the actual certification exam with proven techniques",
    icon: <FiClock size={20} />,
  },
  {
    id: 4,
    title: "Progress Tracking",
    description:
      "Visual dashboards to monitor your progress and readiness with personalized recommendations",
    icon: <FiBarChart size={20} />,
  },
  {
    id: 5,
    title: "Exam-Aligned Content",
    description:
      "Questions and scenarios that mirror the actual GCP certification exams for real-world preparation",
    icon: <FiShield size={20} />,
  },
  {
    id: 6,
    title: "Comprehensive Study Material",
    description:
      "In-depth explanations and references for further learning with expert-curated content",
    icon: <FiBook size={20} />,
  },
];

// Fixed FeatureCard with proper hover effects
const FeatureCard = ({ item, index }) => {
  const iconRef = useRef(null);
  
  return (
    <motion.div
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        y: -8,
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.2 } 
      }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* Background overlay - fixed with proper z-index and no conflicting animations */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-all duration-300 z-0"
      />
      
      <div className="relative z-10 p-6 md:p-8 flex flex-col h-full">
        {/* Icon container with fixed hover effect */}
        <div 
          className="w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center mb-5 group-hover:bg-white/20 transition-colors duration-300"
        >
          <div
            ref={iconRef}
            className="text-blue-600 group-hover:text-white transition-colors duration-300"
          >
            {item.icon}
          </div>
        </div>
        
        {/* Badge with correct hover effect */}
        {item.badge && (
          <div 
            className="absolute top-6 right-6 text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full group-hover:bg-white group-hover:text-blue-700 transition-colors duration-300"
          >
            {item.badge}
          </div>
        )}
        
        {/* Title with fixed hover text effect */}
        <h3 
          className="text-xl font-bold mb-3 text-gray-800 group-hover:text-white transition-colors duration-300"
        >
          {item.title}
        </h3>
        
        {/* Description with fixed hover text effect */}
        <p 
          className="text-gray-600 group-hover:text-white transition-colors duration-300"
        >
          {item.description}
        </p>
        
        {/* Learn more link with proper hover effect */}
        <div 
          className="mt-auto pt-4 flex items-center text-blue-600 group-hover:text-white font-medium text-sm transition-colors duration-300"
        >
          <span>Learn more</span>
          <span className="ml-1 group-hover:translate-x-1 transition-transform duration-300">
            →
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const ValueProposition = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.7, 1]);
  const lottieRef = useRef(null);

  return (
    <section id="value-proposition" className="py-4 md:py-16 relative">
      {/* Background animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1], 
            opacity: [0.4, 0.6, 0.4],
            x: [0, 20, 0],
            y: [0, 15, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute top-1/3 -right-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.15, 1], 
            opacity: [0.3, 0.5, 0.3],
            x: [0, -15, 0],
            y: [0, 20, 0]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute -bottom-40 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.3, 0.5, 0.3],
            x: [0, 25, 0],
            y: [0, -10, 0] 
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2,
          }}
        />
      </div>

      {/* <TracingBeam> */}
        <motion.div
          className="container mx-auto px-4 relative z-10"
          style={{ scale, opacity }}
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-1.5 mb-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 rounded-full text-sm font-medium border border-blue-200/50"
            >
              <Sparkles>Features & Benefits</Sparkles>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700"
            >
              Why Cloud Certify Is Your Best Choice
              <motion.div
                className="absolute -bottom-3 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent rounded-full"
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                viewport={{ once: true }}
              />
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: -15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-600 max-w-3xl mx-auto mt-6 text-lg"
            >
              Our platform is designed specifically for Google Cloud Platform
              certifications, with powerful features that accelerate your
              learning journey.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {valueItems.map((item, index) => (
              <FeatureCard key={item.id} item={item} index={index} />
            ))}
          </div>

          <GlowingBackground
            containerClassName="rounded-2xl overflow-hidden"
            glowSize="350px"
            glowOpacity={0.6}
            glowColor="rgba(37, 99, 235, 0.4)"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-10 md:p-12 text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div>
                    <motion.h3
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="text-2xl md:text-3xl font-bold mb-6"
                    >
                      Ready to accelerate your GCP certification journey?
                    </motion.h3>
                    
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="text-lg opacity-90 mb-8"
                    >
                      Let Cloud Certify be your trusted guide. Start today and
                      experience smarter, faster, and more effective
                      preparation.
                    </motion.p>
                    
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white text-blue-600 font-semibold px-8 py-3.5 rounded-lg shadow-lg hover:bg-blue-50 transition-all"
                    >
                      Get Started Free
                    </motion.button>
                  </div>
                  
                  <div className="hidden md:flex justify-center items-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.3 }}
                      className="w-full max-w-md"
                    >
                      {/* Lottie animation */}
                      <ClientLottie
                        lottieRef={lottieRef}
                        animationData={GoogleCloudAnimation}
                        loop={true}
                        autoplay={true}
                        style={{ width: '100%', height: '100%' }}
                        onMouseEnter={() => {
                          lottieRef.current?.setSpeed(1.5);
                          lottieRef.current?.play();
                        }}
                        onMouseLeave={() => {
                          lottieRef.current?.setSpeed(1);
                        }}
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </GlowingBackground>
        </motion.div>
      {/* </TracingBeam> */}
    </section>
  );
};

export default ValueProposition;

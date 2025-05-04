"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  FiCloud, 
  FiDatabase, 
  FiCode, 
  FiServer, 
  FiLock, 
  FiShare2 
} from "react-icons/fi";
import { GlowingBackground } from "./ui/GlowingBackground";
import { Sparkles } from "./ui/SparklesBackground";
import { TracingBeam } from "./ui/TracingBeam";
import dynamic from 'next/dynamic';
import GoogleCloudAnimation from "../assets/GoogleCloudAnimation.json";

// Import Lottie as a client-side only component
const ClientLottie = dynamic(() => import('./ui/ClientLottie'), { 
  ssr: false,
  loading: () => <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg animate-pulse" />
});

// Customized certification data with unique icons and badges
const certifications = [
  {
    title: "Associate Cloud Engineer",
    description: "For individuals who deploy applications, monitor operations, and manage enterprise solutions",
    color: "green",
    icon: <FiCloud size={22} />,
    difficulty: "Entry-Level",
    testCount: 340,
  },
  {
    title: "Professional Cloud Architect",
    description: "For professionals who design, develop, and manage robust, secure, scalable, highly available cloud solutions",
    color: "blue",
    icon: <FiServer size={22} />,
    difficulty: "Advanced",
    testCount: 620,
    popular: true,
  },
  {
    title: "Professional Data Engineer",
    description: "For professionals who design and build data processing systems and create machine learning models",
    color: "purple",
    icon: <FiDatabase size={22} />,
    difficulty: "Advanced",
    testCount: 480,
  },
  {
    title: "Professional Cloud Developer",
    description: "For developers who build scalable and highly available applications using Google Cloud technologies",
    color: "indigo",
    icon: <FiCode size={22} />,
    difficulty: "Intermediate",
    testCount: 530,
  },
  {
    title: "Professional Cloud Network Engineer",
    description: "For professionals who implement and manage network architectures in Google Cloud",
    color: "cyan",
    icon: <FiShare2 size={22} />,
    difficulty: "Advanced",
    testCount: 410,
  },
  {
    title: "Professional Cloud Security Engineer",
    description: "For security professionals who design and implement secure infrastructure on Google Cloud",
    color: "red",
    icon: <FiLock size={22} />,
    difficulty: "Advanced",
    testCount: 490,
  },
];

// Enhanced certification card with improved hover effects
const CertificationCard = ({ cert, index }) => {
  // Map color names to Tailwind classes
  const colorMap = {
    green: "bg-green-500 text-green-600 border-green-200 bg-green-50",
    blue: "bg-blue-500 text-blue-600 border-blue-200 bg-blue-50",
    purple: "bg-purple-500 text-purple-600 border-purple-200 bg-purple-50",
    indigo: "bg-indigo-500 text-indigo-600 border-indigo-200 bg-indigo-50",
    cyan: "bg-cyan-500 text-cyan-600 border-cyan-200 bg-cyan-50",
    red: "bg-red-500 text-red-600 border-red-200 bg-red-50",
  };
  
  // Extract the classes for this certification
  const [bgColor, textColor, borderColor, bgLight] = colorMap[cert.color].split(" ");
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="relative group"
    >
      <motion.div
        whileHover={{ 
          y: -8, 
          transition: { duration: 0.2 },
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 h-full transition-all duration-300"
      >
        {/* Colored top bar that extends on hover */}
        <div 
          className={`h-2 w-full ${bgColor} group-hover:h-12 transition-all duration-300 relative overflow-hidden`}
        >
          <motion.div 
            className="absolute inset-0 opacity-20"
            animate={{ 
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
            style={{
              backgroundSize: "400% 400%",
              backgroundImage: "linear-gradient(45deg, transparent 0%, white 50%, transparent 100%)"
            }}
          />
          
          {/* Badge that appears on hover */}
          <div className="hidden group-hover:flex items-center justify-between text-white p-4 transition-all duration-300">
            <span className="text-sm font-medium">{cert.difficulty}</span>
            <span className="text-xs flex items-center">
              <span className="w-2 h-2 rounded-full bg-white mr-1"></span> 
              {cert.testCount} Tests
            </span>
          </div>
        </div>
        
        {/* Card content */}
        <div className="p-6">
          <div className="flex items-start gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgLight} border ${borderColor} shrink-0`}>
              <span className={`${textColor}`}>{cert.icon}</span>
            </div>
            
            <div>
              <div className="flex items-center">
                <h3 className="font-bold text-lg text-gray-800">{cert.title}</h3>
                {cert.popular && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                    Popular
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">{cert.description}</p>
            </div>
          </div>
        </div>
        
        {/* Action area that appears on hover
        <div className="px-6 pb-6 pt-1">
          <div className="h-px w-full bg-gray-100 mb-4"></div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {cert.testCount} practice questions
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-lg ${bgLight} ${textColor} text-sm font-medium transition-colors duration-300`}
            >
              Explore
            </motion.button>
          </div>
        </div> */}
      </motion.div>
    </motion.div>
  );
};

const TestLibrary = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.8, 1]);
  const lottieRef = useRef(null);

  return (
    <section id="test-library" className="py-4 md:py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none bg-gradient-to-b from-white to-blue-50/30">
        <motion.div
          className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1], 
            opacity: [0.3, 0.5, 0.3],
            x: [0, 20, 0],
            y: [0, 15, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute top-1/3 -right-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.15, 1], 
            opacity: [0.2, 0.4, 0.2],
            x: [0, -15, 0],
            y: [0, 20, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />
      </div>

      <TracingBeam>
        <motion.div
          className="container mx-auto px-4 relative z-10"
          style={{ scale, opacity }}
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 mb-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 rounded-full text-sm font-medium border border-blue-200/50"
            >
              <Sparkles>Comprehensive Test Library</Sparkles>
            </motion.div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mb-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700"
              >
                Google Cloud Platform Certifications
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-24 h-24 md:w-32 md:h-32 shrink-0"
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
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-600 max-w-3xl mx-auto mb-10 text-lg"
            >
              Prepare for your certification with our comprehensive practice tests, custom study plans,
              and expert-verified questions that mirror the actual exam experience.
            </motion.p>
          </div>

          <GlowingBackground
            containerClassName="relative mb-12"
            glowSize="350px"
            glowOpacity={0.2}
            glowColor="rgba(59, 130, 246, 0.3)"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {certifications.map((cert, index) => (
                <CertificationCard key={index} cert={cert} index={index} />
              ))}
            </div>
          </GlowingBackground>
        </motion.div>
      </TracingBeam>
    </section>
  );
};

export default TestLibrary;

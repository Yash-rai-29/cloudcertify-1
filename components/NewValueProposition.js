"use client";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiTarget, FiTrendingUp, FiClock, FiBarChart, FiShield, FiBook, FiArrowRight } from "react-icons/fi";
import { TracingBeam } from "./ui/TracingBeam";
import { GlowingBackground } from "./ui/GlowingBackground";
import { Sparkles } from "./ui/SparklesBackground";

const NewValueProposition = () => {
  const valueItems = [
    {
      id: 1,
      title: "Targeted Learning Paths",
      description: "Customized study plans based on your strengths and weaknesses to accelerate your certification journey",
      icon: <FiTarget className="text-blue-600" size={20} />,
      badge: "Popular"
    },
    {
      id: 2,
      title: "Performance Analytics",
      description: "Detailed insights into your test performance and improvement areas with visual dashboards",
      icon: <FiTrendingUp className="text-blue-600" size={20} />
    },
    {
      id: 3,
      title: "Time Management Tools",
      description: "Learn to optimize your time during the actual certification exam with proven techniques",
      icon: <FiClock className="text-blue-600" size={20} />
    },
    {
      id: 4,
      title: "Progress Tracking",
      description: "Visual dashboards to monitor your progress and readiness with personalized recommendations",
      icon: <FiBarChart className="text-blue-600" size={20} />
    },
    {
      id: 5,
      title: "Exam-Aligned Content",
      description: "Questions and scenarios that mirror the actual GCP certification exams for real-world preparation",
      icon: <FiShield className="text-blue-600" size={20} />
    },
    {
      id: 6,
      title: "Comprehensive Study Material",
      description: "In-depth explanations and references for further learning with expert-curated content",
      icon: <FiBook className="text-blue-600" size={20} />
    },
  ];

  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.8, 1]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 15,
        duration: 0.7 
      }
    }
  };

  // Custom feature card with advanced animations
  const FeatureCard = ({ item, index }) => {
    return (
      <motion.div
        className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.6, 
            delay: index * 0.1,
            ease: [0.25, 0.1, 0.25, 1]
          }
        }}
        whileHover={{ 
          y: -10, 
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Gradient overlay on hover */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        />
        
        {/* Card content */}
        <div className="relative z-10 p-6 md:p-8 h-full flex flex-col transition-colors duration-300">
          {/* Card icon */}
          <div className="w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center mb-5 group-hover:bg-white/20 transition-colors duration-300">
            <motion.div 
              className="text-blue-600 group-hover:text-white transition-colors duration-300"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              {item.icon}
            </motion.div>
          </div>
          
          {/* Badge */}
          {item.badge && (
            <div className="absolute top-6 right-6">
              <div className="text-xs font-medium bg-blue-100 text-blue-700 group-hover:bg-white group-hover:text-blue-700 px-2.5 py-1 rounded-full transition-colors duration-300">
                {item.badge}
              </div>
            </div>
          )}
          
          {/* Title */}
          <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-white transition-colors duration-300">
            {item.title}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 group-hover:text-white/90 mb-4 transition-colors duration-300">
            {item.description}
          </p>
          
          {/* Background pattern shape */}
          <div className="absolute bottom-0 right-0 w-24 h-24 rounded-tl-3xl bg-blue-50/30 group-hover:bg-white/5 -z-10 transition-colors duration-300"></div>
        </div>
      </motion.div>
    );
  };

  return (
    <section id="value-proposition" className="py-24 bg-white relative" style={{ position: 'relative' }}>
      {/* Background decorative elements with blue accent */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }} 
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        <motion.div 
          className="absolute top-1/3 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }} 
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute -bottom-40 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3]
          }} 
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
        />
      </div>
      
      <TracingBeam>
        <motion.div 
          className="container mx-auto px-4 relative z-10 max-w-7xl"
          style={{ scale, opacity }}
        >
          {/* Section header with enhanced animations */}
          <motion.div 
            className="text-center mb-20"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              variants={titleVariants}
              className="inline-block px-4 py-1.5 mb-4 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200/50"
            >
              <Sparkles className="w-full h-full">
                Features & Benefits
              </Sparkles>
            </motion.div>

            <motion.h2
              variants={titleVariants}
              className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700 relative inline-block"
            >
              Why Cloud Certify Is Your Best Choice
              <motion.div 
                className="absolute -bottom-3 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                viewport={{ once: true }}
              />
            </motion.h2>

            <motion.p
              variants={titleVariants}
              className="text-gray-600 max-w-3xl mx-auto mt-6 text-lg leading-relaxed"
            >
              Our platform is designed specifically for Google Cloud Platform certifications,
              with powerful features that accelerate your learning journey.
            </motion.p>
          </motion.div>

          {/* Feature cards - custom grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {valueItems.map((item, index) => (
              <FeatureCard key={index} item={item} index={index} />
            ))}
          </div>

          {/* CTA section with enhanced visuals */}
          <GlowingBackground
            containerClassName="rounded-2xl overflow-hidden"
            glowSize="350px" 
            glowOpacity={0.4}
            glowColor="rgba(37, 99, 235, 0.4)"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-10 md:p-12 text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-6 relative">
                      Ready to accelerate your GCP certification journey?
                      <motion.div 
                        className="absolute -bottom-3 left-0 w-24 h-1.5 bg-white rounded-full"
                        initial={{ width: 0, opacity: 0 }}
                        whileInView={{ width: 96, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        viewport={{ once: true }}
                      />
                    </h3>
                    <p className="mb-8 text-blue-100 text-lg leading-relaxed">
                      Join thousands of successful IT professionals who have earned their Google Cloud certifications with Cloud Certify.
                      Our proven methodology has helped candidates achieve a 94% pass rate.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <motion.button
                        whileHover={{ 
                          scale: 1.05, 
                          boxShadow: "0 15px 25px -5px rgba(0, 0, 0, 0.2)",
                          backgroundColor: "rgba(255, 255, 255, 0.95)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold shadow-lg flex items-center"
                      >
                        Start Your Free Trial <FiArrowRight className="ml-2" />
                      </motion.button>
                      <motion.button
                        whileHover={{ 
                          scale: 1.05, 
                          backgroundColor: "rgba(255, 255, 255, 0.15)",
                          boxShadow: "0 10px 15px -5px rgba(0, 0, 0, 0.1)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="border border-white/30 px-8 py-4 rounded-xl font-medium"
                      >
                        See Pricing
                      </motion.button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    {[
                      { label: "Certified Professionals", value: "15,000+" },
                      { label: "Practice Questions", value: "2,500+" },
                      { label: "Success Rate", value: "94%" },
                      { label: "Average Prep Time", value: "4 Weeks" },
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.2)",
                          backgroundColor: "rgba(255, 255, 255, 0.15)" 
                        }}
                        className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 transition-all overflow-hidden relative"
                      >
                        <div className="text-3xl font-bold mb-2">{stat.value}</div>
                        <div className="text-blue-100">{stat.label}</div>
                        <div className="absolute -bottom-2 -right-2 w-16 h-16 rounded-tl-2xl bg-white/5 -z-10"></div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </GlowingBackground>
        </motion.div>
      </TracingBeam>
    </section>
  );
};

export default NewValueProposition;
"use client";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiTarget, FiTrendingUp, FiClock, FiBarChart, FiShield, FiBook, FiArrowRight } from "react-icons/fi";
import { CardHover } from "./ui/CardHover";
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
      icon: <FiTrendingUp className="text-indigo-600" size={20} />
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
      icon: <FiBarChart className="text-indigo-600" size={20} />
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
      icon: <FiBook className="text-indigo-600" size={20} />
    },
  ];

  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 1]);

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

  return (
    <section id="value-proposition" className="py-20 bg-gradient-to-b from-white to-blue-50/30 relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <TracingBeam>
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          style={{ scale, opacity }}
        >
          <motion.div 
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              variants={titleVariants}
              className="inline-block px-4 py-1.5 mb-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 rounded-full text-sm font-medium border border-blue-200/50"
            >
              <Sparkles className="w-full h-full">
                Features & Benefits
              </Sparkles>
            </motion.div>

            <motion.h2
              variants={titleVariants}
              className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 relative inline-block"
            >
              Why Cloud Certify Is Your Best Choice
              <motion.div 
                className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent rounded-full"
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                viewport={{ once: true }}
              />
            </motion.h2>

            <motion.p
              variants={titleVariants}
              className="text-gray-600 max-w-2xl mx-auto mt-6"
            >
              Our platform is designed specifically for Google Cloud Platform certifications,
              with powerful features that accelerate your learning journey.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <CardHover 
              items={valueItems} 
              cardClassName="backdrop-blur-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            />
          </motion.div>

          <GlowingBackground
            containerClassName="mt-20 rounded-2xl overflow-hidden"
            glowSize="300px" 
            glowOpacity={0.4}
            glowColor="rgba(79, 70, 229, 0.4)"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-10 text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 relative">
                      Ready to accelerate your GCP certification journey?
                      <motion.div 
                        className="absolute -bottom-2 left-0 w-16 h-1.5 bg-white rounded-full"
                        initial={{ width: 0, opacity: 0 }}
                        whileInView={{ width: 64, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        viewport={{ once: true }}
                      />
                    </h3>
                    <p className="mb-8 text-blue-100">
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
                        className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-lg flex items-center"
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
                        className="border border-white/30 px-6 py-3 rounded-lg font-medium"
                      >
                        See Pricing
                      </motion.button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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
                        className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20 transition-all"
                      >
                        <div className="text-2xl font-bold mb-1">{stat.value}</div>
                        <div className="text-blue-100 text-sm">{stat.label}</div>
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
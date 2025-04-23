"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiTarget, FiTrendingUp, FiClock, FiBarChart, FiShield, FiBook, FiArrowRight } from "react-icons/fi";
import { CardHover } from "./ui/CardHover";
import { TracingBeam } from "./ui/TracingBeam";
import { GlowingBackground } from "./ui/GlowingBackground";

const NewValueProposition = () => {
  const valueItems = [
    {
      id: 1,
      title: "Targeted Learning Paths",
      description: "Customized study plans based on your strengths and weaknesses",
      icon: <FiTarget />,
      badge: "Popular",
      footer: (
        <a href="#" className="flex items-center text-sm text-blue-600 hover:underline">
          Learn more <FiArrowRight className="ml-1" size={14} />
        </a>
      )
    },
    {
      id: 2,
      title: "Performance Analytics",
      description: "Detailed insights into your test performance and improvement areas",
      icon: <FiTrendingUp />,
      footer: (
        <a href="#" className="flex items-center text-sm text-blue-600 hover:underline">
          Learn more <FiArrowRight className="ml-1" size={14} />
        </a>
      )
    },
    {
      id: 3,
      title: "Time Management Tools",
      description: "Learn to optimize your time during the actual certification exam",
      icon: <FiClock />,
      footer: (
        <a href="#" className="flex items-center text-sm text-blue-600 hover:underline">
          Learn more <FiArrowRight className="ml-1" size={14} />
        </a>
      )
    },
    {
      id: 4,
      title: "Progress Tracking",
      description: "Visual dashboards to monitor your progress and readiness",
      icon: <FiBarChart />,
      footer: (
        <a href="#" className="flex items-center text-sm text-blue-600 hover:underline">
          Learn more <FiArrowRight className="ml-1" size={14} />
        </a>
      )
    },
    {
      id: 5,
      title: "Exam-Aligned Content",
      description: "Questions and scenarios that mirror the actual GCP certification exams",
      icon: <FiShield />,
      footer: (
        <a href="#" className="flex items-center text-sm text-blue-600 hover:underline">
          Learn more <FiArrowRight className="ml-1" size={14} />
        </a>
      )
    },
    {
      id: 6,
      title: "Comprehensive Study Material",
      description: "In-depth explanations and references for further learning",
      icon: <FiBook />,
      footer: (
        <a href="#" className="flex items-center text-sm text-blue-600 hover:underline">
          Learn more <FiArrowRight className="ml-1" size={14} />
        </a>
      )
    },
  ];

  return (
    <section id="value-proposition" className="py-20 bg-white">
      <TracingBeam>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 mb-4 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
            >
              Features & Benefits
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700"
            >
              Why Cloud Certify Is Your Best Choice
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Our platform is designed specifically for Google Cloud Platform certifications,
              with powerful features that accelerate your learning journey.
            </motion.p>
          </div>

          <CardHover 
            items={valueItems} 
            cardClassName="backdrop-blur-sm hover:shadow-xl transition-all duration-300"
          />

          <GlowingBackground
            containerClassName="mt-20 rounded-2xl overflow-hidden"
            glowSize="300px" 
            glowOpacity={0.4}
            glowColor="rgba(79, 70, 229, 0.4)"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-10 text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 relative">
                      Ready to accelerate your GCP certification journey?
                      <motion.div 
                        className="absolute -bottom-2 left-0 w-16 h-1 bg-white rounded-full"
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
                        whileHover={{ scale: 1.05, boxShadow: "0 15px 25px -5px rgba(0, 0, 0, 0.2)" }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-lg flex items-center"
                      >
                        Start Your Free Trial <FiArrowRight className="ml-2" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
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
                        className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 transition-all"
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
        </div>
      </TracingBeam>
    </section>
  );
};

export default NewValueProposition;
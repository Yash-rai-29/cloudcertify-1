"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiTarget, FiTrendingUp, FiClock, FiBarChart, FiShield, FiBook } from "react-icons/fi";
import { CardHover } from "./ui/CardHover";

const NewValueProposition = () => {
  const valueItems = [
    {
      id: 1,
      title: "Targeted Learning Paths",
      description: "Customized study plans based on your strengths and weaknesses",
      icon: <FiTarget />,
      badge: "Popular"
    },
    {
      id: 2,
      title: "Performance Analytics",
      description: "Detailed insights into your test performance and improvement areas",
      icon: <FiTrendingUp />
    },
    {
      id: 3,
      title: "Time Management Tools",
      description: "Learn to optimize your time during the actual certification exam",
      icon: <FiClock />
    },
    {
      id: 4,
      title: "Progress Tracking",
      description: "Visual dashboards to monitor your progress and readiness",
      icon: <FiBarChart />
    },
    {
      id: 5,
      title: "Exam-Aligned Content",
      description: "Questions and scenarios that mirror the actual GCP certification exams",
      icon: <FiShield />
    },
    {
      id: 6,
      title: "Comprehensive Study Material",
      description: "In-depth explanations and references for further learning",
      icon: <FiBook />
    },
  ];

  return (
    <section id="value-proposition" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
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
            className="text-3xl md:text-4xl font-bold mb-4"
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

        <CardHover items={valueItems} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-10 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Ready to accelerate your GCP certification journey?</h3>
                <p className="mb-8 text-blue-100">
                  Join thousands of successful IT professionals who have earned their Google Cloud certifications with Cloud Certify.
                  Our proven methodology has helped candidates achieve a 94% pass rate.
                </p>
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-lg"
                  >
                    Start Your Free Trial
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border border-white/30 px-6 py-3 rounded-lg font-medium hover:bg-white/10"
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
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20"
                  >
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-blue-100 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewValueProposition;
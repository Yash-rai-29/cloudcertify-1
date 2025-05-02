"use client";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  FiTarget,
  FiTrendingUp,
  FiClock,
  FiBarChart,
  FiShield,
  FiBook,
} from "react-icons/fi";
import { GlowingBackground } from "./ui/GlowingBackground";
import { Sparkles } from "./ui/SparklesBackground";
import { TracingBeam } from "./ui/TracingBeam";

const valueItems = [
  {
    id: 1,
    title: "Targeted Learning Paths",
    description:
      "Customized study plans based on your strengths and weaknesses to accelerate your certification journey",
    icon: <FiTarget className="text-blue-600" size={20} />,
    badge: "Popular",
  },
  {
    id: 2,
    title: "Performance Analytics",
    description:
      "Detailed insights into your test performance and improvement areas with visual dashboards",
    icon: <FiTrendingUp className="text-indigo-600" size={20} />,
  },
  {
    id: 3,
    title: "Time Management Tools",
    description:
      "Learn to optimize your time during the actual certification exam with proven techniques",
    icon: <FiClock className="text-blue-600" size={20} />,
  },
  {
    id: 4,
    title: "Progress Tracking",
    description:
      "Visual dashboards to monitor your progress and readiness with personalized recommendations",
    icon: <FiBarChart className="text-indigo-600" size={20} />,
  },
  {
    id: 5,
    title: "Exam-Aligned Content",
    description:
      "Questions and scenarios that mirror the actual GCP certification exams for real-world preparation",
    icon: <FiShield className="text-blue-600" size={20} />,
  },
  {
    id: 6,
    title: "Comprehensive Study Material",
    description:
      "In-depth explanations and references for further learning with expert-curated content",
    icon: <FiBook className="text-indigo-600" size={20} />,
  },
];

const FeatureCard = ({ item, index }) => (
  <motion.div
    className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    whileHover={{ y: -10, transition: { duration: 0.3 } }}
    viewport={{ once: true, margin: "-100px" }}
  >
    <motion.div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
    <div className="relative z-10 p-6 md:p-8 flex flex-col h-full">
      <div className="w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center mb-5 group-hover:bg-white/20 transition-colors duration-300">
        <motion.div
          className="text-blue-600 group-hover:text-white"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          {item.icon}
        </motion.div>
      </div>
      {item.badge && (
        <div className="absolute top-6 right-6 text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full group-hover:bg-white group-hover:text-blue-700 transition-colors duration-300">
          {item.badge}
        </div>
      )}
      <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-white transition-colors duration-300">
        {item.title}
      </h3>
      <p className="text-gray-600 group-hover:text-white/90 mb-4 transition-colors duration-300">
        {item.description}
      </p>
    </div>
  </motion.div>
);

const ValueProposition = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 1]);

  return (
    <section id="value-proposition" className="py-4 md:py-8 relative">
      {/* Decorative animated backgrounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute top-1/3 -right-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute -bottom-40 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2,
          }}
        />
      </div>

      <TracingBeam>
        <motion.div
          className="container mx-auto px-4 relative z-10"
          style={{ scale, opacity }}
        >
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="inline-block px-4 py-1.5 mb-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 rounded-full text-sm font-medium border border-blue-200/50"
            >
              <Sparkles>Features & Benefits</Sparkles>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700"
            >
              Why Cloud Certify Is Your Best Choice
              <motion.div
                className="absolute -bottom-3 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent rounded-full"
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                viewport={{ once: true }}
              />
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-gray-600 max-w-3xl mx-auto mt-6 text-lg"
            >
              Our platform is designed specifically for Google Cloud Platform
              certifications, with powerful features that accelerate your
              learning journey.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {valueItems.map((item, index) => (
              <FeatureCard key={index} item={item} index={index} />
            ))}
          </div>

          <GlowingBackground
            containerClassName="rounded-2xl overflow-hidden"
            glowSize="350px"
            glowOpacity={0.4}
            glowColor="rgba(37, 99, 235, 0.4)" // Updated to match blue color
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-10 md:p-12 text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-6">
                      Ready to accelerate your GCP certification journey?
                    </h3>
                    <p className="text-lg opacity-90 mb-6">
                      Let Cloud Certify be your trusted guide. Start today and
                      experience smarter, faster, and more effective
                      preparation.
                    </p>
                    <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-50 transition-all">
                      Get Started
                    </button>
                  </div>
                  <div className="hidden md:block">
                    <img
                      src="/images/gcp-certify.svg"
                      alt="GCP Illustration"
                      className="w-full"
                    />
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

export default ValueProposition;

"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiCloud } from "react-icons/fi";
import { GlowingBackground } from "./ui/GlowingBackground";

const TestLibrary = () => {
  const certifications = [
    {
      title: "Associate Cloud Engineer",
      description: "For individuals who deploy applications, monitor operations, and manage enterprise solutions",
      color: "bg-green-500",
      icon: <FiCloud />,
    },
    {
      title: "Professional Cloud Architect",
      description: "For professionals who design, develop, and manage robust, secure, scalable, highly available cloud solutions",
      color: "bg-blue-500",
      icon: <FiCloud />,
    },
    {
      title: "Professional Data Engineer",
      description: "For professionals who design and build data processing systems and create machine learning models",
      color: "bg-purple-500",
      icon: <FiCloud />,
    },
    {
      title: "Professional Cloud Developer",
      description: "For developers who build scalable and highly available applications using Google Cloud technologies",
      color: "bg-indigo-500",
      icon: <FiCloud />,
    },
    {
      title: "Professional Cloud Network Engineer",
      description: "For professionals who implement and manage network architectures in Google Cloud",
      color: "bg-cyan-500",
      icon: <FiCloud />,
    },
    {
      title: "Professional Cloud Security Engineer",
      description: "For security professionals who design and implement secure infrastructure on Google Cloud",
      color: "bg-red-500",
      icon: <FiCloud />,
    },
  ];

  return (
    <section id="test-library" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-4 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
          >
            GCP Certifications
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700"
          >
            Google Cloud Platform Certifications
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-600 max-w-2xl mx-auto mb-10"
          >
            We provide preparation materials for all the official Google Cloud Platform certifications
          </motion.p>
        </div>

        <GlowingBackground
          containerClassName="relative mb-8"
          glowSize="250px"
          glowOpacity={0.2}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
              >
                <div className={`h-2 w-full ${cert.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cert.color} bg-opacity-10`}>
                      <span className={`text-${cert.color.replace('bg-', '')}`}>{cert.icon}</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">{cert.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{cert.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlowingBackground>
      </div>
    </section>
  );
};

export default TestLibrary;
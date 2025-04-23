"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiBarChart2, FiClock, FiStar, FiArrowRight, FiAward } from "react-icons/fi";
import { AnimatedCard } from "./ui/AnimatedCard";

const NewTestLibrary = () => {
  const testItems = [
    {
      id: 1,
      title: "Professional Cloud Architect",
      badge: "Popular",
      badgeColor: "bg-orange-100 text-orange-700",
      gradientColors: "from-blue-500 to-blue-600",
      buttonText: "Start Test",
      buttonIcon: <FiArrowRight />,
      buttonBg: "bg-gradient-to-r from-blue-500 to-blue-600",
      stats: [
        { 
          text: "60 Questions", 
          icon: <FiBarChart2 />, 
          bgColor: "bg-blue-50", 
          textColor: "text-blue-700" 
        },
        { 
          text: "2 Hours", 
          icon: <FiClock />, 
          bgColor: "bg-gray-100", 
          textColor: "text-gray-700" 
        },
        { 
          text: "Medium", 
          icon: <FiStar />, 
          bgColor: "bg-orange-50", 
          textColor: "text-orange-700" 
        }
      ]
    },
    {
      id: 2,
      title: "Associate Cloud Engineer",
      gradientColors: "from-green-500 to-green-600",
      buttonText: "Start Test",
      buttonIcon: <FiArrowRight />,
      buttonBg: "bg-gradient-to-r from-green-500 to-green-600",
      stats: [
        { 
          text: "50 Questions", 
          icon: <FiBarChart2 />, 
          bgColor: "bg-blue-50", 
          textColor: "text-blue-700" 
        },
        { 
          text: "2 Hours", 
          icon: <FiClock />, 
          bgColor: "bg-gray-100", 
          textColor: "text-gray-700" 
        },
        { 
          text: "Easy", 
          icon: <FiStar />, 
          bgColor: "bg-green-50", 
          textColor: "text-green-700" 
        }
      ]
    },
    {
      id: 3,
      title: "Professional Data Engineer",
      gradientColors: "from-purple-500 to-purple-600",
      buttonText: "Start Test",
      buttonIcon: <FiArrowRight />,
      buttonBg: "bg-gradient-to-r from-purple-500 to-purple-600",
      stats: [
        { 
          text: "65 Questions", 
          icon: <FiBarChart2 />, 
          bgColor: "bg-blue-50", 
          textColor: "text-blue-700" 
        },
        { 
          text: "2 Hours", 
          icon: <FiClock />, 
          bgColor: "bg-gray-100", 
          textColor: "text-gray-700" 
        },
        { 
          text: "Hard", 
          icon: <FiStar />, 
          bgColor: "bg-red-50", 
          textColor: "text-red-700" 
        }
      ]
    },
    {
      id: 4,
      title: "Professional Cloud Security Engineer",
      gradientColors: "from-red-500 to-red-600",
      buttonText: "Start Test",
      buttonIcon: <FiArrowRight />,
      buttonBg: "bg-gradient-to-r from-red-500 to-red-600",
      stats: [
        { 
          text: "55 Questions", 
          icon: <FiBarChart2 />, 
          bgColor: "bg-blue-50", 
          textColor: "text-blue-700" 
        },
        { 
          text: "2 Hours", 
          icon: <FiClock />, 
          bgColor: "bg-gray-100", 
          textColor: "text-gray-700" 
        },
        { 
          text: "Hard", 
          icon: <FiStar />, 
          bgColor: "bg-red-50", 
          textColor: "text-red-700" 
        }
      ]
    },
    {
      id: 5,
      title: "Professional Cloud DevOps Engineer",
      gradientColors: "from-orange-500 to-orange-600",
      buttonText: "Start Test",
      buttonIcon: <FiArrowRight />,
      buttonBg: "bg-gradient-to-r from-orange-500 to-orange-600",
      stats: [
        { 
          text: "50 Questions", 
          icon: <FiBarChart2 />, 
          bgColor: "bg-blue-50", 
          textColor: "text-blue-700" 
        },
        { 
          text: "2 Hours", 
          icon: <FiClock />, 
          bgColor: "bg-gray-100", 
          textColor: "text-gray-700" 
        },
        { 
          text: "Medium", 
          icon: <FiStar />, 
          bgColor: "bg-orange-50", 
          textColor: "text-orange-700" 
        }
      ]
    },
    {
      id: 6,
      title: "Professional Cloud Network Engineer",
      gradientColors: "from-blue-500 to-blue-600",
      buttonText: "Start Test",
      buttonIcon: <FiArrowRight />,
      buttonBg: "bg-gradient-to-r from-blue-500 to-blue-600",
      stats: [
        { 
          text: "55 Questions", 
          icon: <FiBarChart2 />, 
          bgColor: "bg-blue-50", 
          textColor: "text-blue-700" 
        },
        { 
          text: "2 Hours", 
          icon: <FiClock />, 
          bgColor: "bg-gray-100", 
          textColor: "text-gray-700" 
        },
        { 
          text: "Medium", 
          icon: <FiStar />, 
          bgColor: "bg-orange-50", 
          textColor: "text-orange-700" 
        }
      ]
    },
  ];

  return (
    <section id="test-library" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Comprehensive Test Library
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Choose from our wide range of practice tests designed to prepare you for your GCP certification exams.
          </motion.p>
        </div>

        <AnimatedCard items={testItems} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center"
            >
              View All Tests <FiArrowRight className="ml-2" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewTestLibrary;
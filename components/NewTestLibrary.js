"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBarChart2, FiClock, FiStar, FiArrowRight, FiAward, FiFilter } from "react-icons/fi";
import { AnimatedCard } from "./ui/AnimatedCard";
import { GlowingBackground } from "./ui/GlowingBackground";

const NewTestLibrary = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  const categories = [
    { id: "all", name: "All Exams", color: "blue" },
    { id: "architect", name: "Architect", color: "indigo" },
    { id: "engineer", name: "Engineer", color: "green" },
    { id: "security", name: "Security", color: "red" },
    { id: "data", name: "Data", color: "purple" }
  ];

  const testItems = [
    {
      id: 1,
      category: "architect",
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
      category: "engineer",
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
      category: "data",
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
      category: "security",
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
      category: "engineer",
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
      category: "engineer",
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

  const filteredItems = activeTab === "all" 
    ? testItems 
    : testItems.filter(item => item.category === activeTab);

  return (
    <section id="test-library" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-4 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
          >
            Practice Tests
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700"
          >
            Comprehensive Test Library
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-600 max-w-2xl mx-auto mb-10"
          >
            Choose from our wide range of practice tests designed to prepare you for your GCP certification exams.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                onClick={() => setActiveTab(category.id)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === category.id 
                    ? `bg-${category.color}-600 text-white shadow-md` 
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>

        <GlowingBackground
          containerClassName="mb-12"
          glowSize="250px"
          glowOpacity={0.2}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatedCard items={filteredItems} />
            </motion.div>
          </AnimatePresence>
        </GlowingBackground>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex gap-4">
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 15px 25px -5px rgba(37, 99, 235, 0.3)" 
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg transition-all flex items-center"
            >
              View All Tests <FiArrowRight className="ml-2" />
            </motion.button>
            
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 8px 15px rgba(0, 0, 0, 0.05)"
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 rounded-xl font-medium text-blue-600 border-2 border-blue-600 flex items-center"
            >
              Random Test <FiShuffle className="ml-2" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Adding this icon component to avoid import error
const FiShuffle = ({ className }) => (
  <svg 
    stroke="currentColor" 
    fill="none" 
    strokeWidth="2" 
    viewBox="0 0 24 24" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className} 
    height="1em" 
    width="1em" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <polyline points="16 3 21 3 21 8"></polyline>
    <line x1="4" y1="20" x2="21" y2="3"></line>
    <polyline points="21 16 21 21 16 21"></polyline>
    <line x1="15" y1="15" x2="21" y2="21"></line>
    <line x1="4" y1="4" x2="9" y2="9"></line>
  </svg>
);

export default NewTestLibrary;
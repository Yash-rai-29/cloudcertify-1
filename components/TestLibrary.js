import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiClock, 
  FiBarChart2, 
  FiStar, 
  FiChevronRight, 
  FiFilter, 
  FiBook,
  FiAward,
  FiArrowRight
} from 'react-icons/fi';

const TestLibrary = () => {
  // Use null as initial state to avoid hydration mismatch
  const [activeTab, setActiveTab] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Use useEffect to set the initial state on the client side only
  useEffect(() => {
    setActiveTab('all');
    setIsClient(true);
  }, []);
  
  const testCategories = [
    { id: 'all', name: 'All Tests' },
    { id: 'architect', name: 'Cloud Architect', color: 'blue' },
    { id: 'engineer', name: 'Cloud Engineer', color: 'green' },
    { id: 'developer', name: 'Cloud Developer', color: 'purple' },
    { id: 'security', name: 'Security Engineer', color: 'red' },
    { id: 'data', name: 'Data Engineer', color: 'orange' },
  ];
  
  const tests = [
    {
      id: 1,
      title: 'Professional Cloud Architect - Practice Test 1',
      category: 'architect',
      questions: 60,
      time: '120 min',
      difficulty: 'Hard',
      color: 'blue',
      popular: true,
      completionRate: 73,
    },
    {
      id: 2,
      title: 'Associate Cloud Engineer - Practice Test 2',
      category: 'engineer',
      questions: 50,
      time: '90 min',
      difficulty: 'Medium',
      color: 'green',
      popular: true,
      completionRate: 85,
    },
    {
      id: 3,
      title: 'Professional Cloud Developer - Practice Test 1',
      category: 'developer',
      questions: 55,
      time: '110 min',
      difficulty: 'Hard',
      color: 'purple',
      popular: false,
      completionRate: 69,
    },
    {
      id: 4,
      title: 'Professional Data Engineer - Practice Test 1',
      category: 'data',
      questions: 65,
      time: '130 min',
      difficulty: 'Hard',
      color: 'orange',
      popular: true,
      completionRate: 64,
    },
    {
      id: 5,
      title: 'Professional Cloud Security Engineer - Practice Test 1',
      category: 'security',
      questions: 60,
      time: '120 min',
      difficulty: 'Hard',
      color: 'red',
      popular: false,
      completionRate: 71,
    },
    {
      id: 6,
      title: 'Associate Cloud Engineer - Practice Test 1',
      category: 'engineer',
      questions: 50,
      time: '90 min',
      difficulty: 'Medium',
      color: 'green',
      popular: false,
      completionRate: 82,
    },
  ];
  
  const filteredTests = activeTab === 'all' 
    ? tests 
    : tests.filter(test => test.category === activeTab);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  // Find color for active tab
  const getActiveTabColor = () => {
    if (activeTab === 'all') return 'blue';
    const category = testCategories.find(cat => cat.id === activeTab);
    return category ? category.color : 'blue';
  };
  
  return (
    <section id="test-library" className="py-20 sm:py-24 md:py-28 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl -z-10"></div>
      <div className="absolute bottom-40 -left-20 w-80 h-80 bg-indigo-100 rounded-full opacity-30 blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-12 md:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-6 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
          >
            <FiBook className="inline mr-2" /> Practice Makes Perfect
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            Comprehensive Test Library
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed"
          >
            Practice with exam-aligned questions across all Google Cloud certification paths.
            Our test library is regularly updated with new questions and insights.
          </motion.p>
        </div>
        
        {/* Search and filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-10 md:mb-12"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6">
            <div className="flex flex-col lg:flex-row justify-between gap-6 mb-4">
              {/* Search input */}
              <div className="relative w-full lg:w-1/3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search for tests..." 
                  className="bg-gray-50 rounded-xl py-3 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 transition-all"
                />
              </div>
              
              {/* Desktop filters */}
              <div className="hidden lg:flex flex-wrap justify-end items-center gap-3">
                {testCategories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                      activeTab === category.id 
                        ? `bg-${category.color || 'blue'}-600 text-white shadow-md` 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </motion.button>
                ))}
              </div>
              
              {/* Mobile filter toggle */}
              <div className="flex lg:hidden justify-between">
                <div className="flex gap-2 items-center">
                  <span className="text-gray-600 font-medium">
                    Category: {testCategories.find(c => c.id === activeTab)?.name}
                  </span>
                </div>
                <motion.button
                  onClick={() => setShowFilters(!showFilters)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700"
                >
                  <FiFilter size={16} />
                  <span>Filter</span>
                </motion.button>
              </div>
            </div>
            
            {/* Mobile filters dropdown */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="lg:hidden overflow-hidden"
                >
                  <div className="pt-4 pb-2 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {testCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            setActiveTab(category.id);
                            setShowFilters(false);
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === category.id 
                              ? `bg-${category.color || 'blue'}-600 text-white` 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        
        {/* Test cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {filteredTests.map((test) => (
            <motion.div
              key={test.id}
              variants={childVariants}
              whileHover={{ 
                y: -8, 
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                transition: { duration: 0.3 }
              }}
              className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover-lift"
            >
              <div className={`bg-gradient-to-r from-${test.color}-500 to-${test.color}-600 h-2.5`}></div>
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-gray-800">{test.title}</h3>
                  {test.popular && (
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm flex items-center">
                      <FiAward className="mr-1" /> Popular
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-full text-sm text-blue-700">
                    <FiBarChart2 className="mr-1.5" />
                    <span>{test.questions} Questions</span>
                  </div>
                  <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-full text-sm text-gray-700">
                    <FiClock className="mr-1.5" />
                    <span>{test.time}</span>
                  </div>
                  <div className={`flex items-center bg-${
                    test.difficulty === 'Hard' ? 'red' : 
                    test.difficulty === 'Medium' ? 'orange' : 
                    'green'
                  }-50 px-3 py-1.5 rounded-full text-sm text-${
                    test.difficulty === 'Hard' ? 'red' : 
                    test.difficulty === 'Medium' ? 'orange' : 
                    'green'
                  }-700`}>
                    <FiStar className="mr-1.5" />
                    <span>{test.difficulty}</span>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <motion.button
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: `0 10px 15px -3px rgba(${
                        test.color === 'blue' ? '37, 99, 235' : 
                        test.color === 'green' ? '16, 185, 129' : 
                        test.color === 'purple' ? '139, 92, 246' : 
                        test.color === 'red' ? '239, 68, 68' : 
                        test.color === 'orange' ? '249, 115, 22' : 
                        '37, 99, 235'
                      }, 0.3)`
                    }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: test.color === 'blue' ? 'linear-gradient(to right, #2563eb, #3b82f6)' : 
                               test.color === 'green' ? 'linear-gradient(to right, #10b981, #34d399)' : 
                               test.color === 'purple' ? 'linear-gradient(to right, #8b5cf6, #a78bfa)' : 
                               test.color === 'red' ? 'linear-gradient(to right, #ef4444, #f87171)' : 
                               test.color === 'orange' ? 'linear-gradient(to right, #f97316, #fb923c)' : 
                               'linear-gradient(to right, #2563eb, #3b82f6)'
                    }}
                    className="text-white px-6 py-3 rounded-xl text-sm font-medium flex items-center justify-center shadow-md transition-all w-full"
                  >
                    Start Test <FiArrowRight className="ml-2" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* View all button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-14 md:mt-16"
        >
          <div className="inline-flex gap-4">
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: `0 15px 25px -5px rgba(${
                  getActiveTabColor() === 'blue' ? '37, 99, 235' : 
                  getActiveTabColor() === 'green' ? '16, 185, 129' : 
                  getActiveTabColor() === 'purple' ? '139, 92, 246' : 
                  getActiveTabColor() === 'red' ? '239, 68, 68' : 
                  getActiveTabColor() === 'orange' ? '249, 115, 22' : 
                  '37, 99, 235'
                }, 0.25)`
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: getActiveTabColor() === 'blue' ? 'linear-gradient(to right, #2563eb, #3b82f6)' : 
                           getActiveTabColor() === 'green' ? 'linear-gradient(to right, #10b981, #34d399)' : 
                           getActiveTabColor() === 'purple' ? 'linear-gradient(to right, #8b5cf6, #a78bfa)' : 
                           getActiveTabColor() === 'red' ? 'linear-gradient(to right, #ef4444, #f87171)' : 
                           getActiveTabColor() === 'orange' ? 'linear-gradient(to right, #f97316, #fb923c)' : 
                           'linear-gradient(to right, #2563eb, #3b82f6)'
              }}
              className="text-white px-8 py-3.5 rounded-xl font-medium shadow-lg transition-all flex items-center"
            >
              View All Tests <FiArrowRight className="ml-2" />
            </motion.button>
            
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                border: `2px solid ${
                  getActiveTabColor() === 'blue' ? '#2563eb' : 
                  getActiveTabColor() === 'green' ? '#10b981' : 
                  getActiveTabColor() === 'purple' ? '#8b5cf6' : 
                  getActiveTabColor() === 'red' ? '#ef4444' : 
                  getActiveTabColor() === 'orange' ? '#f97316' : 
                  '#2563eb'
                }`,
                color: getActiveTabColor() === 'blue' ? '#2563eb' : 
                      getActiveTabColor() === 'green' ? '#10b981' : 
                      getActiveTabColor() === 'purple' ? '#8b5cf6' : 
                      getActiveTabColor() === 'red' ? '#ef4444' : 
                      getActiveTabColor() === 'orange' ? '#f97316' : 
                      '#2563eb'
              }}
              className="px-8 py-3.5 rounded-xl font-medium transition-all bg-white hover:bg-gray-50"
            >
              Random Test
            </motion.button>
          </div>
          
          {/* Additional info */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-6 text-gray-600 text-sm max-w-2xl mx-auto"
          >
            Our test library is updated weekly with new questions based on the latest GCP certification exams.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default TestLibrary;
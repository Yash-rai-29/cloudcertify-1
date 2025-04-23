import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiClock, FiBarChart2, FiStar, FiChevronRight } from 'react-icons/fi';

const TestLibrary = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  const testCategories = [
    { id: 'all', name: 'All Tests' },
    { id: 'architect', name: 'Cloud Architect' },
    { id: 'engineer', name: 'Cloud Engineer' },
    { id: 'developer', name: 'Cloud Developer' },
    { id: 'security', name: 'Security Engineer' },
    { id: 'data', name: 'Data Engineer' },
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
    },
  ];
  
  const filteredTests = activeTab === 'all' 
    ? tests 
    : tests.filter(test => test.category === activeTab);
  
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
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Practice with exam-aligned questions across all Google Cloud certification paths
          </motion.p>
        </div>
        
        {/* Search and filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center bg-white rounded-lg shadow-md p-4">
            <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
              <FiSearch className="absolute top-3 left-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search tests..." 
                className="bg-gray-100 rounded-md py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex space-x-2 overflow-x-auto pb-2 w-full md:w-auto">
              {testCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === category.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Test cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100"
            >
              <div className={`bg-${test.color}-600 h-2`}></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg">{test.title}</h3>
                  {test.popular && (
                    <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-medium">
                      Popular
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full text-sm text-blue-700">
                    <FiBarChart2 className="mr-1" />
                    <span>{test.questions} Questions</span>
                  </div>
                  <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                    <FiClock className="mr-1" />
                    <span>{test.time}</span>
                  </div>
                  <div className="flex items-center bg-green-50 px-3 py-1 rounded-full text-sm text-green-700">
                    <FiStar className="mr-1" />
                    <span>{test.difficulty}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Average Score</div>
                    <div className="flex items-center">
                      <div className="w-24 h-2 rounded-full bg-gray-200 mr-2">
                        <div 
                          className={`h-2 rounded-full bg-${test.color}-500`} 
                          style={{ width: `${Math.floor(Math.random() * 31) + 50}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {Math.floor(Math.random() * 31) + 50}%
                      </span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`bg-${test.color}-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center shadow-md hover:bg-${test.color}-700 transition-colors`}
                  >
                    Start Test <FiChevronRight className="ml-1" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* View all button */}
        <div className="text-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-md font-medium text-md shadow-md transition-all"
          >
            View All Tests
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default TestLibrary;
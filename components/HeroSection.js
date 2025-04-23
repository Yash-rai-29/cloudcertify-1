import { motion } from 'framer-motion';
import { FiCheck, FiChevronRight } from 'react-icons/fi';

const HeroSection = () => {
  return (
    <section className="relative pt-24 pb-20 md:pt-32 md:pb-32 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {/* Background shapes */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full opacity-70 blur-3xl"></div>
      <div className="absolute top-32 -left-24 w-80 h-80 bg-indigo-100 rounded-full opacity-70 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block px-4 py-1 mb-6 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
            >
              The #1 GCP Certification Platform
            </motion.div>
            
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
              <span className="block">Master Google Cloud </span>
              <span className="text-blue-600">Ace the Certification</span>
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl">
              Comprehensive preparation resources, practice exams, and performance tracking to help you succeed in your GCP certification journey.
            </p>
            
            {/* Feature list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {['500+ Practice Questions', 'Detailed Explanations', 'Performance Analytics', 'Study Scheduler'].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                  className="flex items-center"
                >
                  <FiCheck className="text-green-500 mr-2" />
                  <span className="text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium text-md shadow-lg transition-all"
              >
                Start For Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-md font-medium text-md transition-all flex items-center justify-center"
              >
                Learn More <FiChevronRight className="ml-1" />
              </motion.button>
            </div>
          </motion.div>
          
          {/* Right side - Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white p-2">
              <div className="absolute top-0 left-0 w-full h-6 bg-gray-100 flex items-center px-2 rounded-t-lg">
                <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              
              <div className="pt-8 px-2 pb-2">
                <div className="bg-blue-50 rounded-lg overflow-hidden shadow-inner">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded">
                        Professional Cloud Architect
                      </div>
                      <div className="text-green-600 font-medium flex items-center">
                        <FiCheck className="mr-1" />
                        87% Success Rate
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3 mb-4">
                      {[
                        { title: 'Design & Plan', progress: '92%', color: 'bg-green-500' },
                        { title: 'Implementation & Migration', progress: '78%', color: 'bg-blue-500' },
                        { title: 'Configure & Deploy', progress: '85%', color: 'bg-indigo-500' },
                        { title: 'Security & Compliance', progress: '65%', color: 'bg-orange-500' }
                      ].map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{item.title}</span>
                            <span className="text-gray-600">{item.progress}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${item.color} h-2 rounded-full`} 
                              style={{ width: item.progress }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-sm font-medium mb-2">Next Study Session</div>
                      <div className="flex justify-between items-center">
                        <div className="text-md">Implementation & Migration Module</div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-blue-600 text-white text-sm px-3 py-1 rounded"
                        >
                          Start
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-100 rounded-full opacity-70 blur-xl z-[-1]"></div>
            <div className="absolute -top-8 right-20 w-20 h-20 bg-blue-200 rounded-full opacity-70 blur-xl z-[-1]"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
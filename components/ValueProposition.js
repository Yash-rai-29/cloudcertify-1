import { motion, useAnimation } from 'framer-motion';
import { FiTarget, FiTrendingUp, FiClock, FiBarChart, FiShield, FiBook, FiArrowRight } from 'react-icons/fi';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

// Feature data with enhanced colors and descriptions
const features = [
  {
    id: 1,
    title: 'Targeted Learning Paths',
    description: 'Customized study plans based on your experience level and certification goals',
    icon: FiTarget,
    bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200',
  },
  {
    id: 2,
    title: 'Real-Time Progress Tracking',
    description: 'Monitor your improvement with detailed analytics and performance insights',
    icon: FiTrendingUp,
    bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
    iconColor: 'text-green-600',
    borderColor: 'border-green-200',
  },
  {
    id: 3,
    title: 'Time-Optimized Sessions',
    description: 'Efficient study sessions designed to maximize knowledge retention',
    icon: FiClock,
    bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-200',
  },
  {
    id: 4,
    title: 'Detailed Performance Analytics',
    description: 'Identify your strengths and weaknesses with comprehensive reporting',
    icon: FiBarChart,
    bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
    iconColor: 'text-orange-600',
    borderColor: 'border-orange-200',
  },
  {
    id: 5,
    title: 'Exam-Aligned Content',
    description: 'Questions and scenarios that mirror the actual GCP certification exams',
    icon: FiShield,
    bgColor: 'bg-gradient-to-br from-red-50 to-red-100',
    iconColor: 'text-red-600',
    borderColor: 'border-red-200',
  },
  {
    id: 6,
    title: 'Comprehensive Study Material',
    description: 'Rich resources covering all GCP certification topics and services',
    icon: FiBook,
    bgColor: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
    iconColor: 'text-indigo-600',
    borderColor: 'border-indigo-200',
  },
];

const ValueProposition = () => {
  // Animation controls for staggered animations
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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

  // Icon animation for hover effect
  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <section id="value-proposition" className="py-20 sm:py-24 md:py-32 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50 to-transparent opacity-50 z-0"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-30 blur-3xl z-0"></div>
      <div className="absolute bottom-0 -left-20 w-60 h-60 bg-indigo-100 rounded-full opacity-30 blur-3xl z-0"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-6 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
          >
            Features & Benefits
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700"
          >
            Why Cloud Certify Is Your Best Choice
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Our platform is designed specifically for Google Cloud Platform certifications, 
            with powerful features that accelerate your learning journey and maximize your success rate.
          </motion.p>
        </div>
        
        <motion.div 
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              whileHover={{ 
                y: -8, 
                boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.1)',
                transition: { duration: 0.3 }
              }}
              className={`bg-white rounded-2xl p-6 sm:p-8 border ${feature.borderColor} shadow-lg hover-lift`}
            >
              <div className="flex items-start mb-5">
                <motion.div 
                  className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center shadow-sm`}
                  whileHover="hover"
                >
                  <motion.div variants={iconVariants}>
                    <feature.icon className={`${feature.iconColor} text-2xl`} />
                  </motion.div>
                </motion.div>
                <div className="w-full h-0.5 bg-gray-100 mt-7 ml-4"></div>
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
              
              <motion.a 
                href="#"
                className={`inline-flex items-center text-sm font-medium ${feature.iconColor} hover:underline mt-2`}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Learn more <FiArrowRight className="ml-1.5" />
              </motion.a>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 md:mt-24 rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-1">
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl p-6 sm:p-10 md:p-12 text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Ready to accelerate your GCP certification journey?</h3>
                  <p className="text-blue-100 mb-8 text-lg leading-relaxed">
                    Join thousands of successful IT professionals who have earned their Google Cloud certifications with Cloud Certify.
                    Our proven methodology has helped candidates achieve a 94% pass rate.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <motion.button
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 15px 25px -5px rgba(0, 0, 0, 0.2)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-blue-600 px-8 py-3.5 rounded-xl font-semibold text-md shadow-xl transition-all flex items-center"
                    >
                      Start Your Free Trial <FiArrowRight className="ml-2" />
                    </motion.button>
                    <motion.a
                      href="#"
                      whileHover={{ 
                        scale: 1.05,
                        textDecoration: "underline"
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="border-2 border-white/30 text-white px-8 py-3.5 rounded-xl font-medium text-md transition-all flex items-center hover:bg-white/10"
                    >
                      See Pricing
                    </motion.a>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {[
                    { label: 'Certified Professionals', value: '15,000+' },
                    { label: 'Practice Questions', value: '2,500+' },
                    { label: 'Success Rate', value: '94%' },
                    { label: 'Average Prep Time', value: '4 Weeks' }
                  ].map((stat, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                      viewport={{ once: true }}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 8px 25px -5px rgba(0, 0, 0, 0.3)"
                      }}
                      className="bg-white/10 backdrop-blur-sm p-5 sm:p-6 rounded-xl border border-white/20 hover:bg-white/15 transition-all"
                    >
                      <div className="text-2xl sm:text-3xl font-bold mb-1">{stat.value}</div>
                      <div className="text-blue-100 text-sm">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ValueProposition;
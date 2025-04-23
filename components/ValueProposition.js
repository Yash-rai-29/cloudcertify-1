import { motion } from 'framer-motion';
import { FiTarget, FiTrendingUp, FiClock, FiBarChart, FiShield, FiBook } from 'react-icons/fi';

const features = [
  {
    id: 1,
    title: 'Targeted Learning Paths',
    description: 'Customized study plans based on your experience level and certification goals',
    icon: FiTarget,
    color: 'blue',
  },
  {
    id: 2,
    title: 'Real-Time Progress Tracking',
    description: 'Monitor your improvement with detailed analytics and performance insights',
    icon: FiTrendingUp,
    color: 'green',
  },
  {
    id: 3,
    title: 'Time-Optimized Sessions',
    description: 'Efficient study sessions designed to maximize knowledge retention',
    icon: FiClock,
    color: 'purple',
  },
  {
    id: 4,
    title: 'Detailed Performance Analytics',
    description: 'Identify your strengths and weaknesses with comprehensive reporting',
    icon: FiBarChart,
    color: 'orange',
  },
  {
    id: 5,
    title: 'Exam-Aligned Content',
    description: 'Questions and scenarios that mirror the actual GCP certification exams',
    icon: FiShield,
    color: 'red',
  },
  {
    id: 6,
    title: 'Comprehensive Study Material',
    description: 'Rich resources covering all GCP certification topics and services',
    icon: FiBook,
    color: 'indigo',
  },
];

const ValueProposition = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Why Cloud Certify Is Your Best Choice
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Our platform is designed specifically for Google Cloud Platform certifications, with features that accelerate your learning journey
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-md"
            >
              <div className={`w-12 h-12 rounded-full bg-${feature.color}-100 flex items-center justify-center mb-4`}>
                <feature.icon className={`text-${feature.color}-600 text-xl`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Ready to accelerate your GCP certification journey?</h3>
              <p className="text-blue-100 mb-6">Join thousands of successful IT professionals who have earned their Google Cloud certifications with Cloud Certify.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium text-md shadow-lg hover:bg-blue-50 transition-all"
              >
                Start Your Free Trial
              </motion.button>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                  transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                  viewport={{ once: true }}
                  className="bg-blue-800 bg-opacity-30 p-4 rounded-lg"
                >
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-blue-200 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ValueProposition;
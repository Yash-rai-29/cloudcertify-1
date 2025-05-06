"use client";
import { motion } from 'framer-motion';
import { 
  FiLinkedin, 
  FiTwitter, 
  FiFacebook, 
  FiYoutube, 
  FiMail, 
  FiPhone, 
  FiArrowUp,
  FiCloud,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import { useEffect, useState } from 'react';

/**
 * Footer component for the landing pages
 */
const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null); // 'success', 'error', or null
  const [statusMessage, setStatusMessage] = useState('');
  
  useEffect(() => {
    setIsClient(true);
    
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle newsletter subscription
  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setSubscriptionStatus('error');
      setStatusMessage('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setSubscriptionStatus(null);
    
    try {
      const response = await fetch('https://base-service-6070296894.us-central1.run.app/b/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubscriptionStatus('success');
        setStatusMessage(data.message || 'Successfully subscribed to newsletter!');
        setEmail(''); // Clear the input on success
      } else {
        setSubscriptionStatus('error');
        setStatusMessage(data.message || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubscriptionStatus('error');
      setStatusMessage('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Clear status message after 5 seconds
  useEffect(() => {
    if (subscriptionStatus) {
      const timer = setTimeout(() => {
        setSubscriptionStatus(null);
        setStatusMessage('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [subscriptionStatus]);
  
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
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };
  
  // Quick links for footer - simplified menu
  const quickLinks = [
    { name: 'Home', href: '#hero' }, 
    { name: 'Features', href: '#value-proposition' }, 
    { name: 'Test Library', href: '#test-library' }, 
    { name: 'Dashboard', href: '#performance-dashboard' }, 
    { name: 'Testimonials', href: '#testimonials' }
  ];

  return (
    <footer className="relative bg-gradient-to-b from-blue-900 to-blue-950 text-white pt-24 pb-8 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-800 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-800 rounded-full opacity-10 blur-3xl"></div>
      
      {/* Footer wave effect */}
      <div className="absolute top-0 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="fill-white">
          <path d="M0,96L60,80C120,64,240,32,360,26.7C480,21,600,43,720,53.3C840,64,960,64,1080,56C1200,48,1320,32,1380,24L1440,16L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
        </svg>
      </div>
    
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8 mb-12"
        >
          {/* Company Info */}
          <motion.div variants={childVariants}>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FiCloud className="text-blue-300 text-2xl" />
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
                  Cloud Certify
                </h3>
              </div>
              <p className="text-blue-200">Your Gateway to Cloud Certification Success</p>
            </div>
            
            <div className="text-blue-200 space-y-3">
              <motion.a 
                href="mailto:cloudcertify@hotmail.com"
                whileHover={{ x: 5 }}
                className="flex items-center group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-800/50 flex items-center justify-center mr-3 group-hover:bg-blue-700 transition-colors">
                  <FiMail className="text-blue-300 group-hover:text-white transition-colors" />
                </div>
                <span className="group-hover:text-white transition-colors">cloudcertify@hotmail.com</span>
              </motion.a>
              
              {/* <motion.a 
                href="tel:+18881234567"
                whileHover={{ x: 5 }}
                className="flex items-center group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-800/50 flex items-center justify-center mr-3 group-hover:bg-blue-700 transition-colors">
                  <FiPhone className="text-blue-300 group-hover:text-white transition-colors" />
                </div>
                <span className="group-hover:text-white transition-colors">+1 (888) 123-4567</span>
              </motion.a> */}
            </div>
            
            <div className="flex space-x-4 mt-8">
              {[FiLinkedin, FiTwitter, FiFacebook, FiYoutube].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ y: -5 }}
                  className="w-10 h-10 rounded-full bg-blue-800/40 flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Icon className="text-blue-300 hover:text-white transition-colors" />
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div variants={childVariants}>
            <h4 className="text-xl font-semibold mb-6 flex items-center">
              <span className="bg-blue-800/40 w-8 h-8 rounded-lg flex items-center justify-center mr-2">
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">01</span>
              </span>
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((item, index) => (
                <motion.li key={index} whileHover={{ x: 5 }}>
                  <a href={item.href} className="text-blue-200 hover:text-white transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {item.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Newsletter */}
          <motion.div variants={childVariants}>
            <h4 className="text-xl font-semibold mb-6 flex items-center">
              <span className="bg-blue-800/40 w-8 h-8 rounded-lg flex items-center justify-center mr-2">
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">02</span>
              </span>
              Stay Updated
            </h4>
            <p className="text-blue-200 mb-6">Subscribe to our newsletter for the latest exam tips and updates.</p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-4 py-3 rounded-xl bg-blue-800/40 border border-blue-700/50 text-white placeholder-blue-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              
              {/* Status message */}
              {subscriptionStatus && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-sm rounded-md p-2 flex items-center ${
                    subscriptionStatus === 'success' ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
                  }`}
                >
                  {subscriptionStatus === 'success' ? (
                    <FiCheckCircle className="mr-2 flex-shrink-0" />
                  ) : (
                    <FiAlertCircle className="mr-2 flex-shrink-0" />
                  )}
                  <span>{statusMessage}</span>
                </motion.div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-medium shadow-md transition-all flex items-center justify-center ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                {!isSubmitting && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
        
        {/* Bottom Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="pt-6 border-t border-blue-800/50"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-300 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Cloud Certify. All rights reserved.
            </p>
            
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
              <a href="#" className="text-blue-300 hover:text-white transition-colors text-sm">
                Terms
              </a>
              <a href="#" className="text-blue-300 hover:text-white transition-colors text-sm">
                Privacy
              </a>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Back to top button with conditional rendering for client side */}
      {isClient && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: showScrollTop ? 1 : 0, 
            scale: showScrollTop ? 1 : 0.5,
          }}
          transition={{ duration: 0.3 }}
          whileHover={{ y: -5 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-full shadow-lg z-50"
          style={{ display: showScrollTop ? 'block' : 'none' }}
          aria-label="Scroll to top"
        >
          <FiArrowUp />
        </motion.button>
      )}
    </footer>
  );
};

export default Footer;
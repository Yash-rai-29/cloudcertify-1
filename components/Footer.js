import { motion } from 'framer-motion';
import { FiLinkedin, FiTwitter, FiFacebook, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <h3 className="text-2xl font-bold mb-1">Cloud Certify</h3>
              <p className="text-blue-200 text-sm">Your Gateway to GCP Certification Success</p>
            </motion.div>
            
            <div className="text-blue-200 space-y-2">
              <div className="flex items-center">
                <FiMail className="mr-2" />
                <span>support@cloudcertify.com</span>
              </div>
              <div className="flex items-center">
                <FiPhone className="mr-2" />
                <span>+1 (888) 123-4567</span>
              </div>
              <div className="flex items-center">
                <FiMapPin className="mr-2" />
                <span>123 Cloud Street, San Francisco, CA</span>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              {[FiLinkedin, FiTwitter, FiFacebook, FiYoutube].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ y: -5, color: '#FFF' }}
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Test Library', 'Dashboard', 'Pricing', 'About Us', 'Blog', 'Contact'].map((item, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                >
                  <a href="#" className="text-blue-200 hover:text-white transition-colors">
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
          
          {/* GCP Certifications */}
          <div>
            <h4 className="text-lg font-semibold mb-4">GCP Certifications</h4>
            <ul className="space-y-2">
              {[
                'Associate Cloud Engineer', 
                'Professional Cloud Architect', 
                'Professional Data Engineer', 
                'Professional Cloud Developer',
                'Professional Cloud Network Engineer',
                'Professional Cloud Security Engineer'
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                >
                  <a href="#" className="text-blue-200 hover:text-white transition-colors">
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
            <p className="text-blue-200 mb-4">Subscribe to our newsletter for the latest GCP exam tips and updates.</p>
            <form className="space-y-2">
              <div>
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-4 py-2 rounded-md bg-blue-800 border border-blue-700 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-medium text-sm transition-all"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t border-blue-800 text-center text-blue-300 text-sm">
          <div className="mb-4 space-x-6">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
          <p>© {new Date().getFullYear()} Cloud Certify. All rights reserved.</p>
        </div>
      </div>
      
      {/* Back to top button */}
      <motion.button
        whileHover={{ y: -5 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </motion.button>
    </footer>
  );
};

export default Footer;
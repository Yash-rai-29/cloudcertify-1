import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiCloud, FiChevronDown } from 'react-icons/fi';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { name: 'Home', href: '#' },
    { name: 'Test Library', href: '#test-library' },
    { name: 'Dashboard', href: '#dashboard' },
    { name: 'About Us', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  // Animation variants
  const logoVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const navVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { 
        duration: 0.4,
        ease: "easeInOut"
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 backdrop-blur-sm ${
      scrolled 
        ? 'bg-white/95 shadow-md py-2' 
        : 'bg-transparent py-4 md:py-5'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={logoVariants}
          className="flex items-center"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="flex items-center gap-1.5"
          >
            <FiCloud className="text-blue-600 text-3xl" />
            <span className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Cloud Certify
            </span>
          </motion.div>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.nav 
          className="hidden md:flex items-center gap-2 lg:gap-8"
          initial="hidden"
          animate="visible"
          variants={navVariants}
        >
          <div className="flex space-x-1 lg:space-x-6 items-center">
            {navItems.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                className={`font-medium text-sm lg:text-base px-3 py-2 rounded-md transition-all duration-300 ${
                  scrolled 
                    ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
                    : 'text-gray-800 hover:text-blue-600 hover:bg-blue-50/30'
                }`}
                variants={navItemVariants}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                {item.name}
              </motion.a>
            ))}
          </div>
          <motion.button
            variants={navItemVariants}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.25)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-md font-medium text-sm shadow-md transition-all ml-2"
          >
            Login
          </motion.button>
        </motion.nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <motion.button 
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-md ${
              scrolled 
                ? 'text-gray-700 hover:bg-gray-100' 
                : 'text-gray-800 hover:bg-white/20'
            } focus:outline-none transition-colors`}
            aria-label="Toggle menu"
          >
            <motion.div
              initial={false}
              animate={isOpen ? "open" : "closed"}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Mobile menu with AnimatePresence for exit animations */}
      <AnimatePresence>
        {isOpen && isClient && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            className="md:hidden bg-white shadow-xl overflow-hidden"
          >
            <div className="px-4 py-6 space-y-3">
              {navItems.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="block py-2.5 px-4 rounded-md font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </motion.a>
              ))}
              <motion.button 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-md font-medium text-sm shadow-md transition-all flex justify-center items-center"
              >
                Login
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
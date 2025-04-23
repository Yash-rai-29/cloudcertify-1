import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser } from 'react-icons/fi';

/**
 * Mobile Menu component for responsive navigation
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the menu is open
 * @param {function} props.onClose - Function to close the menu
 * @param {Array} props.navItems - Navigation items array
 * @param {Object} props.user - User object, null if not logged in
 */
const MobileMenu = ({
  isOpen,
  onClose,
  navItems,
  user
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow-lg overflow-hidden"
        >
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="block py-2.5 px-4 rounded-lg font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                onClick={onClose}
              >
                {item.name}
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="pt-2 space-y-2"
            >
              {user ? (
                // Dashboard link if logged in
                <motion.a
                  href="/dashboard"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium shadow-md flex items-center justify-center gap-2"
                >
                  <FiUser size={16} />
                  Go to Dashboard
                </motion.a>
              ) : (
                // Login and signup links if not logged in
                <>
                  <motion.a
                    href="/login"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white border border-blue-200 text-blue-600 py-3 rounded-lg font-medium shadow-sm flex justify-center"
                  >
                    Login
                  </motion.a>
                  <motion.a
                    href="/signup"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium shadow-md flex justify-center"
                  >
                    Sign Up
                  </motion.a>
                </>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiCloud } from "react-icons/fi";
import Link from "next/link";

/**
 * Mobile Menu component for responsive navigation
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the menu is open
 * @param {function} props.onClose - Function to close the menu
 * @param {Array} props.navItems - Navigation items array
 * @param {Object} props.user - User object, null if not logged in
 */
const MobileMenu = ({ isOpen, onClose, navItems, user }) => {
  // If menu is not open, don't render anything
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25 }}
          className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-b from-blue-900 to-blue-950 p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full text-white">
            {/* User Section */}
            <div className="pb-4 mb-6 border-b border-white/10">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <FiUser className="text-white text-xl" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {user.displayName || user.email || "User"}
                    </p>
                    <Link
                      href="/dashboard"
                      className="text-xs text-blue-300 hover:text-white transition-colors"
                      onClick={onClose}
                    >
                      View Dashboard
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md flex items-center justify-center">
                      <FiCloud className="text-white" />
                    </div>
                    <span className="font-bold text-lg">Cloud Certify</span>
                  </div>
                </div>
              )}
            </div>

            {/* Nav Items */}
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector(item.href);
                    if (element) {
                      window.scrollTo({
                        top: element.offsetTop - 80,
                        behavior: "smooth",
                      });
                      onClose();
                    }
                  }}
                  className="block px-2 py-3 rounded-lg text-blue-100 hover:bg-blue-800/30 hover:text-white transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Authentication Buttons */}
            {!user && (
              <div className="pt-6 mt-6 border-t border-white/10 space-y-3">
                <Link
                  href="/auth/login"
                  onClick={onClose}
                  className="block w-full py-2.5 px-4 bg-white text-blue-600 rounded-lg text-center font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={onClose}
                  className="block w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-center font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileMenu;
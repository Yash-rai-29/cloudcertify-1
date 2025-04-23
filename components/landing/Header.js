"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiMenu, FiX, FiCloud, FiUser } from "react-icons/fi";
import { FloatingNavbar } from "../common/ui/FloatingNavbar";
import { useAuth } from "../../contexts/AuthContext";
import MobileMenu from "./MobileMenu";

/**
 * Site Header component with responsive navigation
 */
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();

  // Handle scroll event to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation items for both desktop and mobile
  const navItems = [
    { name: "Home", href: "#hero" },
    { name: "Features", href: "#value-proposition" },
    { name: "Test Library", href: "#test-library" },
    { name: "Performance", href: "#performance-dashboard" },
    { name: "Reviews", href: "#testimonials" },
  ];

  // Logo component used in both desktop and mobile
  const logoContent = (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-1.5"
    >
      <FiCloud
        className={`text-2xl ${scrolled ? "text-blue-600" : "text-white"}`}
      />
      <span
        className={`font-bold text-xl ${
          scrolled
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            : "text-white"
        }`}
      >
        Cloud Certify
      </span>
    </motion.div>
  );

  // Button content changes based on authentication state
  const buttonContent = user ? (
    // Show Dashboard button if user is logged in
    <motion.a
      href="/dashboard"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-full font-medium text-sm shadow-md flex items-center gap-2"
    >
      <FiUser size={16} />
      Dashboard
    </motion.a>
  ) : (
    // Show Login/Signup buttons if user is not logged in
    <div className="flex space-x-2">
      <motion.a
        href="/auth/login"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white text-blue-600 border border-blue-200 px-4 py-2 rounded-full font-medium text-sm shadow-sm hover:shadow-md transition-shadow"
      >
        Login
      </motion.a>
      <motion.a
        href="/auth/signup"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full font-medium text-sm shadow-md"
      >
        Sign Up
      </motion.a>
    </div>
  );

  // Toggle mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);

  // Close mobile menu
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <FloatingNavbar
          navItems={navItems}
          logoContent={logoContent}
          buttonContent={buttonContent}
        />
      </div>

      {/* Mobile Navigation */}
      <header
        className={`md:hidden fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-sm shadow-sm py-2"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {logoContent}
          </motion.div>

          {/* Mobile menu button */}
          <motion.button
            onClick={toggleMenu}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-lg ${
              scrolled ? "text-gray-700" : "text-white"
            } focus:outline-none`}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </motion.button>
        </div>

        {/* Mobile menu */}
        <MobileMenu 
          isOpen={isOpen}
          onClose={closeMenu}
          navItems={navItems}
          user={user}
        />
      </header>
    </>
  );
};

export default Header;
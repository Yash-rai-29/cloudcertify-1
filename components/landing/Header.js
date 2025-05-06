"use client";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiCloud, FiUser, FiHome, FiStar, FiBook, FiBarChart2, FiMessageCircle } from "react-icons/fi";
import { FloatingNavbar } from "../common/ui/FloatingNavbar";
import { useAuth } from "../../contexts/AuthContext";
import Link from "next/link";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const navItems = [
    { name: "Home", href: "#hero", icon: <FiHome /> },
    { name: "Features", href: "#value-proposition", icon: <FiStar /> },
    { name: "Test Library", href: "#test-library", icon: <FiBook /> },
    { name: "Performance", href: "#performance-dashboard", icon: <FiBarChart2 /> },
    { name: "Reviews", href: "#testimonials", icon: <FiMessageCircle /> },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <FloatingNavbar
          navItems={navItems}
          logoContent={
            <div className="flex items-center gap-1.5">
              <FiCloud className={`text-2xl ${scrolled ? "text-blue-600" : "text-white"}`} />
              <span className={`font-bold text-xl ${
                scrolled
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                  : "text-white"
              }`}>
                Cloud Certify
              </span>
            </div>
          }
          buttonContent={
            user ? (  
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-full font-medium text-sm shadow-md flex items-center gap-2"
              >
                <FiUser size={16} />
                Dashboard
              </Link>
            ) : (
              <div className="flex space-x-2">
                <Link href="/login" className="bg-white text-blue-600 border border-blue-200 px-4 py-2 rounded-full font-medium text-sm shadow-sm hover:shadow-md transition-shadow">
                  Login
                </Link>
                <Link href="/signup" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full font-medium text-sm shadow-md">
                  Sign Up
                </Link>
              </div>
            )
          }
        />
      </div>

      {/* Enhanced Mobile Navigation - 2025 Design */}
      <header className={`lg:hidden fixed w-full z-50 transition-all duration-300 ${
        scrolled || isOpen ? "bg-white/95 backdrop-blur-md shadow-lg py-3" : "bg-transparent py-4"
      }`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo with enhanced styling */}
          <div>
            <a href="#hero" className="block">
              <div className="flex items-center gap-1.5">
                <FiCloud className={`text-2xl transition-colors duration-300 ${scrolled || isOpen ? "text-blue-600" : "text-white"}`} />
                <span className={`font-bold text-xl transition-colors duration-300 ${
                  scrolled || isOpen
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent" 
                    : "text-white"
                }`}>
                  Cloud Certify
                </span>
              </div>
            </a>
          </div>

          {/* Improved mobile menu toggle button with animation */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-3 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 ${
              isOpen
                ? "bg-blue-500 text-white shadow-md"
                : scrolled 
                  ? "bg-blue-50 text-blue-600 border border-blue-100" 
                  : "bg-blue-500/20 text-white backdrop-blur-sm"
            }`}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Enhanced Mobile Menu with better UX */}
        {isOpen && (
          <div className="fixed inset-0 top-[60px] z-40 bg-gradient-to-b from-white to-blue-50">
            <div className="container bg-blue-50 mx-auto px-4 pt-2 pb-6 h-[calc(100vh-60px)] overflow-y-auto">
              <nav className="space-y-0.5 mt-2">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center py-4 px-3 text-gray-800 font-medium rounded-xl transition-all duration-200 hover:bg-blue-100/70 active:bg-blue-200/80"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.querySelector(item.href);
                      if (element) {
                        window.scrollTo({
                          top: element.offsetTop - 80,
                          behavior: "smooth",
                        });
                        setIsOpen(false);
                      }
                    }}
                  >
                    <span className="mr-4 p-2.5 rounded-xl bg-blue-500 text-white">{item.icon}</span>
                    <span className="text-lg">{item.name}</span>
                  </a>
                ))}
              </nav>
              
              {/* Authentication buttons with improved styling */}
              {!user ? (
                <div className="py-6 space-y-3 mt-4">
                  <Link 
                    href="/login" 
                    onClick={() => setIsOpen(false)} 
                    className="block w-full py-4 text-center bg-white text-blue-600 border border-blue-200 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    onClick={() => setIsOpen(false)} 
                    className="block w-full py-4 text-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="py-6 mt-4">
                  <Link 
                    href="/dashboard" 
                    onClick={() => setIsOpen(false)} 
                    className="flex items-center justify-center w-full py-4 text-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <FiUser className="mr-2" size={18} />
                    Go to Dashboard
                  </Link>
                </div>
              )}
              
              {/* Footer info */}
              <div className="mt-auto pt-6 border-t border-blue-100 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Cloud Certify
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;

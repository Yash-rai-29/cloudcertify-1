"use client";
import { useRef } from "react";
import { FiUser, FiCloud, FiX } from "react-icons/fi";
import Link from "next/link";

/**
 * Simplified mobile menu component with clean design
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the menu is open
 * @param {function} props.onClose - Function to close the menu
 * @param {Array} props.navItems - Navigation items array
 * @param {Object} props.user - User object, null if not logged in
 */
const MobileMenu = ({ isOpen, onClose, navItems, user }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div 
        className="absolute right-0 top-0 bottom-0 w-[80%] max-w-[320px] bg-white shadow-lg overflow-y-auto"
      >
        {/* Menu header */}
        <div className="sticky top-0 bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FiCloud className="text-xl" />
            <span className="font-semibold">Cloud Certify</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2"
            aria-label="Close menu"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Menu content */}
        <div className="p-4">
          {/* User info section */}
          {user && (
            <div className="mb-6 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <FiUser className="text-white text-lg" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {user.displayName || user.email || "User"}
                  </p>
                  <Link
                    href="/dashboard"
                    className="text-sm text-blue-600"
                    onClick={onClose}
                  >
                    View Dashboard
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav>
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
                className="block py-3 px-4 border-b border-gray-100 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Authentication buttons */}
          {!user && (
            <div className="mt-6 space-y-3">
              <Link
                href="/login"
                onClick={onClose}
                className="block w-full py-2.5 px-4 text-center rounded bg-white border border-blue-300 text-blue-600"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={onClose}
                className="block w-full py-2.5 px-4 text-center rounded bg-blue-600 text-white"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
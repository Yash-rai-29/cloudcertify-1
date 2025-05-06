import Link from "next/link";
import { useRouter } from "next/router";
import {
  IconCloud,
  IconX,
  IconLayoutDashboard,
  IconFileDescription,
  IconCertificate,
  IconBookmarks,
  IconTrophy,
  IconRobot,
  IconChevronLeft,
  IconChevronRight,
  IconSettings
} from "@tabler/icons-react";
import { useState, useEffect, useCallback } from "react";

/**
 * Sidebar component for dashboard navigation
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the sidebar is open on mobile
 * @param {Function} props.onClose - Callback to close the sidebar on mobile
 */
export default function Sidebar({ isOpen, onClose }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(true);
  
  // Save expanded state to localStorage
  useEffect(() => {
    // Check if we have a saved preference
    const savedExpandedState = localStorage.getItem('sidebarExpanded');
    if (savedExpandedState !== null) {
      setExpanded(savedExpandedState === 'true');
    }
    
    // Handle window resize for responsive behavior
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        // On mobile, close sidebar by default
        onClose();
      }
    };
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, [onClose]);

  // Toggle sidebar expanded state
  const toggleExpanded = useCallback(() => {
    const newState = !expanded;
    setExpanded(newState);
    localStorage.setItem('sidebarExpanded', String(newState));
    
    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('sidebarToggle', {
      detail: { expanded: newState }
    }));
  }, [expanded]);

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: IconLayoutDashboard,
      exact: true,
    },
    {
      name: "Test Library",
      href: "/dashboard/tests",
      icon: IconFileDescription,
    },
    { name: "Test History", href: "/dashboard/history", icon: IconCertificate },
    { name: "Resources", href: "/dashboard/resources", icon: IconBookmarks },
    { name: "Leaderboard", href: "/dashboard/leaderboard", icon: IconTrophy },
    { 
      name: "AI Chatbot", 
      href: "#", 
      icon: IconRobot,
      disabled: true,
      comingSoon: true 
    },
    // { name: "Settings", href: "/dashboard/settings", icon: IconSettings },
  ];

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {isOpen && (
          <div className="fixed inset-0 z-40 flex">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
              onClick={onClose}
            ></div>

            {/* Sidebar Content */}
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-50 transform transition-transform duration-300 ease-in-out">
              <div className="absolute top-0 right-0 -mr-12 pt-2 z-50">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={onClose}
                >
                  <span className="sr-only">Close sidebar</span>
                  <IconX className="h-6 w-6 text-white" />
                </button>
              </div>

              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <div className="flex items-center">
                    <IconCloud className="h-8 w-8 text-blue-600 mr-2" />
                    <span className="text-xl font-bold text-blue-600">
                      Cloud Certify
                    </span>
                  </div>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = item.exact
                      ? router.pathname === item.href
                      : router.pathname === item.href ||
                        router.pathname.startsWith(`${item.href}/`);
                        
                    if (item.disabled) {
                      return (
                        <div
                          key={item.name}
                          className={`group flex items-center px-3 py-2 text-base font-medium rounded-md cursor-not-allowed ${
                            isActive
                              ? "bg-blue-50 text-blue-700 opacity-60"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                          title={item.comingSoon ? "Coming Soon" : ""}
                        >
                          <item.icon
                            className={`mr-4 flex-shrink-0 h-6 w-6 ${
                              isActive
                                ? "text-blue-600"
                                : "text-gray-400"
                            }`}
                          />
                          <span>{item.name}</span>
                          {item.comingSoon && (
                            <span className="ml-2 text-xs text-blue-600">Coming Soon</span>
                          )}
                        </div>
                      );
                    }
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                          isActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                        onClick={onClose}
                      >
                        <item.icon
                          className={`mr-4 flex-shrink-0 h-6 w-6 ${
                            isActive
                              ? "text-blue-600"
                              : "text-gray-400 group-hover:text-gray-500"
                          }`}
                        />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:z-30 transition-all duration-300 ease-in-out ${
        expanded ? 'lg:w-64' : 'lg:w-20'
      }`}>
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className={`flex items-center ${expanded ? 'px-4 justify-start' : 'px-2 justify-center'}`}>
            <IconCloud className="h-8 w-8 text-blue-600 flex-shrink-0" />
            {expanded && (
              <span className="text-xl font-bold text-blue-600 ml-2 transition-opacity duration-200">
                Cloud Certify
              </span>
            )}
          </div>
          
          {/* Toggle button */}
          <button 
            className="absolute top-5 -right-3 bg-white rounded-full p-1.5 border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 z-50 shadow-sm"
            onClick={toggleExpanded}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {expanded ? <IconChevronLeft size={16} /> : <IconChevronRight size={16} />}
          </button>
          
          {/* Navigation */}
          <nav className={`mt-8 flex-1 ${expanded ? 'px-3' : 'px-2'} space-y-1`}>
            {navigation.map((item) => {
              const isActive = item.exact
                ? router.pathname === item.href
                : router.pathname === item.href ||
                  router.pathname.startsWith(`${item.href}/`);
              
              if (item.disabled) {
                return (
                  <div
                    key={item.name}
                    className={`group flex items-center relative ${
                      expanded ? 'px-4 py-2 justify-start' : 'p-3 justify-center'
                    } text-sm font-medium rounded-md transition-all duration-200 cursor-not-allowed ${
                      isActive
                        ? "bg-blue-50 text-blue-700 opacity-60"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    title={item.comingSoon ? "Coming Soon" : ""}
                  >
                    <item.icon
                      className={`flex-shrink-0 h-5 w-5 ${
                        isActive
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                    {expanded && (
                      <span className="ml-3 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
                        {item.name}
                        {/* coming soon text more smaller 0.5rem */}
                        {item.comingSoon && (
                          <span className="ml-2 text-[0.6rem] text-blue-600">Coming Soon</span>
                        )}
                      </span>
                    )}
                  </div>
                );
              }
                
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center ${
                    expanded ? 'px-4 py-2 justify-start' : 'p-3 justify-center'
                  } text-sm font-medium rounded-md transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  title={!expanded ? item.name : undefined}
                >
                  <item.icon
                    className={`flex-shrink-0 h-5 w-5 ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  {expanded && (
                    <span className="ml-3 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}

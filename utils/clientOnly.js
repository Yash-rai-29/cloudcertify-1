import dynamic from 'next/dynamic';

/**
 * Helper function to create client-only components
 * Prevents "document is not defined" errors during server-side rendering
 * 
 * @param {Function} importFunc - Dynamic import function
 * @param {Object} options - Options for the dynamic import
 * @returns {React.Component} - Client-only component
 */
export function withClientOnly(importFunc, options = {}) {
  return dynamic(importFunc, {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="rounded-full border-t-transparent border-blue-500 h-12 w-12 border-4 animate-spin" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    ),
    ...options
  });
}

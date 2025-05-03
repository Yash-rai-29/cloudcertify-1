/**
 * Debugging utilities for identifying rendering issues
 */

// Error boundary component for catching rendering errors
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-bold text-red-800 mb-2">Something went wrong</h2>
          <details className="mb-2 text-sm">
            <summary className="cursor-pointer font-medium">Error Details</summary>
            <pre className="mt-2 p-2 bg-red-100 rounded overflow-auto text-xs">
              {this.state.error && this.state.error.toString()}
            </pre>
            {this.state.errorInfo && (
              <pre className="mt-2 p-2 bg-red-100 rounded overflow-auto text-xs">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
          </details>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Check if a value is defined properly
export function debugComponent(component, name) {
  if (!component) {
    console.error(`Component ${name} is undefined!`);
    return <div className="text-red-600 p-2">Component {name} is undefined!</div>;
  }
  return component;
}

export { ErrorBoundary };

/**
 * Use this wrapper to debug component rendering
 */
export function withDebugger(Component) {
  return function DebuggedComponent(props) {
    console.log(`Rendering ${Component.displayName || Component.name || 'Unknown'} with props:`, props);
    try {
      return <Component {...props} />;
    } catch (error) {
      console.error(`Error rendering ${Component.displayName || Component.name || 'Unknown'}:`, error);
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-bold text-red-800 mb-2">Render Error</h2>
          <pre className="p-2 bg-red-100 rounded overflow-auto text-xs">{error.toString()}</pre>
        </div>
      );
    }
  };
}

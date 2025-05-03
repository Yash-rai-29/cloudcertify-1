/**
 * API middleware for Next.js API routes
 * Standardizes request handling, authentication, and error responses
 */

/**
 * Middleware to handle authentication for API routes
 * @param {Function} handler - The route handler function
 * @returns {Function} Middleware-wrapped handler
 */
export function withAuth(handler) {
  return async (req, res) => {
    // Get auth token from cookies
    const token = req.cookies?.auth_token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Authentication required'
        }
      });
    }
    
    // Add token to request object for the handler to use
    req.token = token;
    
    // Call the original handler
    return handler(req, res);
  };
}

/**
 * Middleware to validate request methods
 * @param {Function} handler - The route handler function
 * @param {string[]} allowedMethods - Array of allowed HTTP methods
 * @returns {Function} Middleware-wrapped handler
 */
export function withMethods(handler, allowedMethods = ['GET']) {
  return async (req, res) => {
    if (!allowedMethods.includes(req.method)) {
      return res.status(405).json({
        success: false,
        error: {
          message: `Method ${req.method} not allowed`
        }
      });
    }
    
    // Call the original handler
    return handler(req, res);
  };
}

/**
 * Middleware for error handling in API routes
 * @param {Function} handler - The route handler function
 * @returns {Function} Middleware-wrapped handler
 */
export function withErrorHandling(handler) {
  return async (req, res) => {
    try {
      // Call the original handler
      return await handler(req, res);
    } catch (error) {
      console.error(`API Error [${req.method} ${req.url}]:`, error);
      
      // Return standardized error response
      return res.status(500).json({
        success: false,
        error: {
          message: error.message || 'An unexpected error occurred',
          ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {})
        }
      });
    }
  };
}

/**
 * Combine multiple middleware functions
 * @param {Function[]} middlewares - Array of middleware functions
 * @returns {Function} Combined middleware function
 */
export function compose(...middlewares) {
  return (handler) => {
    return middlewares.reduceRight((result, middleware) => {
      return middleware(result);
    }, handler);
  };
}

/**
 * Create a standard API route with common middleware
 * @param {Function} handler - The route handler function
 * @param {Object} options - Configuration options
 * @param {string[]} options.methods - Allowed HTTP methods
 * @param {boolean} options.requireAuth - Whether authentication is required
 * @returns {Function} Middleware-wrapped handler
 */
export function createApiRoute(handler, { methods = ['GET'], requireAuth = true } = {}) {
  const middlewares = [
    withErrorHandling,
    (h) => withMethods(h, methods)
  ];
  
  if (requireAuth) {
    middlewares.push(withAuth);
  }
  
  return compose(...middlewares)(handler);
}

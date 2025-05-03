import { verifyAuthToken } from '../../../lib/server/authService';
import { createApiRoute } from '../../../lib/server/apiMiddleware';

/**
 * Handler for token verification API route
 * 
 * @param {Object} req - Next.js API request
 * @param {Object} res - Next.js API response
 */
async function verifyHandler(req, res) {
  const { token } = req;
  
  // Token is already checked by middleware, but we still need to verify it with the backend
  const response = await verifyAuthToken(token);
  
  if (response.success) {
    return res.status(200).json(response.data);
  }
  
  return res.status(response.error.status || 401).json({
    success: false,
    error: response.error
  });
}

// Export with API route middleware
export default createApiRoute(verifyHandler, {
  methods: ['GET', 'POST'],
  requireAuth: true
});

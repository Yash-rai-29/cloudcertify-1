import { getUserSession } from '../../../lib/server/authService';
import { createApiRoute } from '../../../lib/server/apiMiddleware';

/**
 * Handler for user session API route
 * Gets the current user's session data
 * 
 * @param {Object} req - Next.js API request
 * @param {Object} res - Next.js API response
 */
async function sessionHandler(req, res) {
  const { token } = req;
  
  const response = await getUserSession(token);
  
  if (response.success) {
    return res.status(200).json(response.data);
  }
  
  return res.status(response.error.status || 401).json({
    success: false,
    error: response.error
  });
}

// Export with API route middleware
export default createApiRoute(sessionHandler, {
  methods: ['GET'],
  requireAuth: true
});

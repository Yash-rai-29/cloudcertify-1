import { createApiRoute } from '../../../lib/server/apiMiddleware';
import { getResourceById } from '../../../lib/server/resourceService';

/**
 * API route for fetching a specific resource by ID
 * 
 * @param {Object} req - Next.js API request
 * @param {Object} res - Next.js API response
 */
async function resourceHandler(req, res) {
  const { token } = req;
  const { id } = req.query;
  
  // Call the server-side API function
  const response = await getResourceById(token, id);

  // Return the response
  if (response.success) {
    return res.status(200).json(response.data);
  }

  return res.status(response.error.status || 500).json({
    success: false,
    error: response.error
  });
}

// Export with API route middleware
export default createApiRoute(resourceHandler, {
  methods: ['GET'],
  requireAuth: true
});

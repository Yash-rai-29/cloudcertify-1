import { createApiRoute } from '../../../lib/server/apiMiddleware';
import { getResourceCategories } from '../../../lib/server/resourceService';

/**
 * API route for fetching resource categories
 * 
 * @param {Object} req - Next.js API request
 * @param {Object} res - Next.js API response
 */
async function categoriesHandler(req, res) {
  const { token } = req;
  
  // Call the server-side API function
  const response = await getResourceCategories(token);

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
export default createApiRoute(categoriesHandler, {
  methods: ['GET'],
  requireAuth: true
});

import { getDashboardStats } from '../../../lib/server/dashboardService';
import { createApiRoute } from '../../../lib/server/apiMiddleware';

/**
 * API route for fetching dashboard statistics
 * 
 * @param {Object} req - Next.js API request
 * @param {Object} res - Next.js API response
 */
async function statsHandler(req, res) {
  const { token } = req;
  
  // Call the server-side API function
  const response = await getDashboardStats(token);

  // If the API call was successful, return the data
  if (response.success) {
    return res.status(200).json(response.data);
  }

  // Otherwise, return the error
  return res.status(response.error.status || 500).json({
    success: false,
    error: response.error
  });
}

// Export with API route middleware
export default createApiRoute(statsHandler, {
  methods: ['GET'],
  requireAuth: true
});

import { createApiRoute } from '../../../lib/server/apiMiddleware';
import { getUserStatistics } from '../../../lib/server/testService';

/**
 * API route for fetching user test statistics
 * 
 * @param {Object} req - Next.js API request
 * @param {Object} res - Next.js API response
 */
async function userStatisticsHandler(req, res) {
  const { token } = req;
  
  // Call the server-side API function
  const response = await getUserStatistics(token);

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
export default createApiRoute(userStatisticsHandler, {
  methods: ['GET'],
  requireAuth: true
});

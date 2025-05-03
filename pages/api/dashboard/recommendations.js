import { createApiRoute } from '../../../lib/server/apiMiddleware';
import { getTestRecommendations } from '../../../lib/server/dashboardService';

/**
 * API route for fetching test recommendations for the user
 * 
 * @param {Object} req - Next.js API request
 * @param {Object} res - Next.js API response
 */
async function recommendationsHandler(req, res) {
  const { token } = req;
  const { limit = 4 } = req.query;
  
  // Call the server-side API function
  const response = await getTestRecommendations(token, parseInt(limit, 10));

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
export default createApiRoute(recommendationsHandler, {
  methods: ['GET'],
  requireAuth: true
});

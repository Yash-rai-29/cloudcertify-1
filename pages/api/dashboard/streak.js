import { createApiRoute } from '../../../lib/server/apiMiddleware';
import { getDailyStreak } from '../../../lib/server/dashboardService';

/**
 * API route for fetching user streak information
 * 
 * @param {Object} req - Next.js API request
 * @param {Object} res - Next.js API response
 */
async function streakHandler(req, res) {
  const { token } = req;
  
  // Call the server-side API function
  const response = await getDailyStreak(token);

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
export default createApiRoute(streakHandler, {
  methods: ['GET'],
  requireAuth: true
});

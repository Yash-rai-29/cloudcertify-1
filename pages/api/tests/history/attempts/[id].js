import { createApiRoute } from '../../../../../lib/server/apiMiddleware';
import { getTestAttemptDetails } from '../../../../../lib/server/testService';

/**
 * API route for fetching specific test attempt details
 * 
 * @param {Object} req - Next.js API request
 * @param {Object} res - Next.js API response
 */
async function testAttemptDetailsHandler(req, res) {
  const { token } = req;
  const { id } = req.query;
  
  // Call the server-side API function
  const response = await getTestAttemptDetails(token, id);

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
export default createApiRoute(testAttemptDetailsHandler, {
  methods: ['GET'],
  requireAuth: true
});

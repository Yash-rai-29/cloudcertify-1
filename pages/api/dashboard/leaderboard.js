import { getLeaderboard } from '../../../lib/server/dashboardService';

/**
 * API route for fetching leaderboard data
 * 
 * @param {Object} req - Next.js API request
 * @param {Object} res - Next.js API response
 */
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: { message: 'Method not allowed' } 
    });
  }

  try {
    // Get auth token from the request cookies
    const token = req.cookies?.auth_token || '';
    
    // If no token is provided, return unauthorized
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'Unauthorized' }
      });
    }

    // Extract query parameters
    const { limit } = req.query;

    // Call the server-side API function
    const response = await getLeaderboard(token, limit ? parseInt(limit, 10) : 20);

    // If the API call was successful, return the data
    if (response.success) {
      return res.status(200).json(response.data);
    }

    // Otherwise, return the error
    return res.status(response.error.status || 500).json({
      success: false,
      error: response.error
    });
  } catch (error) {
    console.error('Error in /api/dashboard/leaderboard:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'An unexpected error occurred' }
    });
  }
}

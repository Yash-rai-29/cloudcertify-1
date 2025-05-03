import { getTestHistory } from '../../../../lib/server/testService';

/**
 * API route for fetching user's test history
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
    const {
      search,
      period,
      status,
      sort_by,
      sort_order,
      page,
      limit
    } = req.query;

    // Call the server-side API function
    const response = await getTestHistory(token, {
      search,
      period,
      status,
      sort_by,
      sort_order,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined
    });

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
    console.error('Error in /api/tests/history:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'An unexpected error occurred' }
    });
  }
}

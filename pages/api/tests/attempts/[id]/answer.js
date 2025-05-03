import { submitAnswer } from '../../../../../lib/server/testService';

/**
 * API route for submitting an answer for a test question
 * 
 * @param {Object} req - Next.js API request
 * @param {Object} res - Next.js API response
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: { message: 'Method not allowed' } 
    });
  }

  try {
    const { id } = req.query;
    const answerData = req.body;
    
    // Get auth token from the request cookies
    const token = req.cookies?.auth_token || '';
    
    // If no token is provided, return unauthorized
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'Unauthorized' }
      });
    }

    // Validate required fields
    if (!answerData.question_id || !answerData.selected_option_ids) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing required fields' }
      });
    }

    // Call the server-side API function
    const response = await submitAnswer(token, id, answerData);

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
    console.error(`Error in /api/tests/attempts/[id]/answer:`, error);
    return res.status(500).json({
      success: false,
      error: { message: 'An unexpected error occurred' }
    });
  }
}

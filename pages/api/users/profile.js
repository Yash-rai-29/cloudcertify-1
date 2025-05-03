import { getUserProfile, updateUserProfile } from '../../../lib/server/authService';
import { createApiRoute } from '../../../lib/server/apiMiddleware';

/**
 * Handler for user profile API routes
 * Supports both GET (fetch profile) and PUT (update profile)
 * 
 * @param {Object} req - Next.js API request
 * @param {Object} res - Next.js API response
 */
async function profileHandler(req, res) {
  const { token } = req;
  
  // GET: Fetch user profile
  if (req.method === 'GET') {
    const response = await getUserProfile(token);
    
    if (response.success) {
      return res.status(200).json(response.data);
    }
    
    return res.status(response.error.status || 400).json({
      success: false,
      error: response.error
    });
  }
  
  // PUT: Update user profile
  if (req.method === 'PUT') {
    const profileData = req.body;
    
    // Basic validation
    if (!profileData) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Profile data is required'
        }
      });
    }
    
    const response = await updateUserProfile(token, profileData);
    
    if (response.success) {
      return res.status(200).json(response.data);
    }
    
    return res.status(response.error.status || 400).json({
      success: false,
      error: response.error
    });
  }
  
  // Other methods not allowed (handled by middleware)
  return res.status(405).json({
    success: false,
    error: {
      message: `Method ${req.method} not allowed`
    }
  });
}

// Export with API route middleware
export default createApiRoute(profileHandler, {
  methods: ['GET', 'PUT'],
  requireAuth: true
});

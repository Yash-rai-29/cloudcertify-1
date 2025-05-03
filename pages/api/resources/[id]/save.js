import { createApiRoute } from '../../../../lib/server/apiMiddleware';
import { saveResource, unsaveResource } from '../../../../lib/server/resourceService';

/**
 * API route for saving/unsaving resources
 * Handles both POST (save) and DELETE (unsave) requests
 * 
 * @param {Object} req - Next.js API request
 * @param {Object} res - Next.js API response
 */
async function resourceSaveHandler(req, res) {
  const { token } = req;
  const { id } = req.query;
  
  // Handle POST request to save a resource
  if (req.method === 'POST') {
    const response = await saveResource(token, id);
    
    if (response.success) {
      return res.status(200).json(response.data);
    }
    
    return res.status(response.error.status || 500).json({
      success: false,
      error: response.error
    });
  }
  
  // Handle DELETE request to unsave a resource
  if (req.method === 'DELETE') {
    const response = await unsaveResource(token, id);
    
    if (response.success) {
      return res.status(200).json(response.data);
    }
    
    return res.status(response.error.status || 500).json({
      success: false,
      error: response.error
    });
  }
  
  // Method not allowed (should be handled by middleware)
  return res.status(405).json({
    success: false,
    error: { message: `Method ${req.method} not allowed` }
  });
}

// Export with API route middleware
export default createApiRoute(resourceSaveHandler, {
  methods: ['POST', 'DELETE'],
  requireAuth: true
});

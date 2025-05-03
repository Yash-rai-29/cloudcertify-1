import { createApiRoute } from '../../../lib/server/apiMiddleware';
import { getResources } from '../../../lib/server/resourceService';

/**
 * API route for fetching learning resources
 * 
 * @param {Object} req - Next.js API request
 * @param {Object} res - Next.js API response
 */
async function resourcesHandler(req, res) {
  const { token } = req;
  const { category, search, tag, sort_by, sort_order, limit, page } = req.query;
  
  // Parse numeric query parameters
  const parsedLimit = limit ? parseInt(limit, 10) : undefined;
  const parsedPage = page ? parseInt(page, 10) : undefined;
  
  // Call the server-side API function
  const response = await getResources(token, {
    category,
    search,
    tag,
    sort_by,
    sort_order,
    limit: parsedLimit,
    page: parsedPage
  });

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
export default createApiRoute(resourcesHandler, {
  methods: ['GET'],
  requireAuth: true
});

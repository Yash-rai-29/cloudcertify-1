import { createApiRoute } from '../../../lib/server/apiMiddleware';

/**
 * API route for chat functionality
 * 
 * @param {Object} req - Next.js API request
 * @param {Object} res - Next.js API response
 */
async function chatHandler(req, res) {
  const { token } = req;
  
  if (req.method === 'GET') {
    // Get chat history
    return res.status(200).json({
      messages: []
    });
  }
  
  if (req.method === 'POST') {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: { message: 'Message is required' }
      });
    }
    
    // Process the chat message
    // In a real implementation, this would call the server-side chat service
    
    return res.status(200).json({
      success: true,
      message: {
        id: Date.now().toString(),
        text: message,
        sender: 'user',
        timestamp: new Date().toISOString()
      },
      response: {
        id: (Date.now() + 1).toString(),
        text: "I'm an AI assistant helping you prepare for your GCP certification. What would you like to know?",
        sender: 'assistant',
        timestamp: new Date().toISOString()
      }
    });
  }
  
  // Method not allowed (should be handled by middleware)
  return res.status(405).json({
    success: false,
    error: { message: `Method ${req.method} not allowed` }
  });
}

// Export with API route middleware
export default createApiRoute(chatHandler, {
  methods: ['GET', 'POST'],
  requireAuth: true
});

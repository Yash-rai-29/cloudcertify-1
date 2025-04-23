import { apiRequest } from './api';

// Flag to use mock data during development
const USE_MOCK_DATA = false;

/**
 * Get user dashboard data
 * 
 * @returns {Promise} User dashboard data
 */
export const getDashboardData = async () => {
  if (USE_MOCK_DATA) {
    return {
      success: true,
      data: {
        user: mockUserData,
        daily_question: mockDailyQuestion,
        recommendations: mockRecommendations,
        recent_activities: mockActivities
      }
    };
  }
  
  return await apiRequest('get', '/b/dashboard');
};

/**
 * Get user profile data
 * 
 * @param {string} userId - User ID
 * @returns {Promise} User profile data
 */
export const getUserProfile = async (userId) => {
  if (USE_MOCK_DATA) {
    return {
      success: true,
      data: mockUserData
    };
  }
  
  return await apiRequest('get', `/b/users/${userId}/profile`);
};

/**
 * Update user profile
 * 
 * @param {string} userId - User ID
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} Updated user profile
 */
export const updateUserProfile = async (userId, profileData) => {
  if (USE_MOCK_DATA) {
    return {
      success: true,
      data: { ...mockUserData, ...profileData }
    };
  }
  
  return await apiRequest('put', `/b/manage_user/users`, profileData);
};

/**
 * Get user test history
 * 
 * @param {string} userId - User ID
 * @param {number} page - Page number for pagination
 * @param {number} limit - Number of items per page
 * @returns {Promise} User test history
 */
export const getTestHistory = async (userId, page = 1, limit = 10) => {
  if (USE_MOCK_DATA) {
    return {
      success: true,
      data: {
        tests: mockTestHistory,
        pagination: {
          current_page: page,
          total_pages: 1,
          total_items: mockTestHistory.length,
          per_page: limit
        }
      }
    };
  }
  
  return await apiRequest('get', `/b/users/${userId}/test-history`, null, { page, limit });
};

/**
 * Get test library data
 * 
 * @param {Object} filters - Test filters
 * @param {number} page - Page number for pagination
 * @param {number} limit - Number of items per page
 * @returns {Promise} Test library data
 */
export const getTestLibrary = async (filters = {}, page = 1, limit = 10) => {
  if (USE_MOCK_DATA) {
    return {
      success: true,
      data: {
        tests: mockTestLibrary.tests,
        categories: mockTestLibrary.categories,
        pagination: {
          current_page: page,
          total_pages: 1,
          total_items: mockTestLibrary.tests.length,
          per_page: limit
        }
      }
    };
  }
  
  return await apiRequest('get', '/b/tests', null, { ...filters, page, limit });
};

/**
 * Get leaderboard data
 * 
 * @param {string} timeframe - Timeframe for leaderboard (week, month, all-time)
 * @param {number} limit - Number of users to return
 * @returns {Promise} Leaderboard data
 */
export const getLeaderboard = async (timeframe = 'week', limit = 10) => {
  if (USE_MOCK_DATA) {
    return {
      success: true,
      data: {
        timeframe,
        users: mockLeaderboard
      }
    };
  }
  
  return await apiRequest('get', '/b/leaderboard', null, { timeframe, limit });
};

/**
 * Get resources list
 * 
 * @param {Object} filters - Resource filters
 * @param {number} page - Page number for pagination
 * @param {number} limit - Number of items per page
 * @returns {Promise} Resources data
 */
export const getResources = async (filters = {}, page = 1, limit = 10) => {
  if (USE_MOCK_DATA) {
    return {
      success: true,
      data: {
        resources: mockResources,
        pagination: {
          current_page: page,
          total_pages: 1,
          total_items: mockResources.length,
          per_page: limit
        }
      }
    };
  }
  
  return await apiRequest('get', '/b/resources', null, { ...filters, page, limit });
};

/**
 * Submit answer for daily question
 * 
 * @param {string} questionId - Question ID
 * @param {string} optionId - Selected option ID
 * @returns {Promise} Submission result
 */
export const submitDailyAnswer = async (questionId, optionId) => {
  if (USE_MOCK_DATA) {
    const isCorrect = optionId === mockDailyQuestion.correct_option_id;
    
    return {
      success: true,
      data: {
        is_correct: isCorrect,
        correct_option_id: mockDailyQuestion.correct_option_id,
        explanation: mockDailyQuestion.explanation,
        points_earned: isCorrect ? 10 : 0
      }
    };
  }
  
  return await apiRequest('post', `/b/questions/${questionId}/answer`, { option_id: optionId });
};

/**
 * Send chat message to AI assistant
 * 
 * @param {string} message - User message
 * @param {Array} history - Chat history
 * @returns {Promise} AI response
 */
export const sendChatMessage = async (message, history = []) => {
  if (USE_MOCK_DATA) {
    // Simple mock implementation with hard-coded responses based on keywords
    const lowerMessage = message.toLowerCase();
    let response = "I'm your GCP certification assistant. How can I help you today?";
    
    if (lowerMessage.includes('kubernetes') || lowerMessage.includes('gke')) {
      response = "Google Kubernetes Engine (GKE) is a managed Kubernetes service that simplifies container orchestration. It's ideal for microservices architectures and provides automated upgrades, scaling, and repair capabilities. For certification, focus on node pools, auto-scaling, and networking concepts.";
    } else if (lowerMessage.includes('storage') || lowerMessage.includes('bucket')) {
      response = "Google Cloud Storage offers object storage with different storage classes (Standard, Nearline, Coldline, Archive) for different access patterns. Key concepts for certification include lifecycle policies, IAM permissions, and understanding when to use Cloud Storage vs. other storage options like Filestore or Persistent Disk.";
    } else if (lowerMessage.includes('exam') || lowerMessage.includes('certification')) {
      response = "To prepare for GCP certification exams, I recommend: 1) Review the exam guide thoroughly, 2) Take practice tests to identify knowledge gaps, 3) Get hands-on experience with Qwiklabs, 4) Study official documentation for each service, and 5) Join community forums to learn from others' experiences.";
    }
    
    return {
      success: true,
      data: {
        message: response,
        sources: []
      }
    };
  }
  
  return await apiRequest('post', '/chat', { message, history });
};
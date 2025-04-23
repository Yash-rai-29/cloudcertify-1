/**
 * Application-wide constants
 */

// API configuration
export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://base-service-6070296894.us-central1.run.app',
  ENDPOINTS: {
    // Auth endpoints
    USERS: '/b/manage_user/users',
    USER_ME: '/b/manage_user/users/me',
    CHECK_USER_EXISTS: '/b/manage_user/users/check-exists',
    
    // Dashboard endpoints
    USER_STATISTICS: '/b/user_statistics/user-statistics',
    USER_ACTIVITIES: '/b/user_activity/activities',
    DAILY_QUESTION: '/b/user_activity/daily-question',
    DAILY_STREAK: '/b/user_activity/daily-streak',
    SUBMIT_DAILY_QUESTION: '/b/user_activity/daily-question/submit',
    
    // Tests endpoints
    TESTS: '/b/test_library/tests',
    TEST_ATTEMPTS: '/b/test_library/attempts',
    TEST_HISTORY: '/b/test_library/users/history',
    
    // Leaderboard
    LEADERBOARD: '/b/leaderboard/leaderboard',
    
    // Resources
    RESOURCES: '/b/resources/resources',
    
    // AI Chat
    CHAT: '/b/chat_ai/chat',
    CHAT_SESSIONS: '/b/chat_ai/sessions',
    
    // Recommendations
    RECOMMENDATIONS: '/b/recommendation/recommendations',
  }
};

// Authentication configuration
export const AUTH = {
  COOKIE_NAMES: {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token'
  },
  ROUTES: {
    LOGIN: '/login',
    SIGNUP: '/signup',
    DASHBOARD: '/dashboard',
    PROTECTED_ROUTES: ['/dashboard', '/profile']
  }
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  RATE_LIMIT: 429,
  SERVER_ERROR: 500
};
/**
 * Application-wide constants
 */

// API configuration
export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://base-service-6070296894.us-central1.run.app',
  
  // Auth endpoints
  USERS: '/b/manage_user/users',
  USER_INFO: '/b/manage_user/users/me',
  CHECK_USER_EXISTS: '/b/manage_user/users/check-exists',
  
  // Dashboard endpoints
  USER_STATISTICS: '/b/user_statistics/user-statistics',
  USER_ACTIVITIES: '/b/user_activity/activities',
  DAILY_QUESTION: '/b/user_activity/daily-question',
  DAILY_STREAK: '/b/user_activity/daily-streak',
  SUBMIT_DAILY_ANSWER: '/b/user_activity/daily-question/submit',
  
  // Tests endpoints
  TESTS: '/b/test_library/tests',
  TEST_ATTEMPTS: '/b/test_library/attempts',
  TEST_HISTORY: '/b/test_library/users/history',
  START_TEST: '/b/test_library/tests/start',
  
  // Test recommendations
  TEST_RECOMMENDATIONS: '/b/recommendation/recommendations',
  
  // Leaderboard
  LEADERBOARD: '/b/leaderboard/leaderboard',
  
  // Resources
  CERTIFICATION_RESOURCES: '/b/resources/resources',
  
  // AI Chat
  AI_CHAT: '/b/chat_ai/chat',
  CHAT_SESSIONS: '/b/chat_ai/sessions',
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

// Error Codes and Messages
export const ERRORS = {
  AUTH: {
    USER_EXISTS: {
      code: 'user_exists',
      message: 'A user with this email already exists. Please try logging in instead.'
    },
    INVALID_CREDENTIALS: {
      code: 'invalid_credentials',
      message: 'Invalid email or password. Please try again.'
    },
    WEAK_PASSWORD: {
      code: 'weak_password',
      message: 'Password is too weak. Please use a stronger password.'
    },
    EMAIL_IN_USE: {
      code: 'email_in_use',
      message: 'This email is already in use. Please try logging in instead.'
    },
    NETWORK_ERROR: {
      code: 'network_error',
      message: 'Network error. Please check your connection and try again.'
    },
    TOO_MANY_ATTEMPTS: {
      code: 'too_many_attempts',
      message: 'Too many unsuccessful attempts. Please try again later.'
    },
    ACCOUNT_DISABLED: {
      code: 'account_disabled',
      message: 'This account has been disabled. Please contact support.'
    },
    VALIDATION_ERROR: {
      code: 'validation_error',
      message: 'Please check the form for errors and try again.'
    }
  }
};

// Toast Configuration 
export const TOAST_CONFIG = {
  DEFAULT_DURATION: 4000,
  POSITION: 'top-right',
  SUCCESS: {
    style: {
      background: '#10B981',
      color: 'white',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
    },
    duration: 3000
  },
  ERROR: {
    style: {
      background: '#EF4444',
      color: 'white',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
    },
    duration: 4000
  },
  INFO: {
    style: {
      background: '#3B82F6',
      color: 'white',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
    },
    duration: 3500
  },
  WARNING: {
    style: {
      background: '#F59E0B',
      color: 'white',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
    },
    duration: 4000
  }
};
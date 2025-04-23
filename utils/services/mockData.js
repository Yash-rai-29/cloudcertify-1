/**
 * Mock data for testing UI components while API is unavailable
 */

// Mock user data
export const mockUserData = {
  id: "user-123",
  displayName: "Alex Johnson",
  email: "alex@example.com",
  photoURL: null,
  createdAt: "2023-01-15T08:30:00Z",
  streak: {
    current: 7,
    longest: 14,
    last_activity_date: "2023-04-22T07:15:00Z"
  },
  stats: {
    tests_taken: 24,
    questions_answered: 342,
    correct_answers: 289,
    avg_score: 84.5
  },
  preferences: {
    certification_goal: "Google Cloud Professional Cloud Architect",
    daily_study_reminder: true,
    study_time_minutes: 60,
    topic_focus: ["Compute Engine", "Cloud Storage", "IAM"]
  }
};

// Mock daily question
export const mockDailyQuestion = {
  id: "question-456",
  question_text: "Which of the following GCP services would be most appropriate for running containerized microservices with automatic scaling and management?",
  category: "Compute",
  category_color: "blue",
  difficulty: "intermediate",
  options: [
    { id: "a", text: "Compute Engine" },
    { id: "b", text: "Google Kubernetes Engine (GKE)" },
    { id: "c", text: "Cloud Functions" },
    { id: "d", text: "App Engine Standard" }
  ],
  correct_option_id: "b",
  explanation: "Google Kubernetes Engine (GKE) is designed specifically for running containerized applications at scale. It provides the orchestration features of Kubernetes with the reliability of Google's infrastructure, making it ideal for microservices architectures that require automatic scaling and management."
};

// Mock test library data
export const mockTestLibrary = {
  categories: [
    { id: "architect", name: "Cloud Architect", count: 12 },
    { id: "engineer", name: "Cloud Engineer", count: 15 },
    { id: "devops", name: "DevOps Engineer", count: 8 },
    { id: "data", name: "Data Engineer", count: 10 }
  ],
  tests: [
    {
      id: "test-1",
      title: "Google Cloud Architect Practice Test 1",
      description: "Comprehensive practice test covering all aspects of the Cloud Architect certification",
      category: "Cloud Architect",
      difficulty: "intermediate",
      question_count: 50,
      time_limit_minutes: 120,
      popularity_score: 98,
      created_at: "2023-01-10T14:30:00Z",
      updated_at: "2023-03-22T09:15:00Z",
      avg_score: 78.5,
      completion_rate: 89,
      topics: ["Compute", "Storage", "Networking", "Security"]
    },
    {
      id: "test-2",
      title: "Google Cloud Engineer Fundamentals",
      description: "Essential concepts for the Associate Cloud Engineer certification",
      category: "Cloud Engineer",
      difficulty: "beginner",
      question_count: 30,
      time_limit_minutes: 60,
      popularity_score: 95,
      created_at: "2023-02-15T10:45:00Z",
      updated_at: "2023-04-05T16:20:00Z",
      avg_score: 82.3,
      completion_rate: 94,
      topics: ["VPC", "IAM", "Compute Engine", "Cloud Storage"]
    },
    {
      id: "test-3",
      title: "GCP DevOps Tools & Practices",
      description: "Specialized test focusing on CI/CD and monitoring in Google Cloud",
      category: "DevOps Engineer",
      difficulty: "advanced",
      question_count: 40,
      time_limit_minutes: 90,
      popularity_score: 87,
      created_at: "2023-03-05T08:00:00Z",
      updated_at: "2023-04-12T11:30:00Z",
      avg_score: 74.8,
      completion_rate: 82,
      topics: ["Cloud Build", "Cloud Deploy", "Monitoring", "Logging"]
    },
    {
      id: "test-4",
      title: "Data Processing on GCP",
      description: "Comprehensive test covering BigQuery, Dataflow, and data processing patterns",
      category: "Data Engineer",
      difficulty: "intermediate",
      question_count: 45,
      time_limit_minutes: 100,
      popularity_score: 91,
      created_at: "2023-02-28T13:15:00Z",
      updated_at: "2023-04-18T09:45:00Z",
      avg_score: 76.2,
      completion_rate: 85,
      topics: ["BigQuery", "Dataflow", "Pub/Sub", "Cloud Storage"]
    }
  ]
};

// Mock test history data
export const mockTestHistory = [
  {
    id: "history-1",
    test_id: "test-1",
    test_title: "Google Cloud Architect Practice Test 1",
    category: "Cloud Architect",
    score: 82,
    max_score: 100,
    questions_answered: 50,
    questions_correct: 41,
    time_spent_minutes: 105,
    completed_at: "2023-04-10T15:45:00Z"
  },
  {
    id: "history-2",
    test_id: "test-2",
    test_title: "Google Cloud Engineer Fundamentals",
    category: "Cloud Engineer",
    score: 90,
    max_score: 100,
    questions_answered: 30,
    questions_correct: 27,
    time_spent_minutes: 48,
    completed_at: "2023-04-05T11:20:00Z"
  },
  {
    id: "history-3",
    test_id: "test-3",
    test_title: "GCP DevOps Tools & Practices",
    category: "DevOps Engineer",
    score: 75,
    max_score: 100,
    questions_answered: 40,
    questions_correct: 30,
    time_spent_minutes: 82,
    completed_at: "2023-03-28T14:10:00Z"
  }
];

// Mock recommendations data
export const mockRecommendations = [
  {
    id: "rec-1",
    title: "Google Cloud Security Design",
    category: "Cloud Architect",
    difficulty: "advanced",
    recommendation_type: "suggested",
    recommendation_reason: "Based on your previous test performance",
    popularity_score: 92
  },
  {
    id: "rec-2",
    title: "GKE and Kubernetes Networking",
    category: "DevOps Engineer",
    difficulty: "intermediate",
    recommendation_type: "popular",
    recommendation_reason: "Highly rated by other users",
    popularity_score: 97
  },
  {
    id: "rec-3",
    title: "Cloud Storage Best Practices",
    category: "Cloud Engineer",
    difficulty: "beginner",
    recommendation_type: "progress",
    recommendation_reason: "Helps complete your learning path",
    popularity_score: 85
  }
];

// Mock activities data
export const mockActivities = [
  {
    id: "activity-1",
    type: "test_completed",
    title: "Completed Practice Test",
    description: "Google Cloud Architect Practice Test 1 - Score: 82%",
    timestamp: Math.floor(new Date("2023-04-10T15:45:00Z").getTime() / 1000)
  },
  {
    id: "activity-2",
    type: "badge_earned",
    title: "Badge Earned",
    description: "5-Day Streak Achievement",
    timestamp: Math.floor(new Date("2023-04-08T09:30:00Z").getTime() / 1000)
  },
  {
    id: "activity-3",
    type: "question_answered",
    title: "Daily Question Completed",
    description: "Answered correctly on Cloud IAM topic",
    timestamp: Math.floor(new Date("2023-04-07T12:15:00Z").getTime() / 1000)
  }
];

// Mock leaderboard data
export const mockLeaderboard = [
  {
    id: "user-789",
    rank: 1,
    displayName: "Sarah Chen",
    photoURL: null,
    points: 12500,
    tests_completed: 32,
    streak: 21
  },
  {
    id: "user-456",
    rank: 2,
    displayName: "Miguel Rodriguez",
    photoURL: null,
    points: 11200,
    tests_completed: 28,
    streak: 14
  },
  {
    id: "user-123",
    rank: 3,
    displayName: "Alex Johnson",
    photoURL: null,
    points: 10800,
    tests_completed: 24,
    streak: 7,
    isCurrentUser: true
  },
  {
    id: "user-234",
    rank: 4,
    displayName: "Emily Taylor",
    photoURL: null,
    points: 9600,
    tests_completed: 22,
    streak: 5
  },
  {
    id: "user-345",
    rank: 5,
    displayName: "David Kim",
    photoURL: null,
    points: 8900,
    tests_completed: 19,
    streak: 3
  }
];

// Mock resources data
export const mockResources = [
  {
    id: "resource-1",
    title: "Official Google Cloud Documentation",
    url: "https://cloud.google.com/docs",
    type: "documentation",
    description: "Official documentation for all Google Cloud services",
    tags: ["reference", "official", "comprehensive"]
  },
  {
    id: "resource-2",
    title: "Google Cloud Architect Certification Guide",
    url: "https://cloud.google.com/certification/cloud-architect",
    type: "guide",
    description: "Complete overview of the certification requirements and exam topics",
    tags: ["certification", "architect", "exam-prep"]
  },
  {
    id: "resource-3",
    title: "Qwiklabs: GCP Essentials",
    url: "https://www.qwiklabs.com/quests/23",
    type: "hands-on",
    description: "Hands-on labs covering fundamental GCP services",
    tags: ["practical", "labs", "beginner"]
  },
  {
    id: "resource-4",
    title: "Google Cloud YouTube Channel",
    url: "https://www.youtube.com/user/googlecloudplatform",
    type: "video",
    description: "Video tutorials and overviews for Google Cloud Platform",
    tags: ["video", "tutorials", "visual-learning"]
  }
];
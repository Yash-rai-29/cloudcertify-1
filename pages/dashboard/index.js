import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getLayout } from '../../components/dashboard/DashboardLayout';
import { TracingBeam } from '../../components/ui/TracingBeam';
import DashboardCard from '../../components/ui/DashboardCard';
import StatCard from '../../components/ui/StatCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import UserProfile from '../../components/dashboard/UserProfile';
import { 
  FiActivity, 
  FiBookOpen, 
  FiCalendar, 
  FiClock, 
  FiTrendingUp,
  FiAward,
  FiBriefcase,
  FiClipboard,
  FiCheckCircle,
  FiBarChart2
} from 'react-icons/fi';
import { 
  getUserInfo, 
  getDailyStreak, 
  getDailyQuestion, 
  getUserActivities, 
  getTestRecommendations,
  formatDate,
  timeAgo
} from '../../utils/services/dashboardService';

// Activity type to icon mapping
const activityIcons = {
  'test_completed': <FiClipboard className="text-blue-500" size={18} />,
  'topic_completed': <FiCheckCircle className="text-indigo-500" size={18} />,
  'badge_earned': <FiAward className="text-amber-500" size={18} />,
  'topic_started': <FiBookOpen className="text-emerald-500" size={18} />,
  'login': <FiActivity className="text-violet-500" size={18} />,
  'daily_question': <FiBarChart2 className="text-rose-500" size={18} />,
  'default': <FiActivity className="text-gray-500" size={18} />
};

// Get activity icon based on activity type from metadata
const getActivityIcon = (activity) => {
  const activityType = activity.metadata?.type || 'default';
  return activityIcons[activityType] || activityIcons.default;
};

// Get activity title and description based on activity metadata
const getActivityDetails = (activity) => {
  const { metadata } = activity;
  
  switch (metadata?.type) {
    case 'test_completed':
      return {
        title: 'Completed practice test',
        description: metadata.test_name || 'GCP Certification Test'
      };
    case 'topic_completed':
      return {
        title: 'Completed topic',
        description: metadata.topic_name || 'GCP Topic'
      };
    case 'badge_earned':
      return {
        title: 'Earned badge',
        description: metadata.badge_name || 'GCP Badge'
      };
    case 'topic_started':
      return {
        title: 'Started new topic',
        description: metadata.topic_name || 'GCP Topic'
      };
    case 'daily_question':
      return {
        title: 'Answered daily question',
        description: metadata.correct ? 'Answered correctly' : 'Answered incorrectly'
      };
    case 'login':
      return {
        title: 'Logged in',
        description: 'Started a new study session'
      };
    default:
      return {
        title: activity.activity || 'Activity',
        description: 'Cloud certification preparation'
      };
  }
};

// Calculate certification progress based on completed modules
const calculateProgress = (user) => {
  if (!user || !user.completed_modules) return 0;
  
  // This is a simplified calculation that should be replaced with actual logic
  const totalModules = 20; // Placeholder for total number of modules
  const completedModules = user.completed_modules.length;
  
  return Math.round((completedModules / totalModules) * 100);
};

export default function Dashboard() {
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState({
    user: true,
    streak: true,
    question: true,
    activities: true,
    recommendations: true
  });
  const [error, setError] = useState({
    user: null,
    streak: null,
    question: null,
    activities: null,
    recommendations: null
  });
  const [userData, setUserData] = useState(null);
  const [streak, setStreak] = useState(null);
  const [dailyQuestion, setDailyQuestion] = useState(null);
  const [activities, setActivities] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // Get current date in YYYY-MM-DD format for daily question
  const getCurrentDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserInfo();
        if (response.success) {
          setUserData(response.data);
        } else {
          setError(prev => ({ ...prev, user: response.error.message }));
        }
      } catch (err) {
        setError(prev => ({ ...prev, user: 'Failed to fetch user information' }));
      } finally {
        setLoading(prev => ({ ...prev, user: false }));
      }
    };

    fetchUserData();
  }, []);

  // Fetch streak data
  useEffect(() => {
    const fetchStreakData = async () => {
      try {
        const response = await getDailyStreak();
        if (response.success) {
          setStreak(response.data);
        } else {
          setError(prev => ({ ...prev, streak: response.error.message }));
        }
      } catch (err) {
        setError(prev => ({ ...prev, streak: 'Failed to fetch streak information' }));
      } finally {
        setLoading(prev => ({ ...prev, streak: false }));
      }
    };

    fetchStreakData();
  }, []);

  // Fetch daily question
  useEffect(() => {
    const fetchDailyQuestion = async () => {
      try {
        const date = getCurrentDate();
        const response = await getDailyQuestion(date);
        if (response.success) {
          setDailyQuestion(response.data);
        } else {
          setError(prev => ({ ...prev, question: response.error.message }));
        }
      } catch (err) {
        setError(prev => ({ ...prev, question: 'Failed to fetch daily question' }));
      } finally {
        setLoading(prev => ({ ...prev, question: false }));
      }
    };

    fetchDailyQuestion();
  }, []);

  // Fetch user activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await getUserActivities();
        if (response.success) {
          setActivities(response.data.activities || []);
        } else {
          setError(prev => ({ ...prev, activities: response.error.message }));
        }
      } catch (err) {
        setError(prev => ({ ...prev, activities: 'Failed to fetch user activities' }));
      } finally {
        setLoading(prev => ({ ...prev, activities: false }));
      }
    };

    fetchActivities();
  }, []);

  // Fetch test recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await getTestRecommendations(3);
        if (response.success) {
          setRecommendations(response.data.recommendations || []);
        } else {
          setError(prev => ({ ...prev, recommendations: response.error.message }));
        }
      } catch (err) {
        setError(prev => ({ ...prev, recommendations: 'Failed to fetch test recommendations' }));
      } finally {
        setLoading(prev => ({ ...prev, recommendations: false }));
      }
    };

    fetchRecommendations();
  }, []);

  // Check if all data is loading
  const isLoading = Object.values(loading).some(status => status);

  // If loading, display a loading spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" text="Loading dashboard data..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* User Profile Section */}
      {userData && <UserProfile user={userData} loading={loading.user} error={error.user} />}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="Progress Status" 
          value={`${calculateProgress(userData)}%`} 
          description="Overall completion" 
          icon={<FiTrendingUp className="text-emerald-500" size={20} />}
        />
        
        <StatCard 
          title="Daily Streak" 
          value={streak?.current_streak || 0} 
          description="days in a row" 
          icon={<FiCalendar className="text-amber-500" size={20} />}
        />
        
        <StatCard 
          title="Practice Tests" 
          value={userData?.activity?.tests_taken || 0} 
          description="tests completed" 
          icon={<FiClipboard className="text-blue-500" size={20} />}
        />
        
        <StatCard 
          title="Study Time" 
          value={Math.round((userData?.activity?.study_time_minutes || 0) / 60)} 
          description="hours this month" 
          icon={<FiClock className="text-indigo-500" size={20} />}
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Question Card */}
        <DashboardCard title="Daily Question" className="lg:col-span-2">
          {error.question ? (
            <ErrorMessage
              title="Failed to load daily question"
              message={error.question}
              retry={() => window.location.reload()}
            />
          ) : dailyQuestion?.question ? (
            <div className="space-y-4">
              <p className="text-gray-800">{dailyQuestion.question.question}</p>
              
              <div className="space-y-2">
                {dailyQuestion.question.options.map((option, index) => (
                  <div 
                    key={index}
                    className={`p-3 border rounded-lg ${
                      dailyQuestion.user_attempt?.answer === option && dailyQuestion.user_attempt?.is_correct
                        ? 'bg-green-50 border-green-200'
                        : dailyQuestion.user_attempt?.answer === option && !dailyQuestion.user_attempt?.is_correct
                        ? 'bg-red-50 border-red-200'
                        : option === dailyQuestion.question.correct_answer && dailyQuestion.user_attempt?.attempted
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="mr-3 h-5 w-5 flex items-center justify-center rounded-full border border-gray-300">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {dailyQuestion.user_attempt?.attempted && (
                <div className={`mt-4 p-4 rounded-lg ${
                  dailyQuestion.user_attempt.is_correct 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-blue-50 border border-blue-200'
                }`}>
                  <h3 className="font-medium text-gray-800 mb-2">Explanation</h3>
                  <p className="text-gray-700">{dailyQuestion.question.explanation}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No daily question available today</p>
            </div>
          )}
        </DashboardCard>

        {/* Test Recommendations */}
        <DashboardCard title="Recommended Tests">
          {error.recommendations ? (
            <ErrorMessage
              title="Failed to load recommendations"
              message={error.recommendations}
            />
          ) : recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((test, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <h3 className="font-medium text-gray-800">{test.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {test.category}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      {test.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No test recommendations available</p>
            </div>
          )}
        </DashboardCard>
      </div>

      {/* Recent Activity Section */}
      <DashboardCard 
        title="Recent Activity" 
        rightHeaderContent={
          <span className="text-sm text-gray-500">Last {activities.length} activities</span>
        }
      >
        {error.activities ? (
          <ErrorMessage
            title="Failed to load activities"
            message={error.activities}
          />
        ) : activities.length > 0 ? (
          <TracingBeam>
            <div className="space-y-4">
              {activities.map((activity) => {
                const { title, description } = getActivityDetails(activity);
                return (
                  <div key={activity.id} className="pl-5 relative">
                    <div className="absolute left-0 top-1.5">
                      <div className="bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                        {getActivityIcon(activity)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-gray-800 font-medium">{title}</h3>
                      <p className="text-sm text-gray-600">{description}</p>
                      <p className="text-xs text-gray-500 mt-1">{timeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </TracingBeam>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No recent activities</p>
          </div>
        )}
      </DashboardCard>
    </div>
  );
}

// Use the DashboardLayout for this page
Dashboard.getLayout = getLayout;
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
  FiBarChart2,
  FiPlay,
  FiMessageSquare,
  FiFileText,
  FiUser,
  FiArrowRight
} from 'react-icons/fi';
import { 
  getUserInfo, 
  getDailyStreak, 
  getDailyQuestion,
  submitDailyAnswer,
  getUserActivities, 
  getTestRecommendations,
  formatDate,
  timeAgo
} from '../../utils/services/dashboardService';

// Activity type to icon mapping
const activityIcons = {
  'quizAttempt': <FiBarChart2 className="text-rose-500" size={18} />,
  'testStarted': <FiBookOpen className="text-emerald-500" size={18} />,
  'testCompleted': <FiClipboard className="text-blue-500" size={18} />,
  'default': <FiActivity className="text-gray-500" size={18} />
};

// Get difficulty colors
const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'beginner':
      return 'bg-green-100 text-green-700';
    case 'intermediate':
      return 'bg-blue-100 text-blue-700';
    case 'advanced':
      return 'bg-purple-100 text-purple-700';
    case 'expert':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// Get recommendation type badge style
const getRecommendationStyle = (type) => {
  switch (type?.toLowerCase()) {
    case 'personalized':
      return 'bg-indigo-100 text-indigo-700';
    case 'popular':
      return 'bg-amber-100 text-amber-700';
    case 'new':
      return 'bg-emerald-100 text-emerald-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// Calculate certification progress based on completed modules
const calculateProgress = (user) => {
  if (!user || !user.completedModules) return 0;
  
  // This is a simplified calculation that should be replaced with actual logic
  const totalModules = 20; // Placeholder for total number of modules
  const completedModules = user.completedModules.length;
  
  return Math.round((completedModules / totalModules) * 100);
};

export default function Dashboard() {
  const router = useRouter();
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
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [activities, setActivities] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [visibleActivities, setVisibleActivities] = useState(5);

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
        const response = await getDailyQuestion();
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
        const response = await getTestRecommendations(4);
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

  // Handle option selection for daily question
  const handleOptionSelect = (option) => {
    if (dailyQuestion?.userAttempt?.attempted) return;
    setSelectedOption(option);
  };

  // Handle daily question submission
  const handleSubmitAnswer = async () => {
    if (!selectedOption || !dailyQuestion?.question?.id) return;
    
    setSubmitting(true);
    
    try {
      const response = await submitDailyAnswer(
        dailyQuestion.question.id,
        selectedOption
      );
      
      if (response.success) {
        // Update streak with the response
        setStreak(response.data);
        
        // Update the user attempt status in the current question
        setDailyQuestion(prev => ({
          ...prev,
          userAttempt: {
            attempted: true,
            answer: selectedOption,
            isCorrect: selectedOption === prev.question.correctAnswer,
            timestamp: Math.floor(Date.now() / 1000)
          }
        }));
      } else {
        setError(prev => ({ 
          ...prev, 
          question: response.error.message 
        }));
      }
    } catch (err) {
      setError(prev => ({ 
        ...prev, 
        question: 'Failed to submit answer. Please try again.' 
      }));
    } finally {
      setSubmitting(false);
    }
  };

  // Load more activities
  const loadMoreActivities = () => {
    setVisibleActivities(prev => prev + 5);
  };

  // Navigate to profile
  const navigateToProfile = () => {
    router.push('/dashboard/profile');
  };

  // Navigate to test library
  const navigateToTestLibrary = () => {
    router.push('/dashboard/test-library');
  };

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
      {/* Header Section with User Profile and Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-semibold">
            {userData?.avatarUrl ? (
              <img 
                src={userData.avatarUrl} 
                alt={userData.firstName} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              userData?.firstName?.charAt(0) || 'U'
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {userData?.firstName || authUser?.displayName?.split(' ')[0] || 'User'}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="flex items-center">
                <FiCalendar className="mr-1 text-blue-500" />
                {streak?.currentStreak || 0} day streak
              </span>
              <span className="flex items-center">
                <FiAward className="mr-1 text-amber-500" />
                {userData?.certificationTarget || 'GCP Certification'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={navigateToTestLibrary}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiPlay size={16} />
            <span>Start Practice Test</span>
          </button>
          <button 
            onClick={navigateToProfile}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiUser size={16} />
            <span>View Profile</span>
          </button>
        </div>
      </div>
      
      {/* Daily Streak Challenge */}
      <DashboardCard title="Daily Streak Challenge" className="overflow-hidden">
        {error.question || error.streak ? (
          <ErrorMessage
            title="Failed to load daily challenge"
            message={error.question || error.streak}
            retry={() => window.location.reload()}
          />
        ) : dailyQuestion?.question ? (
          <div className="space-y-6">
            {/* Streak Progress */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Day {streak?.currentStreak || 0} of your streak</span>
                <span className="text-sm text-gray-500">Keep it going!</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                  style={{ width: `${Math.min((streak?.currentStreak || 0) / 30 * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">1 day</span>
                <span className="text-xs text-gray-500">30 days</span>
              </div>
            </div>

            {/* Daily Question */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg text-gray-800">Today's Question</h3>
              <p className="text-gray-800">{dailyQuestion.question.questionText}</p>
              
              <div className="space-y-2">
                {dailyQuestion.question.options.map((option, index) => (
                  <div 
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      dailyQuestion.userAttempt?.answer === option && dailyQuestion.userAttempt?.isCorrect
                        ? 'bg-green-50 border-green-200'
                        : dailyQuestion.userAttempt?.answer === option && !dailyQuestion.userAttempt?.isCorrect
                        ? 'bg-red-50 border-red-200'
                        : option === dailyQuestion.question.correctAnswer && dailyQuestion.userAttempt?.attempted
                        ? 'bg-green-50 border-green-200'
                        : selectedOption === option && !dailyQuestion.userAttempt?.attempted
                        ? 'bg-blue-50 border-blue-200'
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
              
              {/* Submit button or explanation */}
              {!dailyQuestion.userAttempt?.attempted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedOption || submitting}
                  className={`mt-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                    !selectedOption || submitting
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {submitting ? 'Submitting...' : 'Take Quiz'}
                </button>
              ) : (
                <div className={`mt-4 p-4 rounded-lg ${
                  dailyQuestion.userAttempt.isCorrect 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-blue-50 border border-blue-200'
                }`}>
                  <h3 className="font-medium text-gray-800 mb-2">
                    {dailyQuestion.userAttempt.isCorrect 
                      ? 'Correct! Great job!' 
                      : 'Not quite right. Here\'s the explanation:'}
                  </h3>
                  <p className="text-gray-700">{dailyQuestion.question.explanation}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No daily question available today</p>
          </div>
        )}
      </DashboardCard>
      
      {/* Learning Progress */}
      <DashboardCard title="Learning Progress">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard 
            title="Tests Taken" 
            value={userData?.activity?.testsTaken || 0}
            description="completed" 
            icon={<FiClipboard className="text-blue-500" size={20} />}
          />
          
          <StatCard 
            title="Questions Answered" 
            value={userData?.activity?.questionsAnswered || 0}
            description="total" 
            icon={<FiCheckCircle className="text-indigo-500" size={20} />}
          />
          
          <StatCard 
            title="Average Score" 
            value={`${(userData?.activity?.avgScore || 0).toFixed(1)}%`}
            description="all tests" 
            icon={<FiTrendingUp className="text-emerald-500" size={20} />}
          />
          
          <StatCard 
            title="Study Time" 
            value={Math.round((userData?.activity?.studyTimeMinutes || 0) / 60)}
            description="hours" 
            icon={<FiClock className="text-amber-500" size={20} />}
          />
        </div>
      </DashboardCard>
      
      {/* Recommended Tests and Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Tests */}
        <DashboardCard 
          title="Recommended Tests" 
          headerClassName="border-b-0"
          className="lg:col-span-2"
        >
          {error.recommendations ? (
            <ErrorMessage
              title="Failed to load recommendations"
              message={error.recommendations}
            />
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((test, index) => (
                <div 
                  key={index} 
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-medium text-gray-800 mb-1">{test.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {test.category}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(test.difficulty)}`}>
                      {test.difficulty}
                    </span>
                    {test.recommendationType && (
                      <span className={`px-2 py-1 text-xs rounded-full ${getRecommendationStyle(test.recommendationType)}`}>
                        {test.recommendationType}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FiBarChart2 size={14} />
                        {test.popularityScore?.toFixed(1) || 'N/A'} popularity
                      </span>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                      Start Test
                    </button>
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

        {/* Recent Activity */}
        <DashboardCard 
          title="Recent Activity" 
          rightHeaderContent={
            <span className="text-sm text-gray-500">
              Last {Math.min(visibleActivities, activities.length)} of {activities.length}
            </span>
          }
        >
          {error.activities ? (
            <ErrorMessage
              title="Failed to load activities"
              message={error.activities}
            />
          ) : activities.length > 0 ? (
            <div className="space-y-4">
              <TracingBeam>
                <div className="space-y-4">
                  {activities.slice(0, visibleActivities).map((activity) => {
                    const icon = activityIcons[activity.activityType] || activityIcons.default;
                    return (
                      <div key={activity.id} className="pl-5 relative">
                        <div className="absolute left-0 top-1.5">
                          <div className="bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                            {icon}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-gray-800 font-medium">{activity.description}</h3>
                          <p className="text-xs text-gray-500 mt-1">{timeAgo(activity.timestamp)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TracingBeam>
              
              {/* Load more button */}
              {visibleActivities < activities.length && (
                <div className="pt-2 flex justify-center">
                  <button 
                    onClick={loadMoreActivities}
                    className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    Load More <FiArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No recent activities</p>
            </div>
          )}
        </DashboardCard>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={navigateToTestLibrary}
          className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all flex items-center gap-3"
        >
          <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
            <FiPlay size={20} />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-gray-800">Take Practice Test</h3>
            <p className="text-xs text-gray-500">Test your knowledge</p>
          </div>
        </button>
        
        <button
          onClick={() => router.push('/dashboard/ai-chatbot')}
          className="bg-white p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all flex items-center gap-3"
        >
          <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
            <FiMessageSquare size={20} />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-gray-800">Ask AI Assistant</h3>
            <p className="text-xs text-gray-500">Get study help</p>
          </div>
        </button>
        
        <button
          onClick={() => router.push('/dashboard/resources')}
          className="bg-white p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all flex items-center gap-3"
        >
          <div className="p-3 rounded-lg bg-green-100 text-green-600">
            <FiFileText size={20} />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-gray-800">Browse Resources</h3>
            <p className="text-xs text-gray-500">Study materials & guides</p>
          </div>
        </button>
      </div>
    </div>
  );
}

// Use the DashboardLayout for this page
Dashboard.getLayout = getLayout;
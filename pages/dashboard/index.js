import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { getLayout } from '../../components/dashboard/DashboardLayout';
import { TracingBeam } from '../../components/ui/TracingBeam';
import DashboardCard from '../../components/ui/DashboardCard';
import StatCard from '../../components/ui/StatCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

// Dashboard Components
import DailyQuestionSection from '../../components/dashboard/DailyQuestionSection';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import ActivityItem from '../../components/dashboard/ActivityItem';
import TestRecommendationCard from '../../components/dashboard/TestRecommendationCard';
import QuickActionCard from '../../components/dashboard/QuickActionCard';

import { 
  FiActivity, 
  FiBookOpen,  
  FiClock, 
  FiTrendingUp,
  FiCheckCircle,
  FiBarChart2,
  FiPlay,
  FiMessageSquare,
  FiFileText,
  FiArrowRight
} from 'react-icons/fi';

import { 
  getUserInfo, 
  getDailyStreak, 
  getDailyQuestion,
  submitDailyAnswer,
  getUserActivities, 
  getTestRecommendations,
  timeAgo
} from '../../utils/services/dashboardService';

// Activity type to icon mapping
const activityIcons = {
  'quizAttempt': <FiBarChart2 className="text-rose-500" size={18} />,
  'testStarted': <FiBookOpen className="text-emerald-500" size={18} />,
  'testCompleted': <FiActivity className="text-blue-500" size={18} />,
  'default': <FiActivity className="text-gray-500" size={18} />
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

  // Navigation handlers
  const navigateToProfile = () => router.push('/dashboard/profile');
  const navigateToTestLibrary = () => router.push('/dashboard/test-library');
  const navigateToAiChatbot = () => router.push('/dashboard/ai-chatbot');
  const navigateToResources = () => router.push('/dashboard/resources');

  // Get activity icon
  const getActivityIcon = (activity) => {
    return activityIcons[activity.activityType] || activityIcons.default;
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
      {/* Header Section */}
      <DashboardHeader 
        userData={userData}
        streak={streak}
        authUser={authUser}
        onStartTest={navigateToTestLibrary}
        onViewProfile={navigateToProfile}
      />
      
      {/* Daily Streak Challenge */}
      <DailyQuestionSection
        streak={streak}
        dailyQuestion={dailyQuestion}
        selectedOption={selectedOption}
        handleOptionSelect={handleOptionSelect}
        handleSubmitAnswer={handleSubmitAnswer}
        submitting={submitting}
        error={error.question || error.streak}
      />
      
      {/* Learning Progress */}
      <DashboardCard title="Learning Progress">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard 
            title="Tests Taken" 
            value={userData?.activity?.testsTaken || 0}
            description="completed" 
            icon={<FiActivity className="text-blue-500" size={20} />}
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
                <TestRecommendationCard
                  key={index}
                  title={test.title}
                  category={test.category}
                  difficulty={test.difficulty}
                  recommendationType={test.recommendationType}
                  popularityScore={test.popularityScore}
                  onStartTest={navigateToTestLibrary}
                />
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
                  {activities.slice(0, visibleActivities).map((activity) => (
                    <ActivityItem
                      key={activity.id}
                      id={activity.id}
                      icon={getActivityIcon(activity)}
                      title={activity.description}
                      timestamp={activity.timestamp}
                    />
                  ))}
                </div>
              </TracingBeam>
              
              {/* Load more button */}
              {visibleActivities < activities.length && (
                <div className="pt-2 flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={loadMoreActivities}
                    rightIcon={<FiArrowRight size={14} />}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Load More
                  </Button>
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
        <QuickActionCard
          icon={<FiPlay size={20} />}
          iconColor="bg-blue-100 text-blue-600"
          title="Take Practice Test"
          description="Test your knowledge"
          onClick={navigateToTestLibrary}
        />
        
        <QuickActionCard
          icon={<FiMessageSquare size={20} />}
          iconColor="bg-purple-100 text-purple-600"
          title="Ask AI Assistant"
          description="Get study help"
          onClick={navigateToAiChatbot}
        />
        
        <QuickActionCard
          icon={<FiFileText size={20} />}
          iconColor="bg-green-100 text-green-600"
          title="Browse Resources"
          description="Study materials & guides"
          onClick={navigateToResources}
        />
      </div>
    </div>
  );
}

// Use the DashboardLayout for this page
Dashboard.getLayout = getLayout;
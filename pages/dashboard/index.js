import { useState, useEffect } from 'react';
import { IconCalendarStats, IconBook, IconCertificate, IconRocket, IconHistory } from '@tabler/icons-react';
import { getDashboardLayout } from '../../components/layouts/DashboardLayout';
import DashboardCard from '../../components/ui/DashboardCard';
import DailyQuizCard from '../../components/dashboard/DailyQuizCard';
import DailyQuizModal from '../../components/dashboard/DailyQuizModal';
import { getUserInfo, getDailyStreak, getTestRecommendations, getUserActivities } from '../../utils/services/dashboardService';
import { useAuth } from '../../contexts/AuthContext';
import { showError } from '../../utils/toast';
import Link from 'next/link';
import { useRouter } from 'next/router';

/**
 * Dashboard home page with redesigned UI based on the specifications
 */
export default function Dashboard() {
  const { user: authUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [streakData, setStreakData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showDailyQuiz, setShowDailyQuiz] = useState(false);
  
  // Format timestamp to human-readable date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Load initial dashboard data
  useEffect(() => {
    if (authUser) {
      fetchDashboardData();
    }
  }, [authUser]);
  
  // Function to fetch all dashboard data
  const fetchDashboardData = async () => {
    if (!authUser) return;
    
    setIsLoading(true);
    try {
      // Fetch data in parallel
      const [userResponse, streakResponse, recommendationsResponse, activitiesResponse] = 
        await Promise.all([
          getUserInfo(),
          getDailyStreak(),
          getTestRecommendations(10),
          getUserActivities()
        ]);
      
      // Update state with successful responses
      if (userResponse.success) {
        setUserData(userResponse.data);
      }
      
      if (streakResponse.success) {
        setStreakData(streakResponse.data);
      }
      
      if (recommendationsResponse.success) {
        setRecommendations(recommendationsResponse.data.recommendations || []);
      }
      
      if (activitiesResponse.success) {
        setActivities(activitiesResponse.data.activities || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showError('Failed to load some dashboard data. Please refresh the page to try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle start test action
  const handleStartTest = (testId) => {
    router.push(`/dashboard/tests/${testId}`);
  };

  // Toggle daily quiz modal
  const toggleDailyQuiz = () => {
    setShowDailyQuiz(!showDailyQuiz);
  };

  // Update streak data after daily quiz submission
  const handleQuizSubmit = (newStreakData) => {
    setStreakData(newStreakData);
    
    // Refresh activities to show the new streak activity
    refreshActivities();
  };
  
  // Refresh just the activities section
  const refreshActivities = async () => {
    try {
      const activitiesResponse = await getUserActivities();
      if (activitiesResponse.success) {
        setActivities(activitiesResponse.data.activities || []);
      }
    } catch (error) {
      console.error('Error refreshing activities:', error);
    }
  };

  return (
    <div className="py-6">
      {/* Page header */}
      <div className="mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      {/* Main content area */}
      <div className="mx-auto px-4 sm:px-6 md:px-8">
        {/* Loading state */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading your dashboard data...</p>
          </div>
        ) : (
          <div className="py-4">
            {/* User welcome section */}
            {userData && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                <h2 className="text-xl font-medium text-gray-900">
                  Welcome back, {userData.first_name || 'User'}!
                </h2>
                <p className="mt-1 text-gray-600">
                  You're preparing for: <span className="font-medium">{userData.certification_target || 'Cloud Certification'}</span>
                </p>
                {userData.preferences?.target_exam_date && (
                  <p className="mt-1 text-gray-600">
                    Target exam date: <span className="font-medium">{formatDate(userData.preferences.target_exam_date)}</span>
                  </p>
                )}
              </div>
            )}

            {/* Daily Quiz Card - Prominently featured */}
            <div className="mb-6">
              <DailyQuizCard 
                onStartQuiz={toggleDailyQuiz}
                streakData={streakData}
              />
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2 xl:grid-cols-3">
              {/* Study goal card */}
              <DashboardCard
                title="Daily Study Goal"
                value={userData?.preferences?.study_goal_minutes_per_day || 0}
                unit="min/day"
                icon={<IconCalendarStats className="h-12 w-12 text-blue-600" />}
              />

              {/* Current streak card */}
              <DashboardCard
                title="Current Streak"
                value={streakData?.current_streak || 0}
                unit="days"
                icon={<IconRocket className="h-12 w-12 text-orange-500" />}
              />

              {/* Tests completed card */}
              <DashboardCard
                title="Tests Completed"
                value={userData?.stats?.tests_completed || 0}
                icon={<IconCertificate className="h-12 w-12 text-green-600" />}
              />
            </div>

            {/* Two-column layout for recommendations and activity */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Test recommendations section - takes up 2/3 of the width on large screens */}
              <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Recommended Tests</h2>
                    <Link href="/dashboard/tests" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      View all
                    </Link>
                  </div>
                  
                  {recommendations.length > 0 ? (
                    <div className="space-y-4">
                      {recommendations.slice(0, 5).map((test) => (
                        <div key={test.test_id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <div className="mb-3 sm:mb-0">
                              <h3 className="font-medium text-gray-900">{test.title}</h3>
                              <div className="flex flex-wrap items-center mt-1 gap-2">
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                  {test.category}
                                </span>
                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                  {test.difficulty}
                                </span>
                                {test.recommendation_type && (
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    test.recommendation_type === 'popular' 
                                      ? 'bg-orange-100 text-orange-800' 
                                      : test.recommendation_type === 'personalized'
                                      ? 'bg-purple-100 text-purple-800'
                                      : 'bg-green-100 text-green-800'
                                  }`}>
                                    {test.recommendation_type.charAt(0).toUpperCase() + test.recommendation_type.slice(1)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleStartTest(test.test_id)}
                              className="w-full sm:w-auto px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              Start Test
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <IconBook className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No test recommendations available yet.</p>
                      <p className="text-gray-500 text-sm mt-1">
                        Complete more tests to get personalized recommendations.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity timeline section - takes up 1/3 of the width on large screens */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
                  </div>

                  {activities.length > 0 ? (
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div key={activity.id} className="relative pb-4">
                          {/* Timeline connector */}
                          <div className="absolute top-5 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></div>
                          
                          <div className="relative flex items-start space-x-3">
                            <div className="relative">
                              <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center ring-8 ring-white">
                                <IconHistory className="h-5 w-5 text-blue-500" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div>
                                <p className="text-sm text-gray-800">
                                  {activity.activity}
                                </p>
                                <p className="mt-0.5 text-xs text-gray-500">
                                  {formatDate(activity.timestamp)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <IconHistory className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No activities recorded yet.</p>
                      <p className="text-gray-500 text-sm mt-1">
                        Take tests or answer daily questions to track your progress.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Daily Quiz Modal */}
      {showDailyQuiz && (
        <DailyQuizModal 
          isOpen={showDailyQuiz} 
          onClose={toggleDailyQuiz}
          onSubmit={handleQuizSubmit}
        />
      )}
    </div>
  );
}

// Set the dashboard layout for this page
Dashboard.getLayout = (page) => getDashboardLayout(page, "Dashboard");
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  IconCalendarStats, 
  IconBook, 
  IconCertificate, 
  IconRocket,
  IconHistory, 
  IconChartBar, 
  IconRefresh, 
  IconBell, 
  IconSearch
} from '@tabler/icons-react';
import { getDashboardLayout } from '../../components/layouts/DashboardLayout';
import DashboardCard from '../../components/ui/DashboardCard';
import DailyQuizCard from '../../components/dashboard/DailyQuizCard';
import DailyQuizModal from '../../components/dashboard/DailyQuizModal';
import { useDashboardStats } from '../../hooks/useDashboard';
import { useAuth } from '../../contexts/AuthContext';
import useToast from '../../hooks/useToast';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getDashboardStats } from '../../lib/server/dashboardService';
import { getUserSession } from '../../lib/server/authService';

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 }
};

/**
 * Dashboard page with server-side rendering and React Query
 * Optimized to reduce client-side API calls
 */
export function Dashboard({
  initialUserData,
  initialStreakData,
  initialRecommendations,
  initialActivities
}) {
  const { user: authUser } = useAuth();
  const router = useRouter();
  const { success: showSuccess, error: showError } = useToast();
  const [showDailyQuiz, setShowDailyQuiz] = useState(false);
  const [activeTab, setActiveTab] = useState('recommended');
  
  // Use React Query for dashboard data with initial values from SSR
  const { 
    data: dashboardData,
    isLoading,
    isRefetching,
    refetch: refreshDashboardData
  } = useDashboardStats({
    initialData: {
      user: initialUserData,
      streak: initialStreakData,
      recommendations: initialRecommendations,
      activities: initialActivities
    }
  });

  // Extract data from query result
  const userData = dashboardData?.user;
  const streakData = dashboardData?.streak;
  const recommendations = dashboardData?.recommendations || [];
  const activities = dashboardData?.activities || [];
  
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
  
  // Handle refresh with animation
  const handleRefreshData = async () => {
    if (isRefetching) return;
    
    try {
      await refreshDashboardData();
      showSuccess('Dashboard data refreshed');
    } catch (error) {
      console.error('Error refreshing data:', error);
      showError('Failed to refresh dashboard data');
    }
  };
  
  const handleStartTest = (testId) => {
    router.push(`/dashboard/tests/${testId}`);
  };

  const toggleDailyQuiz = () => {
    setShowDailyQuiz(!showDailyQuiz);
  };

  const handleQuizSubmit = async (newStreakData) => {
    // After quiz submission, refresh the dashboard data
    try {
      await refreshDashboardData();
      showSuccess('Daily quiz completed!');
    } catch (error) {
      console.error('Error refreshing data after quiz:', error);
    }
    
    setShowDailyQuiz(false);
  };

  return (
    <div className="py-6">
      {/* Page header */}
      <div className="px-4 sm:px-6 md:px-8 mb-6 flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Your GCP certification progress at a glance
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <motion.button
            onClick={handleRefreshData}
            disabled={isLoading || isRefetching}
            className={`inline-flex items-center p-2 text-sm font-medium rounded-md 
              ${isRefetching 
                ? 'text-blue-400 bg-blue-50' 
                : 'text-gray-700 bg-white hover:bg-gray-50'
              } 
              border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconRefresh 
              className={`h-5 w-5 ${isRefetching ? 'animate-spin' : ''}`} 
              aria-hidden="true" 
            />
          </motion.button>
          <div className="relative inline-flex">
            <button 
              className="inline-flex items-center p-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <IconBell className="h-5 w-5" aria-hidden="true" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 text-xs font-bold text-white bg-red-500 rounded-full">
                3
              </span>
            </button>
          </div>
          <button className="inline-flex items-center p-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <IconSearch className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            <div className="bg-gray-100 h-48 rounded-lg"></div>
            <div className="bg-gray-100 h-48 rounded-lg"></div>
            <div className="bg-gray-100 h-48 rounded-lg"></div>
            <div className="bg-gray-100 h-64 md:col-span-2 rounded-lg"></div>
            <div className="bg-gray-100 h-64 rounded-lg"></div>
          </div>
        ) : (
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Stats cards */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={fadeIn}
            >
              <DashboardCard
                title="Practice Stats"
                icon={<IconCalendarStats className="h-6 w-6 text-blue-500" />}
                value={userData?.practice_tests_taken || 0}
                subtitle="Tests Completed"
                footerText={`${userData?.average_score || 0}% Average Score`}
                iconBg="bg-blue-100"
              />
              <DashboardCard
                title="Exam Readiness"
                icon={<IconCertificate className="h-6 w-6 text-green-500" />}
                value={`${userData?.exam_readiness || 0}%`}
                subtitle="GCP Professional Cloud Architect"
                footerText={userData?.readiness_status || 'Keep practicing'}
                iconBg="bg-green-100"
                progress={userData?.exam_readiness || 0}
              />
              <DailyQuizCard
                streak={streakData?.current_streak || 0}
                maxStreak={streakData?.max_streak || 0}
                lastQuizDate={streakData?.last_quiz_date}
                onStartQuiz={toggleDailyQuiz}
              />
            </motion.div>

            {/* Main content grid */}
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6"
              variants={fadeIn}
              transition={{ delay: 0.1 }}
            >
              {/* Test recommendations and insights column */}
              <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Your Tests</h2>
                    <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                      <button 
                        className={`px-3 py-1 text-xs font-medium ${activeTab === 'recommended' ? 'bg-blue-50 text-blue-700' : 'bg-white text-gray-700'}`}
                        onClick={() => setActiveTab('recommended')}
                      >
                        Recommended
                      </button>
                      <button 
                        className={`px-3 py-1 text-xs font-medium ${activeTab === 'popular' ? 'bg-blue-50 text-blue-700' : 'bg-white text-gray-700'}`}
                        onClick={() => setActiveTab('popular')}
                      >
                        Popular
                      </button>
                    </div>
                  </div>

                  <div className="mt-3">
                    {recommendations.length > 0 ? (
                      <div className="space-y-4">
                        {recommendations.map((test, index) => (
                          <motion.div 
                            key={test.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {test.title}
                              </h3>
                              <div className="mt-1 flex items-center text-xs text-gray-500">
                                <span className="truncate">
                                  {test.question_count} questions • {test.duration_mins} min • {test.topic}
                                </span>
                              </div>
                              <div className="mt-2 flex items-center">
                                <div className="flex-shrink-0">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    test.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                    test.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {test.difficulty}
                                  </span>
                                </div>
                                <div className="ml-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {test.completion_rate}% Completion Rate
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 sm:mt-0">
                              <motion.button
                                onClick={() => handleStartTest(test.id)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                              >
                                Start Test
                              </motion.button>
                            </div>
                          </motion.div>
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
              </div>

              {/* Activity timeline section */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
                    <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      Last 7 days
                    </div>
                  </div>

                  {activities.length > 0 ? (
                    <div className="space-y-4">
                      {activities.map((activity, index) => (
                        <motion.div 
                          key={activity.id} 
                          className="relative pb-4"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.2 }}
                        >
                          <div className="absolute top-5 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></div>
                          
                          <div className="relative flex items-start space-x-3">
                            <div className="relative">
                              <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center ring-8 ring-white">
                                <IconHistory className="h-5 w-5 text-blue-500" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div>
                                <p className="text-sm text-gray-800">{activity.activity}</p>
                                <p className="mt-0.5 text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
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
            </motion.div>
          </motion.div>
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

/**
 * Server-side data fetching for the dashboard page
 * This moves API calls to the server, reducing client-side network requests
 */
export async function getServerSideProps(context) {
  // Get the auth token from cookies
  const token = context.req.cookies.auth_token;
  
  // If no token is available, redirect to login
  if (!token) {
    return {
      redirect: {
        destination: '/login?returnUrl=/dashboard',
        permanent: false,
      }
    };
  }
  
  try {
    // Fetch user session and dashboard stats in parallel
    const [sessionResponse, statsResponse] = await Promise.all([
      getUserSession(token),
      getDashboardStats(token)
    ]);
    
    // Process responses
    const userData = sessionResponse.success ? sessionResponse.data.user : null;
    const dashboardStats = statsResponse.success ? statsResponse.data : {};
    
    // Return all data as props
    return {
      props: {
        initialUserData: userData,
        initialStreakData: dashboardStats.streak || null,
        initialRecommendations: dashboardStats.recommendations || [],
        initialActivities: dashboardStats.activities || []
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    
    // Return empty data with error flag
    return {
      props: {
        initialUserData: null,
        initialStreakData: null,
        initialRecommendations: [],
        initialActivities: [],
        error: 'Failed to load dashboard data'
      }
    };
  }
}

// Default export
export default Dashboard;

// Set the dashboard layout for this page
Dashboard.getLayout = (page) => getDashboardLayout(page, "Dashboard");

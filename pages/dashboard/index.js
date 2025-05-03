import { useState, useEffect } from 'react';
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
import { 
  getUserInfo, 
  getDailyStreak, 
  getTestRecommendations, 
  getUserActivities 
} from '../../utils/services/dashboardService';
import { useAuth } from '../../contexts/AuthContext';
import { showError, showSuccess } from '../../utils/toast';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 }
};

export default function Dashboard() {
  const { user: authUser } = useAuth();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [streakData, setStreakData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showDailyQuiz, setShowDailyQuiz] = useState(false);
  const [activeTab, setActiveTab] = useState('recommended');
  
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

  useEffect(() => {
    if (authUser) {
      fetchDashboardData();
    }
  }, [authUser]);
  
  const fetchDashboardData = async () => {
    if (!authUser) return;
    
    setIsLoading(true);
    try {
      const [userResponse, streakResponse, recommendationsResponse, activitiesResponse] = 
        await Promise.all([
          getUserInfo(),
          getDailyStreak(),
          getTestRecommendations(10),
          getUserActivities()
        ]);
      
      if (userResponse.success) setUserData(userResponse.data);
      if (streakResponse.success) setStreakData(streakResponse.data);
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
  
  // Handle refresh with animation
  const handleRefreshData = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    
    try {
      await fetchDashboardData();
      showSuccess('Dashboard data refreshed');
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const handleStartTest = (testId) => {
    router.push(`/dashboard/tests/${testId}`);
  };

  const toggleDailyQuiz = () => {
    setShowDailyQuiz(!showDailyQuiz);
  };

  const handleQuizSubmit = (newStreakData) => {
    setStreakData(newStreakData);
    refreshActivities();
  };
  
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
      {/* Page header
      <div className="mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        <div className="flex items-center space-x-3">
          <button 
            className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <IconBell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative hidden sm:block">
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5">
              <IconSearch className="h-4 w-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-transparent border-none text-sm focus:outline-none ml-2 w-28"
              />
            </div>
          </div>
          
          <button
            className={`p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
            onClick={handleRefreshData}
            disabled={isRefreshing || isLoading}
            aria-label="Refresh data"
          >
            <IconRefresh className="h-5 w-5" />
          </button>
        </div>
      </div> */}

      {/* Main content area */}
      <div className="mx-auto px-4 sm:px-6 md:px-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-r-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading your dashboard data...</p>
          </div>
        ) : (
          <motion.div 
            className="py-4 space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* User welcome section */}
            {userData && (
              <motion.div 
                className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm border border-gray-200"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
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
                  
                  <div className="mt-4 md:mt-0">
                    {/* <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      <IconChartBar className="h-4 w-4 mr-1.5" />
                      <span>Progress: {userData?.stats?.completion_rate || 0}%</span>
                    </div> */}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Daily Quiz Card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <DailyQuizCard onStartQuiz={toggleDailyQuiz} streakData={streakData} />
            </motion.div>

            {/* Stats Cards Grid */}
            <motion.div 
              className="grid grid-cols-1 gap-6 lg:grid-cols-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <DashboardCard
                title="Daily Study Goal"
                value={userData?.preferences?.study_goal_minutes_per_day || 0}
                unit="min/day"
                icon={<IconCalendarStats className="h-12 w-12 text-blue-600" />}
              />

              <DashboardCard
                title="Current Streak"
                value={streakData?.current_streak || 0}
                unit="days"
                icon={<IconRocket className="h-12 w-12 text-orange-500" />}
                trend={streakData?.streak_trend || 0}
                trendLabel={streakData?.streak_trend > 0 ? "More than last week" : "Less than last week"}
              />

              <DashboardCard
                title="Tests Completed"
                value={userData?.stats?.tests_completed || 0}
                icon={<IconCertificate className="h-12 w-12 text-green-600" />}
                subtitle={`${userData?.stats?.tests_passed || 0} passed`}
              />
            </motion.div>

            {/* Test recommendations and activity layout */}
            <motion.div 
              className="grid grid-cols-1 gap-6 lg:grid-cols-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              {/* Test recommendations section */}
              <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Recommended Tests</h2>
                    <Link href="/dashboard/tests" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors flex items-center">
                      View all
                      <span className="ml-1">→</span>
                    </Link>
                  </div>
                  
                  {/* Tab navigation */}
                  <div className="flex border-b border-gray-200 mb-4">
                    <button
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'recommended' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('recommended')}
                    >
                      Recommended
                    </button>
                    <button
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'popular' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('popular')}
                    >
                      Popular
                    </button>
                    <button
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'recent' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('recent')}
                    >
                      Recent
                    </button>
                  </div>
                  
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {recommendations.length > 0 ? (
                      <div className="space-y-4">
                        {recommendations.slice(0, 5).map((test, index) => (
                          <motion.div 
                            key={test.test_id} 
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.2 }}
                          >
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
                              <motion.button
                                onClick={() => handleStartTest(test.test_id)}
                                className="w-full sm:w-auto px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
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
                  </motion.div>
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

// Set the dashboard layout for this page
Dashboard.getLayout = (page) => getDashboardLayout(page, "Dashboard");

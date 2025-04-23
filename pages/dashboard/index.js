import { useState, useEffect } from 'react';
import { IconCloudComputing, IconBook, IconProgress, IconCalendarStats } from '@tabler/icons-react';
import { getDashboardLayout } from '../../components/layouts/DashboardLayout';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Section from '../../components/dashboard/Section';
import QuickActionCard from '../../components/dashboard/QuickActionCard';
import DailyQuestionSection from '../../components/dashboard/DailyQuestionSection';
import TestRecommendationCard from '../../components/dashboard/TestRecommendationCard';
import ActivityItem from '../../components/dashboard/ActivityItem';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import { getUserInfo, getDailyStreak, getDailyQuestion, getTestRecommendations, getUserActivities } from '../../utils/services/dashboardService';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Dashboard home page
 */
export default function Dashboard() {
  const { user: authUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [streakData, setStreakData] = useState(null);
  const [dailyQuestion, setDailyQuestion] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch user data
        const userResponse = await getUserInfo();
        if (userResponse.success) {
          setUserData(userResponse.data);
        }

        // Fetch streak data
        const streakResponse = await getDailyStreak();
        if (streakResponse.success) {
          setStreakData(streakResponse.data);
        }

        // Fetch daily question
        const questionResponse = await getDailyQuestion();
        if (questionResponse.success) {
          setDailyQuestion(questionResponse.data);
        }

        // Fetch test recommendations
        const recommendationsResponse = await getTestRecommendations();
        if (recommendationsResponse.success) {
          setRecommendations(recommendationsResponse.data.recommendations || []);
        }

        // Fetch user activities
        const activitiesResponse = await getUserActivities(10);
        if (activitiesResponse.success) {
          setActivities(activitiesResponse.data.activities || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (authUser) {
      fetchDashboardData();
    }
  }, [authUser]);

  const handleStartTest = (testId) => {
    // Navigate to test page
    window.location.href = `/dashboard/tests/${testId}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 relative">
      {/* Dashboard Header */}
      <DashboardHeader 
        userData={userData}
        streak={streakData}
        authUser={authUser}
        onStartTest={() => window.location.href = '/dashboard/tests'}
        onViewProfile={() => window.location.href = '/dashboard/profile'}
      />

      {/* Stats Section */}
      <Section 
        title="Your Stats"
        description="Track your progress in GCP certification preparation"
        className="mt-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Questions Answered"
            value={userData?.total_questions_answered || 0}
            description="total"
            icon={<IconBook size={24} className="text-blue-500" />}
          />
          <StatCard
            title="Practice Tests"
            value={userData?.tests_completed || 0}
            description="completed"
            icon={<IconProgress size={24} className="text-green-500" />}
          />
          <StatCard
            title="Study Streak"
            value={streakData?.current_streak || 0}
            description="days"
            icon={<IconCalendarStats size={24} className="text-amber-500" />}
            trend={
              <Badge variant="green" size="sm">
                {streakData?.longest_streak || 0} longest
              </Badge>
            }
          />
          <StatCard
            title="Average Score"
            value={`${userData?.average_score || 0}%`}
            description=""
            icon={<IconCloudComputing size={24} className="text-indigo-500" />}
          />
        </div>
      </Section>

      {/* Quick Actions Section */}
      <Section 
        title="Quick Actions"
        description="Jump right into your certification preparation"
        className="mt-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionCard
            title="Start Practice Test"
            description="Take a practice test to assess your knowledge"
            icon={<IconProgress size={24} />}
            iconColor="bg-blue-100 text-blue-600"
            onClick={() => window.location.href = '/dashboard/tests'}
          />
          <QuickActionCard
            title="Browse Resources"
            description="Access GCP training materials and guides"
            icon={<IconBook size={24} />}
            iconColor="bg-purple-100 text-purple-600"
            onClick={() => window.location.href = '/dashboard/resources'}
          />
          <QuickActionCard
            title="View Leaderboard"
            description="See how you rank against other learners"
            icon={<IconCalendarStats size={24} />}
            iconColor="bg-amber-100 text-amber-600"
            onClick={() => window.location.href = '/dashboard/leaderboard'}
          />
        </div>
      </Section>

      {/* Two Column Layout */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Daily Question Section */}
          {dailyQuestion && (
            <DailyQuestionSection 
              question={dailyQuestion}
              className="mb-8"
            />
          )}
          
          {/* Recommended Tests Section */}
          <Section 
            title="Recommended Tests"
            description="Based on your study progress and performance"
            className="mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((test, index) => (
                <TestRecommendationCard
                  key={test.id || index}
                  title={test.title}
                  category={test.category}
                  difficulty={test.difficulty}
                  recommendationType={test.recommendation_type}
                  popularityScore={test.popularity_score}
                  onStartTest={() => handleStartTest(test.id)}
                />
              ))}
              {recommendations.length === 0 && (
                <div className="col-span-2 p-6 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-500">No test recommendations available yet. Complete more tests to get personalized recommendations.</p>
                </div>
              )}
            </div>
          </Section>
        </div>

        {/* Activity Section */}
        <div className="lg:col-span-1">
          <Section
            title="Recent Activity"
            description="Your latest certification preparation activities"
            className="h-full"
          >
            <div className="space-y-4 h-full">
              {activities.map((activity, index) => (
                <ActivityItem
                  key={activity.id || index}
                  id={activity.id}
                  icon={activity.icon}
                  title={activity.title}
                  description={activity.description}
                  timestamp={activity.timestamp}
                />
              ))}
              {activities.length === 0 && (
                <div className="p-6 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-500">No activities recorded yet. Start answering questions or taking tests to track your progress!</p>
                </div>
              )}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

Dashboard.getLayout = getDashboardLayout;
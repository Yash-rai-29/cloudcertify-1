import { useState, useEffect } from 'react';
import { IconCloudComputing, IconBook, IconProgress, IconCalendarStats, IconRocket } from '@tabler/icons-react';
import { getDashboardLayout } from '../../components/layouts/DashboardLayout';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Section from '../../components/dashboard/Section';
import DailyQuestionSection from '../../components/dashboard/DailyQuestionSection';
import TestRecommendationCard from '../../components/dashboard/TestRecommendationCard';
import ActivityItem from '../../components/dashboard/ActivityItem';
import CTACard from '../../components/dashboard/CTACard';
import { getUserInfo, getDailyStreak, getDailyQuestion, getTestRecommendations, getUserActivities } from '../../utils/services/dashboardService';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Dashboard home page with redesigned UI based on the specifications
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
          setDailyQuestion(questionResponse.data.question);
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

  const handleProfileView = () => {
    // Sign out in this case (based on updated header)
    window.location.href = '/';
  };

  const handleContinueLearning = () => {
    // Navigate to the continue learning page
    window.location.href = '/dashboard/tests';
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Dashboard Header - Sticky at the top */}
      <DashboardHeader 
        userData={userData}
        streak={streakData}
        authUser={authUser}
        onStartTest={handleContinueLearning}
        onViewProfile={handleProfileView}
      />

      {/* Main content area with max width container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Grid layout with 3 columns on desktop, 1 column on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content area (2 columns wide) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Streak Challenge Section */}
            <DailyQuestionSection 
              question={dailyQuestion}
              streak={streakData}
            />
            
            {/* Recommended Tests Section */}
            <Section 
              title="Recommended Practice Tests"
              description="Prepare for your certification with these tests"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((test, index) => (
                  <TestRecommendationCard
                    key={test.id || index}
                    id={test.id}
                    title={test.title}
                    questions_count={test.questions_count}
                    duration_minutes={test.duration_minutes}
                    tag={test.tag}
                    onStartTest={handleStartTest}
                  />
                ))}
                {recommendations.length === 0 && (
                  <div className="col-span-2 p-6 bg-white rounded-lg text-center border border-gray-200">
                    <p className="text-gray-500">No test recommendations available yet. Complete more tests to get personalized recommendations.</p>
                  </div>
                )}
              </div>
            </Section>
            
            {/* CTA Card */}
            <CTACard 
              title="Ready to accelerate your GCP certification journey?"
              description="Take a practice test, use our AI chatbot, or explore our comprehensive resources to help you prepare for success."
              buttonText="Take Practice Test"
              onButtonClick={() => window.location.href = '/dashboard/tests'}
            />
          </div>
          
          {/* Sidebar content (1 column wide) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Activity Section */}
            <Section
              title="Recent Activity"
              description="Your latest learning activities"
            >
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {activities.length > 0 ? (
                  <div>
                    {activities.map((activity, index) => (
                      <ActivityItem
                        key={activity.id || index}
                        id={activity.id}
                        type={activity.type}
                        title={activity.title}
                        timestamp={activity.timestamp}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">No activities recorded yet. Start answering questions or taking tests to track your progress!</p>
                  </div>
                )}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

Dashboard.getLayout = getDashboardLayout;
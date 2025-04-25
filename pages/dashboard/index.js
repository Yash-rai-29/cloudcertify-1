import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { getDailyStreak, getRecentActivities, getRecommendedPracticeTests, trackUserActivity } from '../../utils/services/activityService';
import DailyQuestionSection from '../../components/dashboard/DailyQuestionSection';
import ActivityItem from '../../components/dashboard/ActivityItem';
import TestRecommendationCard from '../../components/dashboard/TestRecommendationCard';
import CTACard from '../../components/dashboard/CTACard';
import Section from '../../components/dashboard/Section';
import { showSuccess, showError } from '../../utils/toast';
import { getDashboardLayout } from '../../components/layouts/DashboardLayout';
import { FiPlus, FiChevronRight, FiMessageSquare } from 'react-icons/fi';

export default function Dashboard() {
  const [streak, setStreak] = useState({ current_streak: 0, longest_streak: 0 });
  const [activities, setActivities] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  // Fetch user streak
  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await getDailyStreak();
        if (response.success) {
          setStreak(response.data);
        }
      } catch (error) {
        console.error('Error fetching user streak:', error);
      }
    };

    if (user) {
      fetchStreak();
    }
  }, [user]);

  // Fetch recent activities
  useEffect(() => {
    const fetchActivities = async () => {
      setLoadingActivities(true);
      try {
        const response = await getRecentActivities(5);
        if (response.success) {
          setActivities(response.data.activities || []);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoadingActivities(false);
      }
    };

    if (user) {
      fetchActivities();
    }
  }, [user]);

  // Fetch test recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoadingRecommendations(true);
      try {
        const response = await getRecommendedPracticeTests();
        if (response.success) {
          setRecommendations(response.data.recommendations || []);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  // Handle starting a test
  const handleStartTest = (testId) => {
    trackUserActivity('start_test', { test_id: testId });
    showSuccess('Starting test...');
    router.push(`/dashboard/tests/${testId}`);
  };

  // Handle chat assistant click
  const handleChatAssistant = () => {
    trackUserActivity('open_chat_assistant');
    router.push('/dashboard/chat');
  };

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Daily Challenge and Recent Activity */}
        <div className="lg:col-span-2">
          {/* Daily Streak Challenge */}
          <DailyQuestionSection 
            streak={streak} 
            onStreakUpdate={setStreak}
          />
          
          {/* Recent Activity */}
          <Section
            title="Recent Activity"
            description="Your latest test attempts, resource views, and other activity."
            headerContent={
              <Link href="/dashboard/history" 
                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
                onClick={() => trackUserActivity('view_all_activities')}
              >
                View All
                <FiChevronRight className="ml-1" size={16} />
              </Link>
            }
          >
            <div>
              {loadingActivities ? (
                // Skeleton loader for activities
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="mb-3">
                    <div className="animate-pulse flex p-4 border rounded-lg">
                      <div className="rounded-full bg-gray-200 h-10 w-10 mr-3"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : activities.length > 0 ? (
                activities.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    id={activity.id}
                    type={activity.type}
                    title={activity.title}
                    timestamp={activity.timestamp}
                  />
                ))
              ) : (
                <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-gray-500">No recent activity yet.</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Start taking tests or reviewing resources to see your activity here.
                  </p>
                </div>
              )}
            </div>
          </Section>
        </div>

        {/* Right Column - Recommendations and CTA */}
        <div>
          {/* Recommended Practice Tests */}
          <Section
            title="Recommended Practice Tests"
            description="Based on your progress and certification goals."
            headerContent={
              <Link href="/dashboard/tests" 
                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
                onClick={() => trackUserActivity('view_all_tests')}
              >
                All Tests
                <FiChevronRight className="ml-1" size={16} />
              </Link>
            }
          >
            {loadingRecommendations ? (
              // Skeleton loader for test recommendations
              Array(2).fill(0).map((_, i) => (
                <div key={i} className="mb-4">
                  <div className="animate-pulse border rounded-lg p-5">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="flex mb-4">
                      <div className="h-4 bg-gray-200 rounded w-24 mr-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))
            ) : recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map((test) => (
                  <TestRecommendationCard
                    key={test.id}
                    id={test.id}
                    title={test.title}
                    questions_count={test.questions_count}
                    duration_minutes={test.duration_minutes}
                    tag={test.tag}
                    onStartTest={handleStartTest}
                  />
                ))}
                <Link href="/dashboard/tests" 
                  className="block text-center py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors"
                  onClick={() => trackUserActivity('view_more_tests')}
                >
                  <FiPlus className="inline-block mr-1" />
                  <span>View more tests</span>
                </Link>
              </div>
            ) : (
              <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-gray-500">No recommendations yet.</p>
                <p className="text-gray-500 text-sm mt-1">
                  Update your profile to get personalized test recommendations.
                </p>
              </div>
            )}
          </Section>

          {/* Call-to-Action Section */}
          <Section>
            <CTACard
              title="Need Help with a Concept?"
              description="Use our AI chatbot to get instant answers to your Google Cloud certification questions."
              buttonText="Chat with Assistant"
              onButtonClick={handleChatAssistant}
            />
          </Section>
        </div>
      </div>
    </div>
  );
}

// Set the dashboard layout for this page with title parameter
Dashboard.getLayout = (page) => getDashboardLayout(page, 'Dashboard');
import { useState, useEffect } from 'react';
import { IconTrophy, IconCrown, IconMedal, IconUserCircle } from '@tabler/icons-react';
import { getDashboardLayout } from '../../components/layouts/DashboardLayout';
import Section from '../../components/dashboard/Section';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getLeaderboard } from '../../utils/services/dashboardService';
import Avatar from '../../components/ui/Avatar';

/**
 * Leaderboard page
 */
export default function Leaderboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRanking, setUserRanking] = useState(null);
  const [timeFrame, setTimeFrame] = useState('week');
  const [error, setError] = useState(null);

  // Define fetchLeaderboardData outside of useEffect to reuse it
  const fetchLeaderboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch leaderboard data
      const response = await getLeaderboard(20);
      
      if (response.success) {
        // Extract data from response
        const { rankings = [], user_rank = null } = response.data || {};
        
        setLeaderboardData(rankings);
        setUserRanking(user_rank);
      } else {
        console.error('Failed to fetch leaderboard:', response.message);
        setError('Unable to load leaderboard data. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      setError('An error occurred while fetching leaderboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, [timeFrame]);

  const handleTimeFrameChange = (newTimeFrame) => {
    setTimeFrame(newTimeFrame);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* Page Header */}
      <div className="py-6 md:py-8 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
            <p className="mt-1 text-sm text-gray-500">See how you rank against other learners preparing for GCP certifications</p>
          </div>
        </div>
      </div>

      {/* Time Frame Selector */}
      <div className="mt-8 mb-6">
        <div className="flex justify-center space-x-4">
          <Button 
            variant={timeFrame === 'weekly' ? 'primary' : 'secondary'}
            onClick={() => handleTimeFrameChange('weekly')}
          >
            Weekly
          </Button>
          <Button 
            variant={timeFrame === 'monthly' ? 'primary' : 'secondary'}
            onClick={() => handleTimeFrameChange('monthly')}
          >
            Monthly
          </Button>
          <Button 
            variant={timeFrame === 'allTime' ? 'primary' : 'secondary'}
            onClick={() => handleTimeFrameChange('allTime')}
          >
            All Time
          </Button>
        </div>
      </div>

      {/* User Ranking Card */}
      {userRanking && (
        <Section 
          title="Your Ranking"
          description={`Your position on the ${timeFrame === 'weekly' ? 'weekly' : timeFrame === 'monthly' ? 'monthly' : 'all-time'} leaderboard`}
          className="mt-8"
        >
          <div className="bg-white border border-blue-100 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Avatar 
                  src={userRanking.avatar_url}
                  initials={`${userRanking.first_name?.[0] || ''}${userRanking.last_name?.[0] || ''}`}
                  size="lg"
                />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {userRanking.first_name} {userRanking.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {userRanking.certification_target || 'GCP Certification'}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">#{userRanking.rank}</div>
                    <p className="text-sm text-gray-500">Your Rank</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{userRanking.points}</div>
                    <p className="text-xs text-gray-500">Points</p>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{userRanking.tests_completed}</div>
                    <p className="text-xs text-gray-500">Tests</p>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{userRanking.streak_days}</div>
                    <p className="text-xs text-gray-500">Day Streak</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* Top 3 Leaderboard */}
      <Section 
        title="Top Performers"
        description={`Leading performers for ${timeFrame === 'weekly' ? 'this week' : timeFrame === 'monthly' ? 'this month' : 'all time'}`}
        className="mt-8"
      >
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <div className="text-red-500 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Unable to load leaderboard</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <div className="mt-4">
              <Button 
                variant="primary" 
                onClick={() => {
                  setIsLoading(true);
                  fetchLeaderboardData();
                }}
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leaderboardData.slice(0, 3).map((user, index) => (
              <div 
                key={user.id}
                className={`
                  bg-white border rounded-lg p-6 text-center
                  ${index === 0 ? 'border-yellow-200 shadow-md order-2 md:order-1 md:-mt-4' : ''}
                  ${index === 1 ? 'border-gray-200 order-1 md:order-0' : ''}
                  ${index === 2 ? 'border-amber-200 order-3 md:order-2' : ''}
                `}
              >
                <div className="flex justify-center">
                  {index === 0 && (
                    <div className="absolute -top-4 bg-yellow-400 rounded-full p-2">
                      <IconCrown size={24} className="text-white" />
                    </div>
                  )}
                  <Avatar 
                    src={user.avatar_url}
                    initials={`${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`}
                    size="xl"
                    className={`
                      ${index === 0 ? 'ring-4 ring-yellow-200' : ''}
                      ${index === 1 ? 'ring-4 ring-gray-200' : ''}
                      ${index === 2 ? 'ring-4 ring-amber-200' : ''}
                    `}
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user.first_name} {user.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {user.certification_target || 'GCP Certification'}
                  </p>
                </div>
                <div className="mt-2">
                  <div className="flex justify-center">
                    {index === 0 && (
                      <Badge variant="amber" leftIcon={<IconTrophy size={14} />}>
                        1st Place
                      </Badge>
                    )}
                    {index === 1 && (
                      <Badge variant="blue" leftIcon={<IconMedal size={14} />}>
                        2nd Place
                      </Badge>
                    )}
                    {index === 2 && (
                      <Badge variant="purple" leftIcon={<IconMedal size={14} />}>
                        3rd Place
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="mt-4 text-2xl font-bold text-blue-600">
                  {user.points} pts
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-center">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{user.tests_completed}</div>
                    <p className="text-xs text-gray-500">Tests</p>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{user.streak_days}</div>
                    <p className="text-xs text-gray-500">Streak</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Full Leaderboard */}
      <Section 
        title="Full Leaderboard"
        description={`All participants ranked by performance`}
        className="mt-8"
      >
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <div className="text-red-500 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Unable to load leaderboard data</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Certification
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tests
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Streak
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaderboardData.length > 0 ? (
                    leaderboardData.map((user, index) => (
                      <tr 
                        key={user.id}
                        className={`
                          hover:bg-gray-50
                          ${user.id === userRanking?.id ? 'bg-blue-50' : ''}
                        `}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <Avatar 
                                src={user.avatar_url}
                                initials={`${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`}
                                size="md"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.first_name} {user.last_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.id === userRanking?.id && (
                                  <Badge variant="blue" size="sm">You</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.certification_target || 'GCP Certification'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">{user.points}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.tests_completed}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.streak_days} days
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-500">
                        No leaderboard data available for this time period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}

Leaderboard.getLayout = getDashboardLayout;
import { useState } from 'react';
import { 
  IconTrophy, IconCrown, IconMedal, IconUserCircle 
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from './Section';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import { getLeaderboard } from '../../lib/client/dashboardService';

/**
 * Enhanced Leaderboard with animations
 * Client-side only component to prevent document not defined errors
 */
export default function LeaderboardContent({ initialLeaderboard, initialUserRanking, initialError }) {
  const [isLoading, setIsLoading] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState(initialLeaderboard || []);
  const [userRanking, setUserRanking] = useState(initialUserRanking || null);
  const [error, setError] = useState(initialError || null);

  // Define fetchLeaderboardData outside of useEffect to reuse it
  const fetchLeaderboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getLeaderboard(20);
      
      if (response.success) {
        const { user_ranking = null, leaderboard = [] } = response.data || {};
        
        setLeaderboardData(leaderboard);
        setUserRanking(user_ranking);
      } else {
        console.error('Failed to fetch leaderboard:', response.error?.message);
        setError('Unable to load leaderboard data. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      setError('An error occurred while fetching leaderboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* Page Header with animation */}
      <motion.div 
        className="py-6 md:py-8 border-b border-gray-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
            <p className="mt-1 text-sm text-gray-700">
              See how you rank against other learners preparing for GCP certifications
            </p>
          </div>
          {!isLoading && (
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLeaderboardData}
              className="mt-4 md:mt-0"
            >
              Refresh Data
            </Button>
          )}
        </div>
      </motion.div>

      {/* User Ranking Card with animations */}
      <AnimatePresence>
        {userRanking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Section 
              title="Your Ranking"
              description="Your position on the leaderboard"
              className="mt-8 relative"
            >
              <motion.div 
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-6 shadow-lg relative overflow-hidden"
                whileHover={{ boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)" }}
              >
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 20, 
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <IconTrophy size={160} className="text-blue-600" />
                  </motion.div>
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  {/* User info and rank */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {userRanking.photo_url ? (
                        <div className="h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden border-2 border-blue-200">
                          <img 
                            src={userRanking.photo_url} 
                            alt="Your profile" 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <Avatar 
                          initials={userRanking.name?.charAt(0) || userRanking.email?.charAt(0) || 'U'} 
                          size="xl"
                          className="border-2 border-blue-200"
                        />
                      )}
                      
                      {/* Badge for top ranks */}
                      {userRanking.rank <= 3 && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-500 h-8 w-8 rounded-full flex items-center justify-center shadow-md ring-2 ring-white">
                          {userRanking.rank === 1 && (
                            <IconCrown size={18} className="text-white" />
                          )}
                          {userRanking.rank === 2 && (
                            <IconMedal size={18} className="text-white" />
                          )}
                          {userRanking.rank === 3 && (
                            <IconTrophy size={18} className="text-white" />
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{userRanking.name || 'You'}</h3>
                      <p className="text-sm text-gray-600">{userRanking.email}</p>
                      <div className="mt-2 flex items-center">
                        <Badge className="bg-blue-100 text-blue-800">
                          Rank #{userRanking.rank}
                        </Badge>
                        
                        <Badge className="ml-2 bg-blue-100 text-blue-800">
                          Top {Math.round((userRanking.rank / userRanking.total_users) * 100)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats display */}
                  <div className="grid grid-cols-3 gap-4 bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Score</p>
                      <p className="text-lg font-bold text-blue-600">{userRanking.avg_score.toFixed(1)}</p>
                    </div>
                    
                    <div className="text-center border-x border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Tests</p>
                      <p className="text-lg font-bold text-blue-600">{userRanking.tests_taken}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Pass Rate</p>
                      <p className="text-lg font-bold text-blue-600">{(userRanking.pass_rate * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      {isLoading ? (
        <div className="h-80 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Loading leaderboard...</p>
          </div>
        </div>
      ) : error ? (
        <motion.div 
          className="my-8 bg-red-50 border border-red-200 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Leaderboard</h3>
          <p className="text-red-700">{error}</p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={fetchLeaderboardData}
          >
            Try Again
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Section
            title="GCP Certification Leaderboard"
            description="Top performers based on test scores and completion rates"
            className="mt-8"
          >
            <motion.div className="bg-white overflow-hidden shadow-md rounded-lg">
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
                        Avg. Score
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tests Taken
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pass Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <AnimatePresence>
                      {leaderboardData.length > 0 ? (
                        leaderboardData.map((user, index) => (
                          <motion.tr 
                            key={user.id || index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className={user.is_current_user ? 'bg-blue-50' : 'hover:bg-gray-50'}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-900">
                                  {user.rank}
                                </span>
                                <div className="ml-2">
                                  {user.rank === 1 && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: 0.2 + index * 0.05, type: 'spring' }}
                                    >
                                      <IconCrown size={18} className="text-yellow-500" />
                                    </motion.div>
                                  )}
                                  {user.rank === 2 && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: 0.2 + index * 0.05, type: 'spring' }}
                                    >
                                      <IconMedal size={18} className="text-gray-400" />
                                    </motion.div>
                                  )}
                                  {user.rank === 3 && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: 0.2 + index * 0.05, type: 'spring' }}
                                    >
                                      <IconMedal size={18} className="text-amber-700" />
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 relative">
                                  {user.photo_url ? (
                                    <img 
                                      className="h-10 w-10 rounded-full" 
                                      src={user.photo_url} 
                                      alt="" 
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                      <IconUserCircle size={24} className="text-blue-600" />
                                    </div>
                                  )}
                                  {user.is_current_user && (
                                    <div className="absolute -top-1 -right-1 bg-blue-500 h-4 w-4 rounded-full border-2 border-white"></div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 flex items-center">
                                    {user.name || 'Anonymous User'}
                                    {user.is_current_user && (
                                      <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs">You</Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-500 truncate max-w-xs">
                                    {user.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {user.certification_target || 'GCP Certification'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-bold text-gray-900">{user.avg_score.toFixed(1)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {user.tests_taken}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${user.pass_rate >= 0.8 ? 'bg-green-100 text-green-800' : ''}
                                ${user.pass_rate >= 0.6 && user.pass_rate < 0.8 ? 'bg-blue-100 text-blue-800' : ''}
                                ${user.pass_rate < 0.6 ? 'bg-gray-100 text-gray-800' : ''}
                              `}>
                                {(user.pass_rate * 100).toFixed(0)}%
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-700">
                            <div className="flex flex-col items-center justify-center py-6">
                              <p>No leaderboard data available.</p>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </Section>
        </motion.div>
      )}
    </div>
  );
}

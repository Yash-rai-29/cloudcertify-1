import { useState } from 'react';
import { 
  IconTrophy, IconCrown, IconMedal, IconUserCircle 
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDashboardLayout } from '../../components/layouts/DashboardLayout';
import Section from '../../components/dashboard/Section';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import { getLeaderboard } from '../../lib/client/dashboardService';
import { getLeaderboard as getServerLeaderboard } from '../../lib/server/dashboardService';

/**
 * Enhanced Leaderboard with Aceternity UI
 * Using server-side rendering for initial data load
 */
export function Leaderboard({ initialLeaderboard, initialUserRanking, initialError }) {
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
                      repeatType: "loop"
                    }}
                  >
                    <IconTrophy size={160} />
                  </motion.div>
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center">
                  <div className="flex-shrink-0">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Avatar 
                        initials="ME"
                        size="xl"
                        className="ring-4 ring-white shadow-lg"
                      />
                    </motion.div>
                  </div>
                  <div className="ml-0 md:ml-6 mt-4 md:mt-0 flex-1 relative">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Your Performance
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          GCP Certification Prep
                        </p>
                      </div>
                      <motion.div 
                        className="text-center mt-4 md:mt-0 bg-white py-3 px-6 rounded-lg shadow-sm"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 300, 
                          delay: 0.3 
                        }}
                      >
                        <div className="text-4xl font-bold text-blue-600">#{userRanking.rank}</div>
                        <p className="text-sm text-gray-700">Your Rank</p>
                      </motion.div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <motion.div 
                        className="bg-white p-4 rounded-lg shadow-sm"
                        whileHover={{ y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <motion.div 
                          className="text-xl font-semibold text-gray-900"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          {userRanking.avg_score.toFixed(2)}
                        </motion.div>
                        <p className="text-xs text-gray-700 flex items-center justify-center mt-1">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                          Avg Score
                        </p>
                      </motion.div>
                      <motion.div 
                        className="bg-white p-4 rounded-lg shadow-sm"
                        whileHover={{ y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <motion.div 
                          className="text-xl font-semibold text-gray-900"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          {userRanking.tests_taken}
                        </motion.div>
                        <p className="text-xs text-gray-700 flex items-center justify-center mt-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                          Tests Taken
                        </p>
                      </motion.div>
                      <motion.div 
                        className="bg-white p-4 rounded-lg shadow-sm"
                        whileHover={{ y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <motion.div 
                          className="text-xl font-semibold text-gray-900"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          {(userRanking.percentile).toFixed(0)}%
                        </motion.div>
                        <p className="text-xs text-gray-700 flex items-center justify-center mt-1">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-1"></span>
                          Percentile
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top 3 Leaderboard with enhanced animations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Section 
          title="Top Performers"
          description="Leading performers in GCP certifications"
          className="mt-8"
        >
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <motion.div 
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear" 
                }}
                className="rounded-full h-16 w-16 border-b-4 border-r-4 border-blue-500"
              />
            </div>
          ) : error ? (
            <motion.div 
              className="py-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="text-red-500 mb-2"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotateZ: [0, 5, 0, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </motion.div>
              <h3 className="text-lg font-medium text-gray-900">Unable to load leaderboard</h3>
              <p className="mt-1 text-sm text-gray-700">{error}</p>
              <motion.div 
                className="mt-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="primary" 
                  onClick={() => {
                    setIsLoading(true);
                    fetchLeaderboardData();
                  }}
                >
                  Try Again
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
              {leaderboardData.slice(0, 3).map((user, index) => {
                const delay = 0.1 + (index * 0.1);
                const isFirst = index === 0;
                const isSecond = index === 1;
                const isThird = index === 2;
                
                return (
                  <motion.div 
                    key={user.uid}
                    className={`
                      rounded-lg p-6 text-center relative overflow-hidden
                      ${isFirst ? 'bg-gradient-to-b from-yellow-50 to-yellow-100 border-2 border-yellow-200 shadow-lg order-2 md:order-1 md:-mt-4 md:-mb-2' : ''}
                      ${isSecond ? 'bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 order-1 md:order-0' : ''}
                      ${isThird ? 'bg-gradient-to-b from-amber-50 to-amber-100 border border-amber-200 order-3 md:order-2' : ''}
                    `}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay }}
                    whileHover={{ 
                      y: -5,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    {/* Trophy animation for 1st place */}
                    {isFirst && (
                      <motion.div 
                        className="absolute top-2 right-2 text-yellow-400"
                        animate={{ 
                          rotate: [0, 10, 0, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 5,
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                      >
                        <IconTrophy size={28} />
                      </motion.div>
                    )}
                    
                    <div className="flex justify-center relative mb-2">
                      {isFirst && (
                        <motion.div 
                          className="absolute -top-4 z-10 bg-yellow-300 rounded-full p-2 shadow-lg"
                          initial={{ scale: 0 }}
                          animate={{ 
                            scale: 1, 
                            rotate: [0, 15, 0, -15, 0],
                            y: [0, -5, 0]
                          }}
                          transition={{ 
                            scale: { type: "spring", stiffness: 400, delay: 0.4 },
                            rotate: { duration: 2, repeat: Infinity, repeatType: "loop", delay: 1 },
                            y: { duration: 1.5, repeat: Infinity, repeatType: "loop", delay: 0.5 }
                          }}
                        >
                          <IconCrown size={24} className="text-white" />
                        </motion.div>
                      )}
                      
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Avatar 
                          initials={user.full_name?.substring(0,2) || 'GC'}
                          size="xl"
                          className={`
                            ${isFirst ? 'ring-4 ring-yellow-300 shadow-yellow-200' : ''}
                            ${isSecond ? 'ring-4 ring-gray-400 shadow-gray-400' : ''}
                            ${isThird ? 'ring-4 ring-amber-600 shadow-amber-600' : ''}
                          `}
                        />
                      </motion.div>
                    </div>
                    
                    <motion.div 
                      className="mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: delay + 0.2 }}
                    >
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user.full_name}
                      </h3>
                      <p className="text-sm text-gray-700">
                        {user.certification_target || 'GCP Certification'}
                      </p>
                    </motion.div>
                    
                    <motion.div 
                      className="mt-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, delay: delay + 0.3 }}
                    >
                      <div className="flex justify-center">
                        {isFirst && (
                          <Badge 
                            variant="amber" 
                            leftIcon={
                              <motion.div
                                animate={{ rotate: [0, 10, 0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <IconTrophy size={14} />
                              </motion.div>
                            }
                          >
                            1st Place
                          </Badge>
                        )}
                        {isSecond && (
                          <Badge 
                            variant="blue" 
                            leftIcon={
                              <motion.div
                                animate={{ y: [0, -2, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <IconMedal size={14} />
                              </motion.div>
                            }
                          >
                            2nd Place
                          </Badge>
                        )}
                        {isThird && (
                          <Badge 
                            variant="purple" 
                            leftIcon={
                              <motion.div
                                animate={{ y: [0, -2, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <IconMedal size={14} />
                              </motion.div>
                            }
                          >
                            3rd Place
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="mt-4 text-2xl font-bold text-blue-600"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: delay + 0.4 }}
                    >
                      {user.avg_score.toFixed(1)} avg
                    </motion.div>
                    
                    <motion.div 
                      className="mt-4 grid grid-cols-2 gap-2 text-center bg-white rounded-lg p-3 shadow-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: delay + 0.5 }}
                    >
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{user.tests_taken}</div>
                        <p className="text-xs text-gray-700">Tests</p>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{(user.pass_rate * 100).toFixed(0)}%</div>
                        <p className="text-xs text-gray-700">Pass Rate</p>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Section>
      </motion.div>

      {/* Full Leaderboard with animations - Change column removed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Section 
          title="Full Leaderboard"
          description="All participants ranked by performance"
          className="mt-8"
        >
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear" 
                }}
                className="rounded-full h-12 w-12 border-b-2 border-r-2 border-blue-500"
              />
            </div>
          ) : error ? (
            <motion.div 
              className="py-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-red-500 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Unable to load leaderboard data</h3>
              <p className="mt-1 text-sm text-gray-700">{error}</p>
            </motion.div>
          ) : (
            <motion.div 
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Rank
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Certification
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Avg Score
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Tests
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Pass Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {leaderboardData.length > 0 ? (
                        leaderboardData.map((user, index) => (
                          <motion.tr 
                            key={user.uid}
                            className={`
                              relative border-b border-gray-100
                              ${user.uid === userRanking?.uid ? 'bg-blue-50' : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}
                              ${user.rank <= 3 ? 'font-medium' : ''}
                            `}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.05 * index }}
                            // whileHover={{ 
                            //   backgroundColor: user.uid === userRanking?.uid ? 'rgba(219, 234, 254, 0.8)' : 'rgba(249, 250, 251, 0.8)',
                            //   scale: 1.01,
                            // }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className={`text-sm font-medium
                                  ${user.rank === 1 ? 'text-yellow-500' : ''}
                                  ${user.rank === 2 ? 'text-gray-700' : ''}
                                  ${user.rank === 3 ? 'text-amber-600' : ''}
                                  ${user.rank > 3 ? 'text-gray-900' : ''}
                                `}>
                                  {user.rank}
                                </span>
                                
                                {/* Rank 1-3 icons */}
                                {user.rank === 1 && (
                                  <motion.div 
                                    className="ml-2 text-yellow-400"
                                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  >
                                    <IconCrown size={16} />
                                  </motion.div>
                                )}
                                {user.rank === 2 && (
                                  <motion.div 
                                    className="ml-2 text-gray-400"
                                    animate={{ y: [0, -2, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                  >
                                    <IconMedal size={16} />
                                  </motion.div>
                                )}
                                {user.rank === 3 && (
                                  <motion.div 
                                    className="ml-2 text-amber-600"
                                    animate={{ y: [0, -2, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                  >
                                    <IconMedal size={16} />
                                  </motion.div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <motion.div
                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                  >
                                    <Avatar 
                                      initials={user.full_name?.substring(0,2) || 'GC'}
                                      size="md"
                                      className={`
                                        ${user.rank === 1 ? 'ring-2 ring-yellow-300' : ''}
                                        ${user.rank === 2 ? 'ring-2 ring-gray-300' : ''}
                                        ${user.rank === 3 ? 'ring-2 ring-amber-600' : ''}
                                      `}
                                    />
                                  </motion.div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 flex items-center">
                                    {user.full_name}
                                    {userRanking?.uid === user.uid && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                        className="ml-2"
                                      >
                                        <Badge variant="blue" size="sm">You</Badge>
                                      </motion.div>
                                    )}
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
          )}
        </Section>
      </motion.div>
    </div>
  );
}

// Default export with SSR data fetching
export default Leaderboard;

/**
 * Server-side data fetching for the leaderboard page
 * This moves API calls to the server, reducing client-side network requests
 */
export async function getServerSideProps(context) {
  // Get the auth token from cookies
  const token = context.req.cookies.auth_token;
  
  // If no token is available, redirect to login
  if (!token) {
    return {
      redirect: {
        destination: '/login?returnUrl=/dashboard/leaderboard',
        permanent: false,
      }
    };
  }
  
  try {
    // Fetch leaderboard data server-side
    const response = await getServerLeaderboard(token, 20);
    
    if (!response.success) {
      // Handle error case
      return {
        props: {
          initialLeaderboard: [],
          initialUserRanking: null,
          initialError: response.error.message || 'Failed to load leaderboard data'
        }
      };
    }
    
    // Extract data from response
    const { user_ranking = null, leaderboard = [] } = response.data || {};
    
    // Return the leaderboard data as props
    return {
      props: {
        initialLeaderboard: leaderboard,
        initialUserRanking: user_ranking,
        initialError: null
      }
    };
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return {
      props: {
        initialLeaderboard: [],
        initialUserRanking: null,
        initialError: 'An unexpected error occurred while loading the leaderboard'
      }
    };
  }
}

Leaderboard.getLayout = (page) => getDashboardLayout(page, "Leaderboard");

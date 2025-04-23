import { motion } from 'framer-motion';
import { FiArrowUp, FiCalendar, FiFire, FiClock, FiAward, FiUser, FiTarget } from 'react-icons/fi';

const StreakChallenge = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Certification Streak Challenge
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Stay motivated and consistent with daily study goals, track your progress, and compete with peers
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Streak Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-1 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl overflow-hidden text-white shadow-xl"
          >
            <div className="p-8">
              <div className="flex items-center mb-6">
                <FiFire className="text-4xl mr-4" />
                <div>
                  <h3 className="text-2xl font-bold">Your Current Streak</h3>
                  <p className="text-orange-100">Keep it going!</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-1">14</div>
                  <div className="text-sm text-orange-100">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold mb-1">21</div>
                  <div className="text-sm text-orange-100">Highest</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-lg font-bold mb-1">
                    <FiArrowUp className="mr-1" />
                    <span>3</span>
                  </div>
                  <div className="text-sm text-orange-100">Rank Up</div>
                </div>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-xl p-6 mb-8">
                <h4 className="text-lg font-semibold mb-3">Daily Targets</h4>
                <div className="space-y-4">
                  {[
                    { icon: FiClock, title: 'Study Time', value: '30 min', complete: true },
                    { icon: FiTarget, title: 'Questions', value: '20 questions', complete: true },
                    { icon: FiAward, title: 'Accuracy', value: '> 70%', complete: false }
                  ].map((target, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full ${target.complete ? 'bg-green-500' : 'bg-orange-300'} flex items-center justify-center mr-3`}>
                        <target.icon />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">{target.title}</span>
                          <span>{target.value}</span>
                        </div>
                        <div className="w-full bg-white bg-opacity-20 h-1.5 rounded-full mt-1">
                          <div 
                            className="bg-white h-1.5 rounded-full" 
                            style={{ width: target.complete ? '100%' : '60%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-orange-600 px-6 py-3 rounded-lg font-medium shadow-lg hover:bg-orange-50 transition-all"
                >
                  Start Today's Challenge
                </motion.button>
              </div>
            </div>
          </motion.div>
          
          {/* Calendar & Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="border-b border-gray-100 px-6 py-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">April 2025</h3>
                <div className="flex space-x-2">
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {/* Calendar Grid */}
              <div className="mb-8">
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <div key={index} className="text-center text-gray-500 text-sm font-medium">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {[
                    { day: 1, status: 'completed' },
                    { day: 2, status: 'completed' },
                    { day: 3, status: 'completed' },
                    { day: 4, status: 'missed' },
                    { day: 5, status: 'completed' },
                    { day: 6, status: 'completed' },
                    { day: 7, status: 'completed' },
                    { day: 8, status: 'completed' },
                    { day: 9, status: 'completed' },
                    { day: 10, status: 'completed' },
                    { day: 11, status: 'completed' },
                    { day: 12, status: 'completed' },
                    { day: 13, status: 'completed' },
                    { day: 14, status: 'completed' },
                    { day: 15, status: 'completed' },
                    { day: 16, status: 'completed' },
                    { day: 17, status: 'completed' },
                    { day: 18, status: 'completed' },
                    { day: 19, status: 'completed' },
                    { day: 20, status: 'completed' },
                    { day: 21, status: 'completed' },
                    { day: 22, status: 'completed' },
                    { day: 23, status: 'today' },
                    { day: 24, status: 'future' },
                    { day: 25, status: 'future' },
                    { day: 26, status: 'future' },
                    { day: 27, status: 'future' },
                    { day: 28, status: 'future' },
                    { day: 29, status: 'future' },
                    { day: 30, status: 'future' },
                  ].map((date) => (
                    <div 
                      key={date.day}
                      className={`h-12 flex items-center justify-center rounded-md text-sm font-medium ${
                        date.status === 'completed' 
                          ? 'bg-green-500 text-white' 
                          : date.status === 'missed'
                            ? 'bg-red-100 text-red-600'
                            : date.status === 'today'
                              ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                              : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {date.day}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Leaderboard */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Community Leaderboard</h3>
                  <button className="text-blue-600 text-sm font-medium">See All</button>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  {[
                    { rank: 1, name: 'James Wilson', streak: 32, certified: true },
                    { rank: 2, name: 'Emma Rodriguez', streak: 29, certified: true },
                    { rank: 3, name: 'Alex Johnson', streak: 26, certified: false },
                    { rank: 4, name: 'You', streak: 14, certified: false, isUser: true }
                  ].map((user, index) => (
                    <div 
                      key={index}
                      className={`flex items-center py-3 ${index !== 3 ? 'border-b border-gray-200' : ''} ${user.isUser ? 'bg-blue-50 rounded-lg px-2' : ''}`}
                    >
                      <div className="w-8 text-center font-bold text-gray-600">{user.rank}</div>
                      <div className={`w-10 h-10 rounded-full ${user.isUser ? 'bg-blue-100' : 'bg-gray-200'} flex items-center justify-center mr-3`}>
                        <FiUser className={user.isUser ? 'text-blue-600' : 'text-gray-600'} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <span className={`font-medium ${user.isUser ? 'text-blue-700' : ''}`}>{user.name}</span>
                            {user.certified && (
                              <span className="ml-2 bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full">
                                Certified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center">
                            <FiFire className={`mr-1 ${user.isUser ? 'text-orange-500' : 'text-orange-400'}`} />
                            <span className="font-semibold">{user.streak}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Rewards Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 bg-gray-50 rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Unlock Special Rewards</h3>
            <p className="text-gray-600">Maintain your streak to earn special badges, discounts, and exclusive content</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { days: 7, title: 'Week Warrior', description: 'Access to premium practice questions', unlocked: true },
              { days: 15, title: 'Fortnight Champion', description: 'Unlock mock interview sessions', unlocked: false },
              { days: 30, title: 'Monthly Master', description: '15% discount on certification fee', unlocked: false },
              { days: 60, title: 'Expert Status', description: 'Full access to all certification courses', unlocked: false }
            ].map((reward, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`rounded-xl p-6 border ${reward.unlocked ? 'bg-white border-green-200 shadow-md' : 'bg-gray-100 border-gray-200'}`}
              >
                <div className="text-center mb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${reward.unlocked ? 'bg-green-100' : 'bg-gray-200'}`}>
                    <FiAward className={`text-2xl ${reward.unlocked ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div className={`text-sm font-medium mt-2 ${reward.unlocked ? 'text-green-600' : 'text-gray-500'}`}>
                    {reward.days} Days
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-center mb-2">{reward.title}</h4>
                <p className="text-gray-600 text-sm text-center mb-4">{reward.description}</p>
                <div className="text-center">
                  {reward.unlocked ? (
                    <span className="inline-block bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full font-medium">
                      Unlocked
                    </span>
                  ) : (
                    <span className="inline-block bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
                      {reward.days - 14} days left
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StreakChallenge;
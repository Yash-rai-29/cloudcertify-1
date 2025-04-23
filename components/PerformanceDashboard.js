import { motion } from 'framer-motion';
import { FiTrendingUp, FiBarChart2, FiCalendar, FiClock, FiAward, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

const PerformanceDashboard = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Powerful Performance Analytics
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Track your progress in real-time and identify areas for improvement with detailed analytics and insights
          </motion.p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h3 className="text-xl font-semibold">Your GCP Certification Dashboard</h3>
                <p className="text-gray-500 text-sm">Professional Cloud Architect</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                <span className="text-sm text-gray-500">Last updated: Today</span>
                <div className="ml-4">
                  <select className="bg-white border border-gray-200 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Last 30 days</option>
                    <option>Last 60 days</option>
                    <option>Last 90 days</option>
                    <option>All time</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-8">
            {/* Performance Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { icon: FiBarChart2, title: 'Overall Score', value: '78%', change: '+5%', changePositive: true, color: 'blue' },
                { icon: FiCheckCircle, title: 'Tests Completed', value: '12', change: '+3', changePositive: true, color: 'green' },
                { icon: FiClock, title: 'Avg. Completion Time', value: '68 min', change: '-4 min', changePositive: true, color: 'purple' },
                { icon: FiAward, title: 'Performance Rank', value: 'Top 15%', change: '+7%', changePositive: true, color: 'orange' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
                >
                  <div className={`w-12 h-12 rounded-full bg-${stat.color}-100 flex items-center justify-center mb-4`}>
                    <stat.icon className={`text-${stat.color}-600 text-xl`} />
                  </div>
                  <h4 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h4>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className={`flex items-center ${stat.changePositive ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.changePositive ? <FiTrendingUp className="mr-1" /> : <FiTrendingUp className="mr-1 transform rotate-180" />}
                      <span className="text-sm font-medium">{stat.change}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Performance Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mb-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Performance Trend</h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white">Score</button>
                  <button className="px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">Time</button>
                  <button className="px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">Accuracy</button>
                </div>
              </div>
              
              <div className="h-64 relative">
                {/* Placeholder for chart - in a real app, this would be a Chart.js or similar component */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-full w-full" style={{ position: 'relative' }}>
                    {/* Chart Y-axis */}
                    <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-gray-400 text-xs pr-2">
                      <span>100%</span>
                      <span>75%</span>
                      <span>50%</span>
                      <span>25%</span>
                      <span>0%</span>
                    </div>
                    
                    {/* Chart grid lines */}
                    <div className="absolute top-0 left-8 right-0 h-full">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="border-b border-gray-100 h-1/5"></div>
                      ))}
                    </div>
                    
                    {/* Chart line */}
                    <svg className="absolute top-5 left-8 right-5 bottom-5" viewBox="0 0 300 150" preserveAspectRatio="none">
                      <path
                        d="M0,120 C20,100 40,110 60,95 C80,80 100,90 120,70 C140,50 160,60 180,45 C200,30 220,40 240,35 C260,30 280,25 300,20"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="3"
                      />
                      <path
                        d="M0,120 C20,100 40,110 60,95 C80,80 100,90 120,70 C140,50 160,60 180,45 C200,30 220,40 240,35 C260,30 280,25 300,20"
                        fill="url(#gradient)"
                        strokeWidth="0"
                        opacity="0.2"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#2563eb" />
                          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    {/* X-axis labels */}
                    <div className="absolute bottom-0 left-8 right-0 flex justify-between text-gray-400 text-xs">
                      <span>Mar 15</span>
                      <span>Mar 22</span>
                      <span>Mar 29</span>
                      <span>Apr 5</span>
                      <span>Apr 12</span>
                      <span>Apr 19</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Skill Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-100 rounded-xl shadow-sm p-6"
              >
                <h3 className="text-lg font-semibold mb-6">Skill Proficiency</h3>
                <div className="space-y-5">
                  {[
                    { name: 'Designing secure applications', proficiency: 85, color: 'green' },
                    { name: 'Managing GCP resources', proficiency: 72, color: 'blue' },
                    { name: 'Optimizing technical processes', proficiency: 68, color: 'purple' },
                    { name: 'Planning & configuring networks', proficiency: 58, color: 'orange' },
                    { name: 'Reliability & disaster recovery', proficiency: 45, color: 'red' }
                  ].map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <span className="text-sm text-gray-500">{skill.proficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div 
                          className={`bg-${skill.color}-500 h-2.5 rounded-full`}
                          style={{ width: `${skill.proficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-100 rounded-xl shadow-sm p-6"
              >
                <h3 className="text-lg font-semibold mb-4">Improvement Areas</h3>
                <div className="space-y-4">
                  {[
                    { icon: FiAlertTriangle, color: 'red', title: 'Reliability & Disaster Recovery', description: 'Improve your knowledge of GCP reliability concepts and design principles' },
                    { icon: FiAlertTriangle, color: 'orange', title: 'Network Planning', description: 'Focus on understanding VPC design and implementation scenarios' },
                    { icon: FiCheckCircle, color: 'green', title: 'Recommended Resources', description: 'GCP official documentation on reliability engineering practices' }
                  ].map((item, index) => (
                    <div key={index} className="flex">
                      <div className={`w-10 h-10 rounded-full bg-${item.color}-100 flex-shrink-0 flex items-center justify-center mr-4`}>
                        <item.icon className={`text-${item.color}-600`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-semibold mb-3">Upcoming Tests</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <FiCalendar className="text-blue-600 mr-3" />
                      <div>
                        <h5 className="font-medium text-sm">Practice Test 5: Advanced Reliability Concepts</h5>
                        <p className="text-xs text-gray-500">Scheduled for Tomorrow, 10:00 AM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerformanceDashboard;
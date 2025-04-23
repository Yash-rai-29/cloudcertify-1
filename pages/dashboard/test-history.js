import { getLayout } from '../../components/dashboard/DashboardLayout';
import { FiTrendingUp, FiTrendingDown, FiActivity, FiCalendar, FiClock } from 'react-icons/fi';

// Test history data
const testHistory = [
  {
    id: 'test-001',
    name: 'Associate Cloud Engineer Practice Test 1',
    date: 'Apr 19, 2023',
    score: 78,
    totalQuestions: 50,
    correctAnswers: 39,
    duration: '1h 45m',
    improvement: 8,
    improving: true,
    certification: 'Associate Cloud Engineer'
  },
  {
    id: 'test-002',
    name: 'Mini Test: Compute Services',
    date: 'Apr 17, 2023',
    score: 70,
    totalQuestions: 15,
    correctAnswers: 10,
    duration: '25m',
    improvement: -5,
    improving: false,
    certification: 'Associate Cloud Engineer'
  },
  {
    id: 'test-003',
    name: 'Mini Test: Storage Solutions',
    date: 'Apr 15, 2023',
    score: 85,
    totalQuestions: 15,
    correctAnswers: 13,
    duration: '28m',
    improvement: 12,
    improving: true,
    certification: 'Associate Cloud Engineer'
  },
  {
    id: 'test-004',
    name: 'Associate Cloud Engineer Practice Test 2',
    date: 'Apr 12, 2023',
    score: 64,
    totalQuestions: 50,
    correctAnswers: 32,
    duration: '1h 50m',
    improvement: 0,
    improving: null, // First test of this type
    certification: 'Associate Cloud Engineer'
  },
  {
    id: 'test-005',
    name: 'Mini Test: IAM and Security',
    date: 'Apr 10, 2023',
    score: 75,
    totalQuestions: 15,
    correctAnswers: 11,
    duration: '27m',
    improvement: 0,
    improving: null, // First test of this type
    certification: 'Associate Cloud Engineer'
  }
];

// Weekly study data for chart
const weeklyStudyData = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 1.0 },
  { day: 'Wed', hours: 3.0 },
  { day: 'Thu', hours: 2.0 },
  { day: 'Fri', hours: 1.5 },
  { day: 'Sat', hours: 4.0 },
  { day: 'Sun', hours: 2.0 }
];

// Performance by topic
const topicPerformance = [
  { name: 'Cloud Fundamentals', score: 85 },
  { name: 'Compute Services', score: 70 },
  { name: 'Storage Solutions', score: 85 },
  { name: 'Networking', score: 65 },
  { name: 'Security & IAM', score: 75 },
  { name: 'Monitoring', score: 60 }
];

export default function TestHistory() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Test History</h1>
        <p className="mt-1 text-gray-600">
          Track your performance and progress over time
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average score card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-2">
            <FiActivity className="text-blue-500" size={20} />
            <h2 className="text-gray-700 font-medium">Average Score</h2>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold text-gray-900">74%</p>
            <p className="text-sm text-gray-500 mt-1">Across all test attempts</p>
          </div>
        </div>
        
        {/* Tests completed card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-2">
            <FiCalendar className="text-emerald-500" size={20} />
            <h2 className="text-gray-700 font-medium">Tests Completed</h2>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold text-gray-900">5</p>
            <p className="text-sm text-gray-500 mt-1">In the last 30 days</p>
          </div>
        </div>
        
        {/* Study time card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-2">
            <FiClock className="text-indigo-500" size={20} />
            <h2 className="text-gray-700 font-medium">Total Study Time</h2>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold text-gray-900">16h</p>
            <p className="text-sm text-gray-500 mt-1">In the last 7 days</p>
          </div>
        </div>
      </div>
      
      {/* Weekly study chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Weekly Study Hours</h2>
        <div className="h-60 w-full">
          <div className="flex h-48 items-end space-x-2">
            {weeklyStudyData.map((day) => (
              <div key={day.day} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${(day.hours / 4) * 100}%` }}
                ></div>
                <p className="text-xs font-medium text-gray-500 mt-2">{day.day}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Topic performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Performance by Topic</h2>
        <div className="space-y-4">
          {topicPerformance.map((topic) => (
            <div key={topic.name}>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium text-gray-700">{topic.name}</p>
                <p className="text-sm text-gray-500">{topic.score}%</p>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div 
                  className={`h-full rounded-full ${
                    topic.score >= 80 ? 'bg-green-500' : 
                    topic.score >= 70 ? 'bg-blue-500' : 
                    topic.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${topic.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Test history table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-medium text-gray-800">Recent Test Results</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Questions
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {testHistory.map((test) => (
                <tr key={test.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{test.name}</p>
                      <p className="text-xs text-gray-500">{test.certification}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {test.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      test.score >= 80 ? 'bg-green-100 text-green-800' : 
                      test.score >= 70 ? 'bg-blue-100 text-blue-800' : 
                      test.score >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {test.score}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {test.correctAnswers}/{test.totalQuestions}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {test.duration}
                  </td>
                  <td className="px-6 py-4">
                    {test.improving !== null ? (
                      <div className="flex items-center">
                        {test.improving ? (
                          <FiTrendingUp className="text-green-500 mr-1" size={16} />
                        ) : (
                          <FiTrendingDown className="text-red-500 mr-1" size={16} />
                        )}
                        <span className={`text-sm ${test.improving ? 'text-green-600' : 'text-red-600'}`}>
                          {test.improving ? '+' : ''}{test.improvement}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">First attempt</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Use the DashboardLayout for this page
TestHistory.getLayout = getLayout;
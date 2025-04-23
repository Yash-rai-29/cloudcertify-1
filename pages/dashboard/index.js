import { useAuth } from '../../contexts/AuthContext';
import { getLayout } from '../../components/dashboard/DashboardLayout';
import { TracingBeam } from '../../components/ui/TracingBeam';
import { 
  FiActivity, 
  FiBookOpen, 
  FiCalendar, 
  FiClock, 
  FiTrendingUp,
  FiAward,
  FiBriefcase,
  FiClipboard
} from 'react-icons/fi';

// Dashboard status cards data
const statusCards = [
  { 
    title: 'Progress Status', 
    value: '42%', 
    description: 'Overall completion', 
    icon: <FiTrendingUp className="text-emerald-500" size={20} /> 
  },
  { 
    title: 'Daily Streak', 
    value: '12', 
    description: 'days in a row', 
    icon: <FiCalendar className="text-amber-500" size={20} /> 
  },
  { 
    title: 'Practice Tests', 
    value: '8', 
    description: 'tests completed', 
    icon: <FiClipboard className="text-blue-500" size={20} /> 
  },
  { 
    title: 'Study Time', 
    value: '32', 
    description: 'hours this month', 
    icon: <FiClock className="text-indigo-500" size={20} /> 
  },
];

// Certification progress data
const certificationProgress = {
  name: 'Associate Cloud Engineer',
  progress: 42,
  totalTopics: 18,
  completedTopics: 7,
  categories: [
    { name: 'Cloud Fundamentals', percentage: 90 },
    { name: 'Compute Services', percentage: 75 },
    { name: 'Storage & Databases', percentage: 60 },
    { name: 'Networking', percentage: 40 },
    { name: 'Security & IAM', percentage: 25 },
    { name: 'Monitoring & Management', percentage: 15 }
  ]
};

// Recent activities data
const recentActivities = [
  { 
    id: 1, 
    title: 'Completed practice test', 
    description: 'Cloud Fundamentals Mini Test', 
    time: '2 hours ago', 
    icon: <FiBookOpen className="text-blue-500" size={18} /> 
  },
  { 
    id: 2, 
    title: 'Completed topic', 
    description: 'Virtual Machines and Instance Groups', 
    time: 'Yesterday', 
    icon: <FiBriefcase className="text-indigo-500" size={18} /> 
  },
  { 
    id: 3, 
    title: 'Earned badge', 
    description: 'Storage Specialist', 
    time: '2 days ago', 
    icon: <FiAward className="text-amber-500" size={18} /> 
  },
  { 
    id: 4, 
    title: 'Started new topic', 
    description: 'Cloud IAM and Security', 
    time: '3 days ago', 
    icon: <FiActivity className="text-emerald-500" size={18} /> 
  },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.displayName?.split(' ')[0] || 'User'}
        </h1>
        <p className="mt-1 text-gray-600">
          Here's an overview of your certification progress and activities
        </p>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statusCards.map((card, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 flex flex-col border border-gray-100"
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-sm font-medium text-gray-500">{card.title}</h2>
              {card.icon}
            </div>
            <div className="flex items-baseline mt-1">
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="ml-2 text-sm text-gray-500">{card.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress and activities grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Certification progress card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Certification Progress
            </h2>
            
            {/* Certification type & progress */}
            <div className="flex flex-col sm:flex-row justify-between mb-4">
              <div className="flex items-center gap-2 mb-2 sm:mb-0">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                  <FiAward size={20} />
                </div>
                <div>
                  <p className="text-gray-800 font-medium">{certificationProgress.name}</p>
                  <p className="text-sm text-gray-500">
                    {certificationProgress.completedTopics} of {certificationProgress.totalTopics} topics completed
                  </p>
                </div>
              </div>
              <div className="flex items-center h-10 bg-gray-100 rounded-full w-full sm:w-40">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-medium px-3"
                  style={{ width: `${certificationProgress.progress}%` }}
                >
                  {certificationProgress.progress}%
                </div>
              </div>
            </div>
            
            {/* Category progress bars */}
            <div className="mt-6 space-y-4">
              {certificationProgress.categories.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-gray-700">{category.name}</p>
                    <p className="text-sm text-gray-500">{category.percentage}%</p>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent activity card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Recent Activity
            </h2>
            
            <TracingBeam>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="pl-5 relative">
                    <div className="absolute left-0 top-1.5">
                      <div className="bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                        {activity.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-gray-800 font-medium">{activity.title}</h3>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TracingBeam>
          </div>
        </div>
      </div>
    </div>
  );
}

// Use the DashboardLayout for this page
Dashboard.getLayout = getLayout;
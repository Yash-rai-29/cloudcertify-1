import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getLayout } from '../../components/dashboard/DashboardLayout';
import DashboardCard from '../../components/ui/DashboardCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { getUserInfo, updateUserProfile, formatDate } from '../../utils/services/dashboardService';
import { 
  FiUser, 
  FiCalendar, 
  FiClock, 
  FiMail, 
  FiAward, 
  FiStar, 
  FiEdit2,
  FiCreditCard,
  FiSettings,
  FiFileText,
  FiSave,
  FiX,
  FiCheckSquare
} from 'react-icons/fi';

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    certificationTarget: '',
    avatarUrl: '',
    preferences: {
      dailyReminder: true,
      emailNotifications: true,
      theme: 'light',
      studyGoalMinutesPerDay: 30
    }
  });
  const [saving, setSaving] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserInfo();
        if (response.success) {
          setUserData(response.data);
          setFormData({
            firstName: response.data.firstName || '',
            lastName: response.data.lastName || '',
            certificationTarget: response.data.certificationTarget || '',
            avatarUrl: response.data.avatarUrl || '',
            preferences: {
              dailyReminder: response.data.preferences?.dailyReminder !== false,
              emailNotifications: response.data.preferences?.emailNotifications !== false,
              theme: response.data.preferences?.theme || 'light',
              studyGoalMinutesPerDay: response.data.preferences?.studyGoalMinutesPerDay || 30
            }
          });
        } else {
          setError(response.error.message);
        }
      } catch (err) {
        setError('Failed to fetch user information');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle preference changes
  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    setSaving(true);
    
    try {
      const response = await updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        certificationTarget: formData.certificationTarget,
        avatarUrl: formData.avatarUrl,
        preferences: formData.preferences
      });
      
      if (response.success) {
        setUserData(response.data);
        setEditing(false);
      } else {
        setError(response.error.message);
      }
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Render buttons for edit/save/cancel
  const renderActionButtons = () => {
    if (editing) {
      return (
        <div className="flex space-x-2">
          <button
            onClick={() => setEditing(false)}
            className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center gap-1"
          >
            <FiX size={14} /> Cancel
          </button>
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-1"
          >
            {saving ? <LoadingSpinner size="small" text={null} /> : <FiSave size={14} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      );
    } else {
      return (
        <button
          onClick={() => setEditing(true)}
          className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-1"
        >
          <FiEdit2 size={14} /> Edit Profile
        </button>
      );
    }
  };

  // If loading, display a loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" text="Loading profile data..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          My Profile
        </h1>
        {renderActionButtons()}
      </div>

      {error && (
        <ErrorMessage
          title="Error"
          message={error}
          retry={() => window.location.reload()}
        />
      )}

      {userData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Information Card */}
          <DashboardCard title="User Information" className="lg:col-span-2">
            {editing ? (
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={userData.email}
                    disabled
                    className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certification Target
                  </label>
                  <select
                    name="certificationTarget"
                    value={formData.certificationTarget}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="associate-cloud-engineer">Google Cloud Certified - Cloud Engineer</option>
                    <option value="professional-cloud-architect">Google Cloud Certified - Professional Cloud Architect</option>
                    <option value="professional-data-engineer">Google Cloud Certified - Professional Data Engineer</option>
                    <option value="professional-cloud-developer">Google Cloud Certified - Professional Cloud Developer</option>
                    <option value="professional-cloud-devops-engineer">Google Cloud Certified - Professional DevOps Engineer</option>
                    <option value="professional-cloud-security-engineer">Google Cloud Certified - Professional Security Engineer</option>
                    <option value="professional-cloud-network-engineer">Google Cloud Certified - Professional Network Engineer</option>
                    <option value="professional-machine-learning-engineer">Google Cloud Certified - Professional ML Engineer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-semibold">
                    {userData.avatarUrl ? (
                      <img 
                        src={userData.avatarUrl} 
                        alt={userData.firstName} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      userData.firstName?.charAt(0) || 'U'
                    )}
                  </div>
                  <div className="space-y-2 text-center sm:text-left">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {userData.firstName} {userData.lastName}
                    </h2>
                    <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-1">
                      <FiMail className="text-blue-500" />
                      {userData.email}
                    </p>
                    <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-1">
                      <FiAward className="text-amber-500" />
                      {userData.certificationTarget}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Account Created</p>
                      <p className="font-medium">{formatDate(userData.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="text-indigo-500" />
                    <div>
                      <p className="text-sm text-gray-500">Last Login</p>
                      <p className="font-medium">{formatDate(userData.activity?.lastLogin)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DashboardCard>

          {/* Subscription Details */}
          <DashboardCard title="Subscription Details">
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {userData.subscription?.tier || 'Free'} Plan
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Status: {userData.subscription?.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div className="bg-blue-500 text-white p-2 rounded-full">
                    <FiCreditCard size={20} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {userData.subscription?.startDate && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Start Date</span>
                    <span className="font-medium">{formatDate(userData.subscription.startDate)}</span>
                  </div>
                )}
                
                {userData.subscription?.endDate && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Renewal Date</span>
                    <span className="font-medium">{formatDate(userData.subscription.endDate)}</span>
                  </div>
                )}
                
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Auto-Renew</span>
                  <span className="font-medium">{userData.subscription?.autoRenew ? 'On' : 'Off'}</span>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                  Upgrade Subscription
                </button>
              </div>
            </div>
          </DashboardCard>

          {/* Preferences */}
          <DashboardCard title="Preferences">
            {editing ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiSettings className="text-gray-400" />
                    <span className="text-gray-700">Daily Reminder</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="dailyReminder"
                      checked={formData.preferences.dailyReminder}
                      onChange={handlePreferenceChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiMail className="text-gray-400" />
                    <span className="text-gray-700">Email Notifications</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={formData.preferences.emailNotifications}
                      onChange={handlePreferenceChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Theme
                  </label>
                  <select
                    name="theme"
                    value={formData.preferences.theme}
                    onChange={handlePreferenceChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Daily Study Goal (minutes)
                  </label>
                  <input
                    type="number"
                    name="studyGoalMinutesPerDay"
                    value={formData.preferences.studyGoalMinutesPerDay}
                    onChange={handlePreferenceChange}
                    min="5"
                    max="240"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiSettings className="text-gray-400" />
                    <span className="text-gray-700">Daily Reminder</span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${userData.preferences?.dailyReminder ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {userData.preferences?.dailyReminder ? 'Enabled' : 'Disabled'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiMail className="text-gray-400" />
                    <span className="text-gray-700">Email Notifications</span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${userData.preferences?.emailNotifications ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {userData.preferences?.emailNotifications ? 'Enabled' : 'Disabled'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiSettings className="text-gray-400" />
                    <span className="text-gray-700">Theme</span>
                  </div>
                  <span className="font-medium text-gray-900 capitalize">
                    {userData.preferences?.theme || 'Light'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiClock className="text-gray-400" />
                    <span className="text-gray-700">Daily Study Goal</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {userData.preferences?.studyGoalMinutesPerDay || 30} minutes
                  </span>
                </div>
              </div>
            )}
          </DashboardCard>

          {/* Achievements */}
          <DashboardCard title="Achievements">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-full text-amber-700">
                    <FiAward size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Streak Master</h3>
                    <p className="text-sm text-gray-600">Longest streak: {userData.activity?.streakCount || 0} days</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-700">
                  <FiStar size={16} />
                  <FiStar size={16} />
                  <FiStar size={16} />
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full text-blue-700">
                    <FiClock size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Study Champion</h3>
                    <p className="text-sm text-gray-600">Total study time: {Math.round((userData.activity?.studyTimeMinutes || 0) / 60)} hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-blue-700">
                  <FiStar size={16} />
                  <FiStar size={16} />
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* Completed Modules & Saved Resources */}
          <DashboardCard title="Completed Modules & Resources" className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <FiCheckSquare className="text-blue-500" />
                  Completed Modules
                </h3>
                
                {userData.completedModules && userData.completedModules.length > 0 ? (
                  <div className="space-y-2">
                    {userData.completedModules.map((module, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg flex items-center gap-3">
                        <div className="bg-green-100 p-1 rounded-full text-green-700">
                          <FiCheckSquare size={16} />
                        </div>
                        <span className="text-gray-800">{module}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-gray-500">No completed modules yet</p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <FiFileText className="text-indigo-500" />
                  Saved Resources
                </h3>
                
                {userData.savedResources && userData.savedResources.length > 0 ? (
                  <div className="space-y-2">
                    {userData.savedResources.map((resource, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg flex items-center gap-3">
                        <div className="bg-indigo-100 p-1 rounded-full text-indigo-700">
                          <FiFileText size={16} />
                        </div>
                        <span className="text-gray-800">{resource}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-gray-500">No saved resources yet</p>
                  </div>
                )}
              </div>
            </div>
          </DashboardCard>
        </div>
      )}
    </div>
  );
}

// Use the DashboardLayout for this page
ProfilePage.getLayout = getLayout;
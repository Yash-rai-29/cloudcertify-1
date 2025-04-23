import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getLayout } from '../../components/dashboard/DashboardLayout';
import DashboardCard from '../../components/ui/DashboardCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Button from '../../components/ui/Button';

// Profile components
import ProfileForm from '../../components/profile/ProfileForm';
import PreferenceForm from '../../components/profile/PreferenceForm';
import UserProfileDisplay from '../../components/profile/UserProfileDisplay';
import PreferenceDisplay from '../../components/profile/PreferenceDisplay';
import AchievementItem from '../../components/profile/AchievementItem';
import ResourceItem from '../../components/profile/ResourceItem';
import SubscriptionCard from '../../components/profile/SubscriptionCard';

import { getUserInfo, updateUserProfile } from '../../utils/services/dashboardService';
import { 
  FiEdit2,
  FiClock,
  FiAward,
  FiCheckSquare,
  FiFileText
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

  // Toggle edit mode
  const toggleEdit = () => setEditing(!editing);
  
  // Cancel edit
  const cancelEdit = () => setEditing(false);

  // Render action buttons
  const renderActionButtons = () => {
    if (editing) {
      return null; // Buttons are now in the ProfileForm component
    } else {
      return (
        <Button
          variant="primary"
          leftIcon={<FiEdit2 size={14} />}
          onClick={toggleEdit}
        >
          Edit Profile
        </Button>
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
              <ProfileForm
                formData={formData}
                handleInputChange={handleInputChange}
                handlePreferenceChange={handlePreferenceChange}
                userData={userData}
                handleSaveProfile={handleSaveProfile}
                saving={saving}
                cancelEdit={cancelEdit}
              />
            ) : (
              <UserProfileDisplay userData={userData} />
            )}
          </DashboardCard>

          {/* Subscription Details */}
          <DashboardCard title="Subscription Details">
            <SubscriptionCard subscription={userData.subscription} />
          </DashboardCard>

          {/* Preferences */}
          <DashboardCard title="Preferences">
            {editing ? (
              <PreferenceForm 
                formData={formData}
                handlePreferenceChange={handlePreferenceChange}
              />
            ) : (
              <PreferenceDisplay preferences={userData.preferences} />
            )}
          </DashboardCard>

          {/* Achievements */}
          <DashboardCard title="Achievements">
            <div className="space-y-4">
              <AchievementItem
                icon={<FiAward size={20} />}
                title="Streak Master"
                description={`Longest streak: ${userData.activity?.streakCount || 0} days`}
                bgClass="bg-amber-50 border-amber-100"
                iconClass="bg-amber-100 text-amber-700"
                stars={3}
              />

              <AchievementItem
                icon={<FiClock size={20} />}
                title="Study Champion"
                description={`Total study time: ${Math.round((userData.activity?.studyTimeMinutes || 0) / 60)} hours`}
                bgClass="bg-blue-50 border-blue-100"
                iconClass="bg-blue-100 text-blue-700"
                stars={2}
              />
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
                      <ResourceItem
                        key={index}
                        icon={<FiCheckSquare size={16} />}
                        title={module}
                        iconColor="bg-green-100 text-green-700"
                      />
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
                      <ResourceItem
                        key={index}
                        icon={<FiFileText size={16} />}
                        title={resource}
                        iconColor="bg-indigo-100 text-indigo-700"
                      />
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
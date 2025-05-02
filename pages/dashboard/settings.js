import { useState, useEffect } from 'react';
import { getDashboardLayout } from '../../components/layouts/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { getUserInfo } from '../../utils/services/dashboardService';
import { updateUserProfile, uploadProfileImage, updatePassword } from '../../utils/services/userService';
import { showSuccess, showError } from '../../utils/toast';
import { 
  IconUser, 
  IconLock, 
  IconInfoCircle
} from '@tabler/icons-react';
import SettingsTabs from '../../components/dashboard/SettingsTabs';
import ProfileSection from '../../components/dashboard/ProfileSection';
import ChangePasswordSection from '../../components/dashboard/ChangePasswordSection';
import AboutCloudCertifySection from '../../components/dashboard/AboutCloudCertifySection';

/**
 * Settings page component integrating profile management, password change, and about sections
 */
export default function Settings() {
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Load user data when authenticated
  useEffect(() => {
    if (authUser) {
      fetchUserData();
    }
  }, [authUser]);

  // Fetch user information from API
  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await getUserInfo();
      if (response.success && response.data) {
        setUserData(response.data);
        
        // Set photo preview if exists
        if (response.data.photo_url) {
          setPhotoPreview(response.data.photo_url);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      showError('Failed to load user information. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile photo change
  const handlePhotoChange = (file) => {
    setPhotoFile(file);
    
    // Create a preview URL
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile form submission
  const handleProfileSubmit = async (data) => {
    setIsSaving(true);
    
    try {
      let photoUrl = userData?.photo_url;
      
      // If there's a new photo, upload it first
      if (photoFile) {
        const uploadResponse = await uploadProfileImage(photoFile);
        if (uploadResponse.success && uploadResponse.data) {
          photoUrl = uploadResponse.data.image_url;
        } else {
          throw new Error('Failed to upload profile image');
        }
      }
      
      // Update user profile with form data and possibly new photo URL
      const updateResponse = await updateUserProfile({
        first_name: data.firstName,
        last_name: data.lastName,
        job_title: data.jobTitle,
        certification_target: data.certificationTarget,
        bio: data.bio,
        photo_url: photoUrl
      });
      
      if (updateResponse.success) {
        showSuccess('Profile updated successfully!');
        // Refresh user data
        fetchUserData();
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (newPassword) => {
    setIsSaving(true);
    
    try {
      const response = await updatePassword(newPassword);
      
      if (response.success) {
        showSuccess('Password updated successfully!');
      } else {
        throw new Error('Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      showError(error.message || 'Failed to update password. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Tab configuration
  const tabItems = [
    { id: 'profile', label: 'Profile', icon: IconUser },
    { id: 'password', label: 'Password', icon: IconLock },
    { id: 'about', label: 'About', icon: IconInfoCircle }
  ];

  return (
    <div className="py-6">
      {/* Page header */}
      <div className="mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Main content area */}
      <div className="mx-auto mt-6 px-4 sm:px-6 md:px-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading your settings...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Settings tabs */}
            <SettingsTabs 
              items={tabItems} 
              active={activeTab} 
              onChange={setActiveTab} 
            />
            
            <div className="p-6">
              {/* Profile tab content */}
              {activeTab === 'profile' && userData && (
                <ProfileSection 
                  userData={userData}
                  onSubmit={handleProfileSubmit}
                  photoPreview={photoPreview}
                  onPhotoChange={handlePhotoChange}
                  isSaving={isSaving}
                />
              )}
              
              {/* Password tab content */}
              {activeTab === 'password' && (
                <ChangePasswordSection 
                  onSubmit={handlePasswordUpdate}
                  isSaving={isSaving}
                />
              )}
              
              {/* About tab content */}
              {activeTab === 'about' && (
                <AboutCloudCertifySection />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Set the dashboard layout for this page
Settings.getLayout = (page) => getDashboardLayout(page, 'Settings');

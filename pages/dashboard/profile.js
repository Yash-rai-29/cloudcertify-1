import { useState, useEffect } from 'react';
import { getDashboardLayout } from '../../components/layouts/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { getUserInfo } from '../../utils/services/dashboardService';
import { updateUserProfile, uploadProfileImage, updatePassword } from '../../utils/services/userService';
import { showSuccess, showError } from '../../utils/toast';

// Import our new components
import ProfileTabs from '../../components/profile/ProfileTabs';
import UserProfileTab from '../../components/profile/UserProfileTab';
import AccountTab from '../../components/profile/AccountTab';
import AboutTab from '../../components/profile/AboutTab';

/**
 * User profile page with tabbed interface for profile, account and about sections
 */
export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load user data when component mounts
  useEffect(() => {
    if (authUser) {
      fetchUserData();
    }
  }, [authUser]);

  // Fetch user data from API
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await getUserInfo();
      if (response.success && response.data) {
        setUserData(response.data);
        
        // Set photo preview if user has a profile photo
        if (response.data.photo_url) {
          setPhotoPreview(response.data.photo_url);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user information. Please try again later.');
      showError('Failed to load user information. Please try again later.');
    } finally {
      setLoading(false);
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

  // Handle password change
  const handlePasswordChange = async (newPassword) => {
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

  return (
    <div className="py-6">
      {/* Page container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          // Loading state
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          // Error state
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          // Content when data is loaded
          <>
            {/* Tab navigation */}
            <ProfileTabs 
              activeTab={activeTab} 
              onChange={setActiveTab} 
            />
            
            {/* Tab content */}
            <div className="mt-6">
              {activeTab === 'profile' && userData && (
                <UserProfileTab 
                  userData={userData}
                  photoPreview={photoPreview}
                  onPhotoChange={handlePhotoChange}
                  onSubmit={handleProfileSubmit}
                  isSaving={isSaving}
                />
              )}
              
              {activeTab === 'account' && (
                <AccountTab 
                  onPasswordChange={handlePasswordChange}
                  isSaving={isSaving}
                />
              )}
              
              {activeTab === 'about' && (
                <AboutTab />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Set the dashboard layout for this page
ProfilePage.getLayout = (page) => getDashboardLayout(page, 'Profile');
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { formatDate } from '../../utils/helpers';
import { 
  IconUser, 
  IconCheck, 
  IconUpload, 
  IconRefresh 
} from '@tabler/icons-react';

// Certification options
const CERTIFICATION_OPTIONS = [
  'Google Cloud Certified - Cloud Engineer',
  'Google Cloud Certified - Professional Data Engineer',
  'Google Cloud Certified - Professional Cloud Architect',
  'AWS Certified Solutions Architect',
  'AWS Certified Developer',
  'Microsoft Azure Fundamentals',
  'Microsoft Azure Administrator'
];

/**
 * ProfileSection component for user profile management
 */
export default function ProfileSection({ 
  userData, 
  onSubmit, 
  photoPreview, 
  onPhotoChange, 
  isSaving 
}) {
  const [dragActive, setDragActive] = useState(false);
  
  // React Hook Form for profile data
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      firstName: userData?.first_name || '',
      lastName: userData?.last_name || '',
      jobTitle: userData?.job_title || '',
      certificationTarget: userData?.certification_target || '',
      bio: userData?.bio || ''
    }
  });

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onPhotoChange(e.dataTransfer.files[0]);
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onPhotoChange(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <IconUser className="mr-2 text-blue-600" size={20} />
            Profile Information
          </h3>
        </div>
        
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column - Photo and Summary */}
            <div className="md:col-span-4 space-y-6">
              {/* Profile Photo */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Profile Photo</h4>
                
                <div 
                  className={`relative rounded-lg border-2 border-dashed p-4 text-center transition-all
                    ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="profile-photo"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  
                  {/* Photo Preview */}
                  {photoPreview ? (
                    <div className="mx-auto w-32 h-32 relative group">
                      <img 
                        src={photoPreview} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover rounded-full border border-gray-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <label 
                          htmlFor="profile-photo" 
                          className="text-white cursor-pointer hover:underline text-sm"
                        >
                          Change Photo
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="mx-auto w-32 h-32 bg-gray-100 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
                      <IconUser size={48} stroke={1.5} />
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <label 
                      htmlFor="profile-photo" 
                      className="cursor-pointer px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <IconUpload size={16} className="inline-block mr-1" stroke={1.5} />
                      Select Image
                    </label>
                    <p className="mt-2 text-xs text-gray-500">PNG, JPG or GIF up to 10MB</p>
                  </div>
                </div>
              </div>
              
              {/* User Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Name</h4>
                  <p className="font-medium text-gray-900">
                    {userData?.first_name ? `${userData.first_name} ${userData.last_name}` : 'Not set'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p className="font-medium text-gray-900">{userData?.email || 'Not available'}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Certification Target</h4>
                  <p className="font-medium text-gray-900">
                    {userData?.certification_target || 'Not set'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Joined</h4>
                  <p className="font-medium text-gray-900">
                    {userData?.created_at ? formatDate(userData.created_at) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right Column - Form Fields */}
            <div className="md:col-span-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className={`w-full rounded-md border ${errors.firstName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} shadow-sm py-2 px-3`}
                    placeholder="Your first name"
                    {...register('firstName', { required: 'First name is required' })}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>
                
                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className={`w-full rounded-md border ${errors.lastName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} shadow-sm py-2 px-3`}
                    placeholder="Your last name"
                    {...register('lastName', { required: 'Last name is required' })}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
              
              {/* Email - Read Only */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={userData?.email || ''}
                  disabled
                  className="w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm py-2 px-3 text-gray-500 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">Email address cannot be changed.</p>
              </div>
              
              {/* Job Title */}
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  id="jobTitle"
                  type="text"
                  className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm py-2 px-3"
                  placeholder="e.g. Cloud Solutions Architect"
                  {...register('jobTitle')}
                />
              </div>
              
              {/* Certification Target */}
              <div>
                <label htmlFor="certificationTarget" className="block text-sm font-medium text-gray-700 mb-1">
                  Certification Target <span className="text-red-500">*</span>
                </label>
                <select
                  id="certificationTarget"
                  className={`w-full rounded-md border ${errors.certificationTarget ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} shadow-sm py-2 px-3`}
                  {...register('certificationTarget', { required: 'Please select a certification target' })}
                >
                  <option value="">Select a certification...</option>
                  {CERTIFICATION_OPTIONS.map((cert) => (
                    <option key={cert} value={cert}>{cert}</option>
                  ))}
                </select>
                {errors.certificationTarget && (
                  <p className="mt-1 text-sm text-red-600">{errors.certificationTarget.message}</p>
                )}
              </div>
              
              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm py-2 px-3"
                  placeholder="Tell us about yourself, your experience, and your cloud journey..."
                  {...register('bio')}
                />
                <p className="mt-1 text-xs text-gray-500">Brief description for your profile. This may be shown to other users.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer with Save Button */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSaving ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? (
              <>
                <IconRefresh className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Saving...
              </>
            ) : (
              <>
                <IconCheck className="-ml-1 mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

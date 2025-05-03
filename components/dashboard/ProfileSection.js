import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { formatDate } from '../../utils/helpers';
import { 
  IconUser, 
  IconCheck, 
  IconUpload, 
  IconRefresh,
  IconX,
  IconCamera,
  IconBriefcase,
  IconCertificate,
  IconInfoCircle,
  IconCalendar,
  IconClockEdit,
  IconAlertCircle,
  IconBuildingBank,
  IconChevronDown
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

// Certification options
const CERTIFICATION_OPTIONS = [
  'Google Cloud Certified - Cloud Engineer',
  'Google Cloud Certified - Professional Cloud Architect',
  'Google Cloud Certified - Professional Data Engineer',
  'Google Cloud Certified - Professional Cloud Developer',
  'Google Cloud Certified - Professional Network Engineer',
  'Google Cloud Certified - Professional Security Engineer',
  'Google Cloud Certified - Professional ML Engineer',
  'Google Cloud Certified - Professional DevOps Engineer',
  'Other'
];

/**
 * Enhanced ProfileSection component for user profile management
 */
export default function ProfileSection({ 
  userData, 
  onSubmit, 
  photoPreview, 
  onPhotoChange, 
  isSaving 
}) {
  const [dragActive, setDragActive] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);
  
  // React Hook Form for profile data
  const { 
    register, 
    handleSubmit, 
    control,
    formState: { errors, isDirty } 
  } = useForm({
    defaultValues: {
      firstName: userData?.first_name || '',
      lastName: userData?.last_name || '',
      certificationTarget: userData?.certification_target || '',
      bio: userData?.bio || '',
    },
    mode: 'onBlur' // Validate on blur for better UX
  });

  // Handle successful form submission
  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    setSuccessMessage('Profile updated successfully!');
    setFormSubmitted(true);
    
    // Reset form submitted state after 3 seconds
    setTimeout(() => setFormSubmitted(false), 3000);
  };
  
  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateImageFile(file)) {
        onPhotoChange(file);
      }
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
      const file = e.target.files[0];
      if (validateImageFile(file)) {
        onPhotoChange(file);
      }
    }
  };
  
  // Validate image file type and size
  const validateImageFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPG, PNG, or GIF)');
      return false;
    }
    
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return false;
    }
    
    return true;
  };
  
  // Remove profile photo
  const handleRemovePhoto = () => {
    onPhotoChange(null);
  };

  return (
    <>
      {/* Success message notification */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 text-green-800 p-4 rounded-lg shadow-md flex items-center">
          <IconCheck className="mr-2" size={20} />
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        <div className="bg-white shadow rounded-xl overflow-hidden border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <IconUser className="mr-2 text-blue-600" size={22} />
              Profile Information
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Update your personal information and how you appear on CloudCertify
            </p>
          </div>
          
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-8">
              {/* Left Column - Photo and Summary */}
              <div className="md:col-span-4 space-y-6">
                {/* Profile Photo */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700 flex items-center">
                    <IconCamera size={18} className="mr-2 text-blue-500" />
                    Profile Photo
                  </h4>
                  
                  <div 
                    className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-all
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
                      accept="image/jpeg,image/png,image/gif"
                      onChange={handleFileChange}
                      aria-label="Upload profile photo"
                    />
                    
                    {/* Photo Preview */}
                    {photoPreview ? (
                      <div className="mx-auto w-36 h-36 relative group">
                        <img 
                          src={photoPreview} 
                          alt="Profile preview" 
                          className="w-full h-full object-cover rounded-full ring-4 ring-gray-100"
                        />
                        
                        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <div className="flex space-x-2">
                            <label 
                              htmlFor="profile-photo" 
                              className="flex items-center justify-center w-9 h-9 bg-white bg-opacity-90 rounded-full cursor-pointer hover:bg-opacity-100 transition-colors"
                              aria-label="Change photo"
                            >
                              <IconCamera size={18} className="text-gray-700" />
                            </label>
                            
                            <button
                              type="button"
                              onClick={handleRemovePhoto}
                              className="flex items-center justify-center w-9 h-9 bg-white bg-opacity-90 rounded-full cursor-pointer hover:bg-opacity-100 transition-colors"
                              aria-label="Remove photo"
                            >
                              <IconX size={18} className="text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mx-auto w-36 h-36 bg-gray-100 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 overflow-hidden">
                        <IconUser size={64} stroke={1.5} />
                      </div>
                    )}
                    
                    <div className="mt-6">
                      <label 
                        htmlFor="profile-photo" 
                        className="cursor-pointer px-4 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors inline-flex items-center"
                      >
                        <IconUpload size={16} className="mr-2" stroke={1.5} />
                        Upload Photo
                      </label>
                      <p className="mt-3 text-xs text-gray-500">PNG, JPG or GIF up to 10MB</p>
                    </div>
                  </div>
                </div>
                
                {/* User Summary */}
                <div className="rounded-lg p-4 space-y-3 bg-gray-50 border border-gray-200">
                  <h4 className="font-medium text-gray-700 text-sm">Account Information</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <IconCalendar size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-500 mr-2">Joined:</span>
                      <span className="text-gray-800 font-medium">
                        {userData?.created_at ? formatDate(userData.created_at) : 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <IconClockEdit size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-500 mr-2">Last updated:</span>
                      <span className="text-gray-800 font-medium">
                        {userData?.updated_at ? formatDate(userData.updated_at) : 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-200 mt-2">
                    <div className="flex items-start text-xs text-gray-500">
                      <IconInfoCircle size={14} className="text-blue-500 mr-1.5 mt-0.5 flex-shrink-0" />
                      <span>
                        Your profile information may be visible to other users on CloudCertify.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Form Fields */}
              <div className="md:col-span-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="firstName"
                        type="text"
                        className={`w-full rounded-lg border ${errors.firstName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} shadow-sm py-2.5 px-3`}
                        placeholder="Your first name"
                        aria-invalid={errors.firstName ? "true" : "false"}
                        {...register('firstName', { 
                          required: 'First name is required',
                          minLength: { value: 2, message: 'First name must be at least 2 characters' },
                          maxLength: { value: 50, message: 'First name must be less than 50 characters' }
                        })}
                      />
                      {errors.firstName && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <IconAlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    {errors.firstName && (
                      <p className="mt-1.5 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>
                  
                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="lastName"
                        type="text"
                        className={`w-full rounded-lg border ${errors.lastName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} shadow-sm py-2.5 px-3`}
                        placeholder="Your last name"
                        aria-invalid={errors.lastName ? "true" : "false"}
                        {...register('lastName', { 
                          required: 'Last name is required',
                          minLength: { value: 2, message: 'Last name must be at least 2 characters' },
                          maxLength: { value: 50, message: 'Last name must be less than 50 characters' }
                        })}
                      />
                      {errors.lastName && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <IconAlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    {errors.lastName && (
                      <p className="mt-1.5 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                
                {/* Email - Read Only */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="flex">
                    <input
                      id="email"
                      type="email"
                      value={userData?.email || ''}
                      readOnly
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 shadow-sm py-2.5 px-3 text-gray-500 cursor-not-allowed"
                      aria-label="Email address"
                    />
                    <div className="ml-2 flex items-center text-gray-400">
                      <IconInfoCircle size={18} />
                    </div>
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500">Email address is associated with your account and cannot be changed.</p>
                </div>
                
                {/* Certification Target */}
                <div>
                  <label htmlFor="certificationTarget" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Certification Target <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IconCertificate className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <select
                      id="certificationTarget"
                      className={`w-full rounded-lg border ${errors.certificationTarget ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} shadow-sm py-2.5 pl-10 pr-3 appearance-none bg-none`}
                      aria-invalid={errors.certificationTarget ? "true" : "false"}
                      {...register('certificationTarget', { required: 'Please select a certification target' })}
                    >
                      <option value="">Select a certification...</option>
                      {CERTIFICATION_OPTIONS.map((cert) => (
                        <option key={cert} value={cert}>{cert}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <IconChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    {errors.certificationTarget && (
                      <div className="absolute inset-y-0 right-8 flex items-center pr-3 pointer-events-none">
                        <IconAlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  {errors.certificationTarget && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.certificationTarget.message}</p>
                  )}
                </div>
                
                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Bio
                  </label>
                  <Controller
                    name="bio"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        id="bio"
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm py-2.5 px-3"
                        placeholder="Tell us about yourself, your experience, and your cloud journey..."
                        {...field}
                      />
                    )}
                  />
                  <div className="flex justify-between mt-1.5">
                    <p className="text-xs text-gray-500">
                      Brief description for your profile. This may be shown to other users.
                    </p>
                    <p className="text-xs text-gray-400">
                      {control._formValues.bio?.length || 0}/500
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer with Save Button */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {isDirty ? "You have unsaved changes" : ""}
            </p>
            
            <motion.button
              type="submit"
              disabled={isSaving || !isDirty}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.1 }}
              className={`inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                (isSaving || !isDirty) ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? (
                <>
                  <IconRefresh className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Saving Changes...
                </>
              ) : formSubmitted ? (
                <>
                  <IconCheck className="-ml-1 mr-2 h-4 w-4" />
                  Saved!
                </>
              ) : (
                <>
                  <IconCheck className="-ml-1 mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </>
  );
}

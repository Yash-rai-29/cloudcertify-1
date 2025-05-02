import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { formatDate } from '../../utils/helpers';
import Image from 'next/image';

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
 * User Profile Tab with two-column layout matching reference UI
 */
export default function UserProfileTab({ 
  userData, 
  onSubmit, 
  photoPreview, 
  onPhotoChange, 
  isSaving 
}) {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      firstName: userData?.first_name || '',
      lastName: userData?.last_name || '',
      certificationTarget: userData?.certification_target || '',
      bio: userData?.bio || ''
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
          👤
        </div>
        <h2 className="text-xl font-semibold text-gray-900 ml-2">User Profile</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left column: Profile picture and summary */}
          <div className="lg:col-span-4">
            <div className="flex flex-col items-center">
              {/* Profile photo */}
              <div className="relative group mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 mx-auto">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '';
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = `<div class="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-4xl">
                          ${(userData?.first_name?.[0] || '') + (userData?.last_name?.[0] || '')}
                        </div>`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 text-4xl font-bold">
                      {(userData?.first_name?.[0] || '') + (userData?.last_name?.[0] || '')}
                    </div>
                  )}
                  
                  {/* Camera icon for photo upload */}
                  <label 
                    htmlFor="profile-photo" 
                    className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer shadow-md hover:bg-blue-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
                      <path d="M6.5 11.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m-2-3.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5"/>
                    </svg>
                  </label>
                  <input 
                    id="profile-photo" 
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onPhotoChange(e.target.files[0])}
                  />
                </div>
              </div>
              
              {/* User info summary */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {userData?.first_name ? `${userData.first_name} ${userData.last_name}` : 'Your Name'}
                </h3>
                <p className="text-blue-600">{userData?.certification_target || 'No certification selected'}</p>
                <p className="text-sm text-gray-500 mt-1">Joined: {userData?.created_at ? formatDate(userData.created_at) : 'N/A'}</p>
              </div>
            </div>
          </div>
          
          {/* Right column: Form fields */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {/* Personal Information section */}
              <div>
                <h3 className="text-lg font-medium text-blue-600 mb-4 border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  {/* First Name */}
                  <div className="sm:col-span-3">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="firstName"
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                          errors.firstName ? 'border-red-300' : ''
                        }`}
                        {...register('firstName', { required: 'First name is required' })}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="sm:col-span-3">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="lastName"
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                          errors.lastName ? 'border-red-300' : ''
                        }`}
                        {...register('lastName', { required: 'Last name is required' })}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Email Address (readonly) */}
                  <div className="sm:col-span-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        id="email"
                        value={userData?.email || ''}
                        disabled
                        className="bg-gray-50 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Details section */}
              <div>
                <h3 className="text-lg font-medium text-blue-600 mb-4 border-b pb-2">Professional Details</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  {/* Certification Target */}
                  <div className="sm:col-span-6">
                    <label htmlFor="certificationTarget" className="block text-sm font-medium text-gray-700">
                      Certifications
                    </label>
                    <div className="mt-1">
                      <select
                        id="certificationTarget"
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                          errors.certificationTarget ? 'border-red-300' : ''
                        }`}
                        {...register('certificationTarget')}
                      >
                        <option value="">Select a certification...</option>
                        {CERTIFICATION_OPTIONS.map((cert) => (
                          <option key={cert} value={cert}>{cert}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="sm:col-span-6">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="bio"
                        rows={4}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Tell us about yourself..."
                        {...register('bio')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Changes button */}
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSaving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

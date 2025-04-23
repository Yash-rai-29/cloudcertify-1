import React from 'react';
import Button from '../ui/Button';
import { FiSave, FiX } from 'react-icons/fi';

/**
 * Profile form component for editing user information
 */
const ProfileForm = ({
  formData,
  handleInputChange,
  handlePreferenceChange,
  userData,
  handleSaveProfile,
  saving,
  cancelEdit
}) => {
  return (
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

      {/* Form Actions */}
      <div className="flex space-x-2 justify-end">
        <Button
          variant="secondary"
          onClick={cancelEdit}
          leftIcon={<FiX size={14} />}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSaveProfile}
          isLoading={saving}
          leftIcon={!saving && <FiSave size={14} />}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
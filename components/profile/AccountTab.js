import { useState } from 'react';
import { useForm } from 'react-hook-form';

/**
 * Account Tab with password change functionality and account deletion option
 */
export default function AccountTab({ onPasswordChange, isSaving }) {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch,
    reset 
  } = useForm();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Function to handle password change
  const onSubmit = (data) => {
    onPasswordChange(data.newPassword);
    reset();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
          🔐
        </div>
        <h2 className="text-xl font-semibold text-gray-900 ml-2">Account Settings</h2>
      </div>

      {/* Security Settings Section */}
      <div>
        <h3 className="text-lg font-medium text-blue-600 mb-4 border-b pb-2">Security Settings</h3>
        
        {/* Password Change Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
          <h4 className="font-medium text-gray-900 mb-1">Password</h4>
          <p className="text-sm text-gray-600 mb-4">Change your account password</p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.newPassword ? 'border-red-300' : ''
                }`}
                {...register('newPassword', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters long' },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: 'Password must include uppercase, lowercase, number and special character'
                  }
                })}
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  errors.confirmPassword ? 'border-red-300' : ''
                }`}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === watch('newPassword') || 'Passwords do not match'
                })}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Danger Zone Section */}
      <div>
        <h3 className="text-lg font-medium text-red-600 mb-4 border-b pb-2">Danger Zone</h3>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-5">
          <h4 className="font-medium text-red-700 mb-1">Delete Account</h4>
          <p className="text-sm text-red-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          
          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Account
            </button>
          ) : (
            <div className="border border-red-300 rounded-md p-4 bg-white">
              <p className="text-sm text-gray-700 mb-4">
                Are you absolutely sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Yes, Delete My Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

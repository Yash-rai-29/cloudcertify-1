import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IconLock, IconEye, IconEyeOff, IconRefresh } from '@tabler/icons-react';

/**
 * Component for changing user password
 */
export default function ChangePasswordSection({ onSubmit, isSaving }) {
  const [showPassword, setShowPassword] = useState(false);
  
  // React Hook Form for password update
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset,
    watch 
  } = useForm();
  
  // Function to watch password value for confirmation matching
  const password = watch('newPassword', '');
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Handle form submission with password validation
  const handlePasswordSubmit = (data) => {
    onSubmit(data.newPassword);
    reset(); // Clear form after submission
  };

  return (
    <form onSubmit={handleSubmit(handlePasswordSubmit)} className="space-y-8">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <IconLock className="mr-2 text-blue-600" size={20} />
            Change Password
          </h3>
        </div>
        
        <div className="px-6 py-6">
          <div className="max-w-xl space-y-6">
            <p className="text-sm text-gray-600">
              Create a strong password that includes at least 8 characters, uppercase and lowercase letters, 
              numbers, and special characters for better security.
            </p>
            
            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full rounded-md border ${
                    errors.newPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  } shadow-sm py-2 px-3 pr-10`}
                  placeholder="Enter new password"
                  {...register('newPassword', {
                    required: 'New password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
              )}
              
              {/* Password strength meter */}
              {password && !errors.newPassword && (
                <div className="mt-2">
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        password.length >= 12 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/.test(password)
                          ? 'bg-green-500 w-full'
                          : password.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)
                            ? 'bg-yellow-500 w-3/4' 
                            : 'bg-red-500 w-1/2'
                      }`}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {password.length >= 12 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/.test(password)
                      ? 'Strong password'
                      : password.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)
                        ? 'Good password' 
                        : 'Weak password'}
                  </p>
                </div>
              )}
            </div>
            
            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full rounded-md border ${
                    errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  } shadow-sm py-2 px-3 pr-10`}
                  placeholder="Confirm new password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer with Update Button */}
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
                Updating...
              </>
            ) : (
              <>
                <IconLock className="-ml-1 mr-2 h-4 w-4" />
                Update Password
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

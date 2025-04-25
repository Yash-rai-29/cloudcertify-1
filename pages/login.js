import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Head from 'next/head';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { FiMail, FiLock, FiAlertCircle, FiEye, FiEyeOff, FiArrowLeft, FiCloud } from 'react-icons/fi';
import { SparklesBackground } from '../components/ui/SparklesBackground';
import { showSuccess, showError, handleErrorWithToast } from '../utils/toast';
import { ERRORS } from '../utils/constants';

// Create a custom layout for the login page that doesn't include header or footer
Login.getLayout = (page) => (
  <>
    <Head>
      <title>Log In - Cloud Certify</title>
      <meta name="description" content="Log in to your Cloud Certify account to continue your GCP certification journey." />
    </Head>
    {page}
  </>
);

export default function Login() {
  const { signIn, loading, error: authContextError, clearError } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Handle login form submission
  const onSubmit = async (data) => {
    try {
      setAuthError(null);
      clearError();
      
      const response = await signIn(data.email, data.password);
      
      if (!response.success) {
        // Check if this is a known authentication error
        if (response.code === 'invalid_credentials' || response.error?.code === 'invalid_credentials') {
          // Get the error message from the appropriate location
          const errorMessage = response.message || 
                              response.error?.message || 
                              ERRORS.AUTH.INVALID_CREDENTIALS.message;
          
          // Show a toast notification for invalid credentials
          showError(errorMessage, {
            id: 'login-error'
          });
          
          // Also set the auth error for the form display
          setAuthError({ message: errorMessage });
        } 
        // Check if it's another error type that should use toast
        else if (response.shouldShowToast || response.error?.shouldShowToast) {
          // Use our error handling utility
          handleErrorWithToast(response);
          
          // Still set the auth error for the form display if it's a validation error
          if (response.validationErrors || response.error?.validationErrors) {
            setAuthError(response.error || response);
          }
        } else {
          // For other errors, display in the form error area
          setAuthError(response.error || response || {
            message: 'Failed to log in. Please check your credentials.'
          });
        }
      } else {
        // If successful, show a success toast
        showSuccess('Logged in successfully!');
        
        // Optional: redirect to dashboard after successful login
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // If it's a Firebase auth error, handle it properly
      if (error.code && error.code.startsWith('auth/')) {
        let errorMessage;
        
        // Format commonly encountered Firebase auth errors
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = ERRORS.AUTH.INVALID_CREDENTIALS.message;
            break;
          case 'auth/too-many-requests':
            errorMessage = ERRORS.AUTH.TOO_MANY_ATTEMPTS.message;
            break;
          case 'auth/network-request-failed':
            errorMessage = ERRORS.AUTH.NETWORK_ERROR.message;
            break;
          default:
            errorMessage = error.message || 'An authentication error occurred';
        }
        
        // Show formatted error message in a toast
        showError(errorMessage);
        
        // Also set the auth error for the form display
        setAuthError({ message: errorMessage });
      } else {
        // For other non-Firebase errors
        showError('An unexpected error occurred. Please try again.');
        setAuthError(error.message || 'Failed to log in. Please check your credentials.');
      }
    }
  };

  // Format error message for display
  const formatErrorMessage = (error) => {
    if (!error) return null;
    
    if (error.validationErrors) {
      // Format validation errors in a more readable way
      if (Array.isArray(error.validationErrors)) {
        return error.validationErrors.map(item => {
          const field = item.loc[item.loc.length - 1];
          // Convert field name to title case for display
          const fieldName = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          return `${fieldName}: ${item.msg}`;
        }).join('\n');
      }
      return error.validationErrors.toString();
    }
    
    return error.message || 'An error occurred. Please try again.';
  };
  
  // Show error from context if present
  const displayError = authError ? formatErrorMessage(authError) : 
                      (authContextError ? formatErrorMessage(authContextError) : null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="fixed inset-0 z-[-1]">
        <SparklesBackground className="absolute inset-0 opacity-50" />
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Back to Home */}
        <div className="absolute top-4 left-4">
          <Link href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FiArrowLeft size={18} />
            <span>Back to Home</span>
          </Link>
        </div>
        
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-2">
              <FiCloud className="text-blue-600 text-3xl mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">CloudCertify</h1>
            </div>
            <p className="text-gray-600">Log in to your account</p>
          </div>

          {/* Error message */}
          {displayError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
              <FiAlertCircle className="mt-0.5 flex-shrink-0" />
              <p>{displayError}</p>
            </div>
          )}
          
          {/* Login form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  className={`block w-full pl-10 pr-3 py-2.5 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="you@example.com"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`block w-full pl-10 pr-10 py-2.5 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FiEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            
            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  'Log in'
                )}
              </button>
            </div>
          </form>
          
          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
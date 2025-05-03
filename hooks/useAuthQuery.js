import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  verifyAuth,
  getUserSession,
  updateUserProfile
} from '../lib/client/authService';

/**
 * Hook for verifying authentication status
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export function useVerifyAuth(options = {}) {
  return useQuery({
    queryKey: ['auth', 'verify'],
    queryFn: verifyAuth,
    select: (data) => data.success ? data.data : null,
    // Authentication state shouldn't be considered stale too quickly
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Hook for fetching current user session data
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export function useUserSession(options = {}) {
  return useQuery({
    queryKey: ['auth', 'session'],
    queryFn: getUserSession,
    select: (data) => data.success ? data.data : null,
    // Session data should be fairly fresh
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Hook for updating user profile
 * @returns {Object} Mutation result
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (profileData) => updateUserProfile(profileData),
    onSuccess: () => {
      // Invalidate user session data after profile update
      queryClient.invalidateQueries({ queryKey: ['auth', 'session'] });
    },
  });
}

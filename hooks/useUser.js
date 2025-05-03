import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserProfile,
  updateUserProfile,
  getUserStatistics,
  getUserSettings,
  updateUserSettings
} from '../lib/client/userService';

/**
 * Hook for fetching user profile data
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export function useUserProfile(options = {}) {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    select: (data) => data.success ? data.data : null,
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
      // Invalidate user profile query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}

/**
 * Hook for fetching user statistics
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export function useUserStatistics(options = {}) {
  return useQuery({
    queryKey: ['userStatistics'],
    queryFn: getUserStatistics,
    select: (data) => data.success ? data.data : null,
    ...options,
  });
}

/**
 * Hook for fetching user settings
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export function useUserSettings(options = {}) {
  return useQuery({
    queryKey: ['userSettings'],
    queryFn: getUserSettings,
    select: (data) => data.success ? data.data : null,
    ...options,
  });
}

/**
 * Hook for updating user settings
 * @returns {Object} Mutation result
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (settings) => updateUserSettings(settings),
    onSuccess: () => {
      // Invalidate user settings query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
  });
}

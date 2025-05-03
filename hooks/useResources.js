import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getResources,
  getResourceById,
  getResourceCategories,
  getResourceTags,
  saveResource,
  unsaveResource
} from '../lib/client/resourceService';

/**
 * Hook for fetching resources with optional filtering
 * @param {Object} params - Query parameters for filtering resources
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export function useResources(params = {}, options = {}) {
  return useQuery({
    queryKey: ['resources', params],
    queryFn: () => getResources(params),
    select: (data) => data.success ? data.data : null,
    ...options,
  });
}

/**
 * Hook for fetching a specific resource by ID
 * @param {string} resourceId - ID of the resource to fetch
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export function useResource(resourceId, options = {}) {
  return useQuery({
    queryKey: ['resource', resourceId],
    queryFn: () => getResourceById(resourceId),
    select: (data) => data.success ? data.data : null,
    enabled: !!resourceId,
    ...options,
  });
}

/**
 * Hook for fetching resource categories
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export function useResourceCategories(options = {}) {
  return useQuery({
    queryKey: ['resourceCategories'],
    queryFn: getResourceCategories,
    select: (data) => data.success ? data.data : null,
    staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change often
    ...options,
  });
}

/**
 * Hook for fetching resource tags
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export function useResourceTags(options = {}) {
  return useQuery({
    queryKey: ['resourceTags'],
    queryFn: getResourceTags,
    select: (data) => data.success ? data.data : null,
    staleTime: 10 * 60 * 1000, // 10 minutes - tags don't change often
    ...options,
  });
}

/**
 * Hook for saving a resource
 * @returns {Object} Mutation result
 */
export function useSaveResource() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (resourceId) => saveResource(resourceId),
    onSuccess: (data, resourceId) => {
      // Invalidate specific resource and potentially user's saved resources
      queryClient.invalidateQueries({ queryKey: ['resource', resourceId] });
      queryClient.invalidateQueries({ queryKey: ['resources', { saved: true }] });
    },
  });
}

/**
 * Hook for unsaving a resource
 * @returns {Object} Mutation result
 */
export function useUnsaveResource() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (resourceId) => unsaveResource(resourceId),
    onSuccess: (data, resourceId) => {
      // Invalidate specific resource and potentially user's saved resources
      queryClient.invalidateQueries({ queryKey: ['resource', resourceId] });
      queryClient.invalidateQueries({ queryKey: ['resources', { saved: true }] });
    },
  });
}

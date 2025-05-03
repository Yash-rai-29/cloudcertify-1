import { useQuery } from '@tanstack/react-query';
import {
  getLeaderboard,
  getDashboardStats
} from '../lib/client/dashboardService';

/**
 * Hook for fetching leaderboard data
 * @param {number} limit - Number of users to show in leaderboard
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export function useLeaderboard(limit = 20, options = {}) {
  return useQuery({
    queryKey: ['leaderboard', limit],
    queryFn: () => getLeaderboard(limit),
    select: (data) => data.success ? data.data : null,
    // Keep cached data fairly fresh for leaderboard
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Hook for fetching dashboard statistics
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export function useDashboardStats(options = {}) {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => getDashboardStats(),
    select: (data) => data.success ? data.data : null,
    // Keep cached data fairly fresh
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

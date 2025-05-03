import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTests,
  startTestAttempt,
  getTestDetails,
  getTestAttempt,
  finishTestAttempt,
  submitAnswer
} from '../lib/client/testService';

/**
 * Hook for fetching a list of tests with optional filtering
 * @param {Object} params - Query parameters for filtering tests
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export function useTests(params = {}, options = {}) {
  return useQuery({
    queryKey: ['tests', params],
    queryFn: () => fetchTests(params),
    select: (data) => data.success ? data.data : null,
    ...options,
  });
}

/**
 * Hook for fetching a specific test's details
 * @param {string} testId - ID of the test to fetch
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export function useTestDetails(testId, options = {}) {
  return useQuery({
    queryKey: ['test', testId],
    queryFn: () => getTestDetails(testId),
    select: (data) => data.success ? data.data : null,
    enabled: !!testId,
    ...options,
  });
}

/**
 * Hook for fetching a test attempt
 * @param {string} attemptId - ID of the test attempt
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export function useTestAttempt(attemptId, options = {}) {
  return useQuery({
    queryKey: ['testAttempt', attemptId],
    queryFn: () => getTestAttempt(attemptId),
    select: (data) => data.success ? data.data : null,
    enabled: !!attemptId,
    ...options,
  });
}

/**
 * Hook for starting a test attempt
 * @returns {Object} Mutation result
 */
export function useStartTestAttempt() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ testId, mode }) => startTestAttempt(testId, mode),
    onSuccess: (data, { testId }) => {
      // Invalidate relevant queries when a new test attempt is started
      queryClient.invalidateQueries({ queryKey: ['test', testId] });
      queryClient.invalidateQueries({ queryKey: ['tests'] });
    },
  });
}

/**
 * Hook for submitting an answer in a test
 * @returns {Object} Mutation result
 */
export function useSubmitAnswer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ attemptId, answerData }) => submitAnswer(attemptId, answerData),
    onSuccess: (data, { attemptId }) => {
      // Invalidate the specific test attempt when an answer is submitted
      queryClient.invalidateQueries({ queryKey: ['testAttempt', attemptId] });
    },
  });
}

/**
 * Hook for finishing a test attempt
 * @returns {Object} Mutation result
 */
export function useFinishTestAttempt() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (attemptId) => finishTestAttempt(attemptId),
    onSuccess: (data, attemptId) => {
      // Invalidate relevant queries when a test is finished
      queryClient.invalidateQueries({ queryKey: ['testAttempt', attemptId] });
      queryClient.invalidateQueries({ queryKey: ['tests'] });
      queryClient.invalidateQueries({ queryKey: ['testHistory'] });
    },
  });
}

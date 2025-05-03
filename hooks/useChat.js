import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getChatHistory,
  sendChatMessage
} from '../lib/client/chatService';

/**
 * Hook for fetching chat history
 * @param {Object} params - Query parameters
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export function useChatHistory(params = {}, options = {}) {
  return useQuery({
    queryKey: ['chatHistory', params],
    queryFn: () => getChatHistory(params),
    select: (data) => data.success ? data.data : { messages: [] },
    ...options,
  });
}

/**
 * Hook for sending chat messages
 * @returns {Object} Mutation result with send function
 */
export function useSendChatMessage() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (messageData) => sendChatMessage(messageData),
    onSuccess: () => {
      // Invalidate chat history to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
    },
  });
  
  // Return the mutation with a simpler send function
  return {
    ...mutation,
    sendMessage: (message, context) => {
      return mutation.mutate({ message, context });
    }
  };
}

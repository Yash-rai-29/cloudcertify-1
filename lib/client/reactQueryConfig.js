/**
 * React Query configuration
 * Provides centralized setup for TanStack Query
 */
import React, { useState } from 'react';
import { 
  QueryClient, 
  QueryClientProvider 
} from '@tanstack/react-query';
import dynamic from 'next/dynamic';

// Dynamically import DevTools with SSR disabled
const ReactQueryDevtools = dynamic(
  () => import('@tanstack/react-query-devtools').then(mod => mod.ReactQueryDevtools),
  { ssr: false }
);

// Configure default query client options
export const queryClientOptions = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
};

/**
 * React Query Provider Component
 * Wraps the application with the QueryClientProvider
 */
export function ReactQueryProvider({ children }) {
  // Create a new QueryClient for each browser page load to avoid shared cache between users 
  const [queryClient] = useState(() => new QueryClient(queryClientOptions));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools will only be included in client-side bundle */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

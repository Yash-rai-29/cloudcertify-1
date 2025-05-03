/**
 * React Query configuration with client-side only components
 * This version correctly handles server-side rendering
 */
import React, { useState } from 'react';
import { 
  QueryClient, 
  QueryClientProvider 
} from '@tanstack/react-query';
import dynamic from 'next/dynamic';

// Configure default query client options
const queryClientOptions = {
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

// Dynamically import DevTools with SSR disabled
const ReactQueryDevtools = dynamic(
  () => import('@tanstack/react-query-devtools').then(mod => mod.ReactQueryDevtools),
  { ssr: false }
);

/**
 * React Query Provider Component with per-request QueryClient
 */
export function ReactQueryProvider({ children }) {
  // Create a new QueryClient for each browser page load
  // This avoids shared cache between different users
  const [queryClient] = useState(() => new QueryClient(queryClientOptions));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

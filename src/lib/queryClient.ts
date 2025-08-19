import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry failed queries once
      retry: 1,
      // Refetch whenever the window is refocused
      refetchOnWindowFocus: true,
      // Refetch on reconnect (e.g. if the network drops and comes back)
      refetchOnReconnect: true,
      // Optional: keep data fresh for N milliseconds before marking stale
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});

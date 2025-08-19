import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export function useFetch<TData>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, Error, TData>, "queryKey" | "queryFn">
) {
  return useQuery<TData, Error>({
    queryKey,
    queryFn,
    ...options,
  });
}

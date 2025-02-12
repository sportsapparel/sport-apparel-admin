"use client";

import { useState, useEffect, useCallback } from "react";

export type FetchFunction<T> = () => Promise<T>;

interface UseFetchDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useFetchData<T>(
  fetchFn: FetchFunction<T>,
  options?: {
    initialData?: T | null;
    enabled?: boolean;
  }
): UseFetchDataResult<T> {
  const [data, setData] = useState<T | null>(options?.initialData ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    if (options?.enabled !== false) {
      fetch();
    }
  }, [fetch, options?.enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetch,
  };
}

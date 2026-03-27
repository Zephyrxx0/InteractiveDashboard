'use client';

import { useState, useEffect } from 'react';
import { 
  subscribeToTasks, 
  subscribeToAnalytics, 
  subscribeToProjectTasks,
  type AnalyticsData 
} from '@/lib/firebase-data';
import type { Task } from '@/types/task';

export interface UseRealtimeDataOptions {
  /** Allow disabling for mock mode or testing */
  enabled?: boolean;
}

export interface UseRealtimeTasksResult {
  tasks: Task[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook for real-time task data from Firebase
 * Automatically cleans up listener on unmount
 * 
 * @param options - Configuration options
 * @returns Object with tasks array, loading state, and error
 */
export function useRealtimeTasks(
  options: UseRealtimeDataOptions = {}
): UseRealtimeTasksResult {
  const { enabled = true } = options;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToTasks((newTasks) => {
      setTasks(newTasks);
      setLoading(false);
    });

    // If Firebase not initialized, unsubscribe will be null
    if (!unsubscribe) {
      setLoading(false);
      return;
    }

    // CRITICAL: Cleanup listener on unmount (addresses Pitfall #10)
    return () => {
      unsubscribe();
    };
  }, [enabled]);

  return { tasks, loading, error };
}

export interface UseRealtimeAnalyticsResult {
  data: AnalyticsData | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook for real-time analytics data from Firebase
 * Returns aggregated analytics metrics that update in real-time
 * 
 * @param options - Configuration options
 * @returns Object with analytics data, loading state, and error
 */
export function useRealtimeAnalytics(
  options: UseRealtimeDataOptions = {}
): UseRealtimeAnalyticsResult {
  const { enabled = true } = options;
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToAnalytics((newData) => {
      setData(newData);
      setLoading(false);
    });

    // If Firebase not initialized, unsubscribe will be null
    if (!unsubscribe) {
      setLoading(false);
      return;
    }

    // CRITICAL: Cleanup listener on unmount
    return () => {
      unsubscribe();
    };
  }, [enabled]);

  return { data, loading, error };
}

export interface UseProjectTasksResult {
  tasks: Task[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook for real-time tasks filtered by project
 * 
 * @param projectId - The project ID to filter tasks by
 * @param options - Configuration options
 * @returns Object with filtered tasks array, loading state, and error
 */
export function useProjectTasks(
  projectId: string,
  options: UseRealtimeDataOptions = {}
): UseProjectTasksResult {
  const { enabled = true } = options;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled || !projectId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToProjectTasks(projectId, (newTasks) => {
      setTasks(newTasks);
      setLoading(false);
    });

    // If Firebase not initialized, unsubscribe will be null
    if (!unsubscribe) {
      setLoading(false);
      return;
    }

    // CRITICAL: Cleanup listener on unmount
    return () => {
      unsubscribe();
    };
  }, [projectId, enabled]);

  return { tasks, loading, error };
}

// Re-export AnalyticsData type for consumers
export type { AnalyticsData } from '@/lib/firebase-data';

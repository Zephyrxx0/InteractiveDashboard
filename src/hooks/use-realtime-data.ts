'use client';

import { useSyncExternalStore, useCallback } from 'react';
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

// Cache for tasks data to prevent unnecessary re-subscriptions
let tasksCache: Task[] = [];
let tasksLoading = true;
let tasksListeners = new Set<() => void>();

function subscribeToTasksStore(callback: () => void) {
  tasksListeners.add(callback);
  
  // Start subscription if this is the first listener
  if (tasksListeners.size === 1) {
    const unsubscribe = subscribeToTasks((newTasks) => {
      tasksCache = newTasks;
      tasksLoading = false;
      tasksListeners.forEach(listener => listener());
    });
    
    // Handle case where Firebase is not initialized
    if (!unsubscribe) {
      tasksLoading = false;
    }
    
    return () => {
      tasksListeners.delete(callback);
      if (tasksListeners.size === 0 && unsubscribe) {
        unsubscribe();
        tasksCache = [];
        tasksLoading = true;
      }
    };
  }
  
  return () => {
    tasksListeners.delete(callback);
  };
}

function getTasksSnapshot() {
  return tasksCache;
}

function getTasksLoadingSnapshot() {
  return tasksLoading;
}

/**
 * Hook for real-time task data from Firebase
 * Automatically cleans up listener on unmount
 * Uses useSyncExternalStore for React Compiler compatibility
 * 
 * @param options - Configuration options
 * @returns Object with tasks array, loading state, and error
 */
export function useRealtimeTasks(
  options: UseRealtimeDataOptions = {}
): UseRealtimeTasksResult {
  const { enabled = true } = options;
  
  const tasks = useSyncExternalStore(
    subscribeToTasksStore,
    getTasksSnapshot,
    () => [] // Server snapshot
  );
  
  const loading = useSyncExternalStore(
    subscribeToTasksStore,
    getTasksLoadingSnapshot,
    () => true // Server snapshot
  );
  
  // If disabled, return empty state
  if (!enabled) {
    return { tasks: [], loading: false, error: null };
  }
  
  return { tasks, loading, error: null };
}

export interface UseRealtimeAnalyticsResult {
  data: AnalyticsData | null;
  loading: boolean;
  error: Error | null;
}

// Cache for analytics data
let analyticsCache: AnalyticsData | null = null;
let analyticsLoading = true;
let analyticsListeners = new Set<() => void>();

function subscribeToAnalyticsStore(callback: () => void) {
  analyticsListeners.add(callback);
  
  if (analyticsListeners.size === 1) {
    const unsubscribe = subscribeToAnalytics((newData) => {
      analyticsCache = newData;
      analyticsLoading = false;
      analyticsListeners.forEach(listener => listener());
    });
    
    if (!unsubscribe) {
      analyticsLoading = false;
    }
    
    return () => {
      analyticsListeners.delete(callback);
      if (analyticsListeners.size === 0 && unsubscribe) {
        unsubscribe();
        analyticsCache = null;
        analyticsLoading = true;
      }
    };
  }
  
  return () => {
    analyticsListeners.delete(callback);
  };
}

function getAnalyticsSnapshot() {
  return analyticsCache;
}

function getAnalyticsLoadingSnapshot() {
  return analyticsLoading;
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
  
  const data = useSyncExternalStore(
    subscribeToAnalyticsStore,
    getAnalyticsSnapshot,
    () => null // Server snapshot
  );
  
  const loading = useSyncExternalStore(
    subscribeToAnalyticsStore,
    getAnalyticsLoadingSnapshot,
    () => true // Server snapshot
  );
  
  if (!enabled) {
    return { data: null, loading: false, error: null };
  }
  
  return { data, loading, error: null };
}

export interface UseProjectTasksResult {
  tasks: Task[];
  loading: boolean;
  error: Error | null;
}

// Project tasks cache - keyed by projectId
const projectTasksCaches = new Map<string, {
  tasks: Task[];
  loading: boolean;
  listeners: Set<() => void>;
  unsubscribe: (() => void) | null;
}>();

function getOrCreateProjectCache(projectId: string) {
  if (!projectTasksCaches.has(projectId)) {
    projectTasksCaches.set(projectId, {
      tasks: [],
      loading: true,
      listeners: new Set(),
      unsubscribe: null,
    });
  }
  return projectTasksCaches.get(projectId)!;
}

function createProjectSubscribe(projectId: string) {
  return (callback: () => void) => {
    const cache = getOrCreateProjectCache(projectId);
    cache.listeners.add(callback);
    
    // Start subscription if this is the first listener
    if (cache.listeners.size === 1 && !cache.unsubscribe) {
      cache.unsubscribe = subscribeToProjectTasks(projectId, (newTasks) => {
        cache.tasks = newTasks;
        cache.loading = false;
        cache.listeners.forEach(listener => listener());
      });
      
      // Handle case where Firebase is not initialized
      if (!cache.unsubscribe) {
        cache.loading = false;
      }
    }
    
    return () => {
      cache.listeners.delete(callback);
      if (cache.listeners.size === 0 && cache.unsubscribe) {
        cache.unsubscribe();
        projectTasksCaches.delete(projectId);
      }
    };
  };
}

/**
 * Hook for real-time tasks filtered by project
 * Uses useSyncExternalStore for React Compiler compatibility
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
  
  // Create stable subscribe function for this projectId
  const subscribe = useCallback(
    (callback: () => void) => createProjectSubscribe(projectId)(callback),
    [projectId]
  );
  
  const getSnapshot = useCallback(() => {
    const cache = projectTasksCaches.get(projectId);
    return cache?.tasks ?? [];
  }, [projectId]);
  
  const getLoadingSnapshot = useCallback(() => {
    const cache = projectTasksCaches.get(projectId);
    return cache?.loading ?? true;
  }, [projectId]);
  
  const tasks = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => [] // Server snapshot
  );
  
  const loading = useSyncExternalStore(
    subscribe,
    getLoadingSnapshot,
    () => true // Server snapshot
  );
  
  if (!enabled || !projectId) {
    return { tasks: [], loading: false, error: null };
  }
  
  return { tasks, loading, error: null };
}

// Re-export AnalyticsData type for consumers
export type { AnalyticsData } from '@/lib/firebase-data';

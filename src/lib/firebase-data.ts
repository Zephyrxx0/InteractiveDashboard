'use client';

import { 
  getFirestore, 
  collection, 
  query, 
  onSnapshot, 
  where,
  type Unsubscribe, 
  type QueryConstraint,
  type Firestore
} from 'firebase/firestore';
import type { Task } from '@/types/task';
import { app } from './firebase';

// Get Firestore instance (lazy init)
let db: Firestore | null = null;

function getDb(): Firestore | null {
  if (!db && app) {
    db = getFirestore(app);
  }
  return db;
}

/**
 * Analytics data shape returned from Firestore
 */
export interface AnalyticsData {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  tasksByDay: Array<{ date: string; completed: number; created: number }>;
  tasksByAssignee: Array<{ name: string; count: number }>;
  tasksByStatus: Array<{ status: string; count: number }>;
}

/**
 * Subscribe to tasks collection with optional filters
 * CRITICAL: Always call the returned unsubscribe function in useEffect cleanup
 * 
 * @param callback - Function called with updated tasks array
 * @param constraints - Optional Firestore query constraints (where, orderBy, limit)
 * @returns Unsubscribe function or null if Firebase not initialized
 */
export function subscribeToTasks(
  callback: (tasks: Task[]) => void,
  constraints?: QueryConstraint[]
): Unsubscribe | null {
  const firestore = getDb();
  if (!firestore) {
    console.warn('Firebase not initialized, using mock data');
    return null;
  }
  
  const tasksRef = collection(firestore, 'tasks');
  const q = constraints ? query(tasksRef, ...constraints) : query(tasksRef);
  
  return onSnapshot(
    q, 
    (snapshot) => {
      const tasks = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name ?? '',
          description: data.description,
          status: data.status ?? 'todo',
          assignee: data.assignee,
          dueDate: data.dueDate?.toDate() ?? null,
          createdAt: data.createdAt?.toDate() ?? new Date(),
          updatedAt: data.updatedAt?.toDate() ?? new Date(),
          tags: data.tags,
          projectId: data.projectId,
        } as Task;
      });
      callback(tasks);
    }, 
    (error) => {
      console.error('Tasks subscription error:', error);
    }
  );
}

/**
 * Subscribe to analytics aggregates
 * Uses a separate 'analytics' collection for pre-aggregated data
 * 
 * @param callback - Function called with updated analytics data
 * @returns Unsubscribe function or null if Firebase not initialized
 */
export function subscribeToAnalytics(
  callback: (data: AnalyticsData) => void
): Unsubscribe | null {
  const firestore = getDb();
  if (!firestore) {
    console.warn('Firebase not initialized, analytics will use mock data');
    return null;
  }
  
  const analyticsRef = collection(firestore, 'analytics');
  const q = query(analyticsRef);
  
  return onSnapshot(
    q,
    (snapshot) => {
      // Aggregate data from analytics documents
      // In production, this might be a single pre-aggregated document
      if (snapshot.docs.length > 0) {
        const doc = snapshot.docs[0];
        const data = doc.data();
        callback({
          totalTasks: data.totalTasks ?? 0,
          completedTasks: data.completedTasks ?? 0,
          inProgressTasks: data.inProgressTasks ?? 0,
          overdueTasks: data.overdueTasks ?? 0,
          tasksByDay: data.tasksByDay ?? [],
          tasksByAssignee: data.tasksByAssignee ?? [],
          tasksByStatus: data.tasksByStatus ?? [],
        });
      }
    },
    (error) => {
      console.error('Analytics subscription error:', error);
    }
  );
}

/**
 * Subscribe to tasks for a specific project
 * 
 * @param projectId - The project ID to filter by
 * @param callback - Function called with updated tasks array
 * @returns Unsubscribe function or null if Firebase not initialized
 */
export function subscribeToProjectTasks(
  projectId: string,
  callback: (tasks: Task[]) => void
): Unsubscribe | null {
  const firestore = getDb();
  if (!firestore) {
    console.warn('Firebase not initialized, using mock data');
    return null;
  }
  
  const tasksRef = collection(firestore, 'tasks');
  const q = query(tasksRef, where('projectId', '==', projectId));
  
  return onSnapshot(
    q,
    (snapshot) => {
      const tasks = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name ?? '',
          description: data.description,
          status: data.status ?? 'todo',
          assignee: data.assignee,
          dueDate: data.dueDate?.toDate() ?? null,
          createdAt: data.createdAt?.toDate() ?? new Date(),
          updatedAt: data.updatedAt?.toDate() ?? new Date(),
          tags: data.tags,
          projectId: data.projectId,
        } as Task;
      });
      callback(tasks);
    },
    (error) => {
      console.error('Project tasks subscription error:', error);
    }
  );
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, getTask, createTask, updateTask, deleteTask } from '@/lib/db/tasks';
import type { Database } from '@/types/database';

type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

export function useTasks(projectId?: string) {
    return useQuery({
        queryKey: projectId ? ['tasks', { projectId }] : ['tasks'],
        queryFn: () => getTasks(projectId),
    });
}

export function useTask(id: string) {
    return useQuery({
        queryKey: ['task', id],
        queryFn: () => getTask(id),
        enabled: !!id,
    });
}

export function useCreateTask(projectId?: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newTask: TaskInsert) => createTask(newTask),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            if (projectId) {
                queryClient.invalidateQueries({ queryKey: ['tasks', { projectId }] });
            }
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: TaskUpdate }) => updateTask(id, updates),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['task', variables.id] });
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteTask(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.removeQueries({ queryKey: ['task', id] });
        },
    });
}

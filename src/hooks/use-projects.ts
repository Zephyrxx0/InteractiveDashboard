import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjects, getProject, createProject, updateProject, deleteProject } from '@/lib/db/projects';
import type { Database } from '@/types/database';

type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export function useProjects() {
    return useQuery({
        queryKey: ['projects'],
        queryFn: getProjects,
    });
}

export function useProject(id: string) {
    return useQuery({
        queryKey: ['project', id],
        queryFn: () => getProject(id),
        enabled: !!id,
    });
}

export function useCreateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newProject: ProjectInsert) => createProject(newProject),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
}

export function useUpdateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: ProjectUpdate }) => updateProject(id, updates),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['project', variables.id] });
        },
    });
}

export function useDeleteProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteProject(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.removeQueries({ queryKey: ['project', id] });
        },
    });
}

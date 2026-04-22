import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getIncidents, 
    getProjectIncidents, 
    getIncident, 
    createIncident, 
    updateIncident, 
    deleteIncident 
} from '@/lib/db/incidents';
import type { Database } from '@/types/database';

type IncidentInsert = Database['public']['Tables']['incidents']['Insert'];
type IncidentUpdate = Database['public']['Tables']['incidents']['Update'];

export function useIncidents() {
    return useQuery({
        queryKey: ['incidents'],
        queryFn: getIncidents,
    });
}

export function useProjectIncidents(projectId: string) {
    return useQuery({
        queryKey: ['incidents', projectId],
        queryFn: () => getProjectIncidents(projectId),
        enabled: !!projectId,
    });
}

export function useIncident(id: string) {
    return useQuery({
        queryKey: ['incident', id],
        queryFn: () => getIncident(id),
        enabled: !!id,
    });
}

export function useCreateIncident() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newIncident: IncidentInsert) => createIncident(newIncident),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['incidents'] });
        },
    });
}

export function useUpdateIncident() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: IncidentUpdate }) => updateIncident(id, updates),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['incidents'] });
            queryClient.invalidateQueries({ queryKey: ['incident', variables.id] });
            if (variables.updates.project_id) {
                queryClient.invalidateQueries({ queryKey: ['incidents', variables.updates.project_id] });
            }
        },
    });
}

export function useDeleteIncident() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteIncident(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['incidents'] });
            queryClient.removeQueries({ queryKey: ['incident', id] });
        },
    });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjectLocations, getProjectLocation, upsertProjectLocation, deleteProjectLocation } from '@/lib/db/locations';
import type { Database } from '@/types/database';

type LocationInsert = Database['public']['Tables']['project_locations']['Insert'];

export function useLocations() {
    return useQuery({
        queryKey: ['project_locations'],
        queryFn: getProjectLocations,
    });
}

export function useProjectLocation(projectId: string) {
    return useQuery({
        queryKey: ['project_location', projectId],
        queryFn: () => getProjectLocation(projectId),
        enabled: !!projectId,
    });
}

export function useUpsertLocation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (location: LocationInsert) => upsertProjectLocation(location),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['project_locations'] });
            queryClient.invalidateQueries({ queryKey: ['project_location', variables.project_id] });
        },
    });
}

export function useDeleteLocation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (projectId: string) => deleteProjectLocation(projectId),
        onSuccess: (_, projectId) => {
            queryClient.invalidateQueries({ queryKey: ['project_locations'] });
            queryClient.removeQueries({ queryKey: ['project_location', projectId] });
        },
    });
}

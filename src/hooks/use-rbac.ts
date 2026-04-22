import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useRBAC(projectId?: string) {
    const { user } = useAuth();

    const { data: profile } = useQuery({
        queryKey: ['profile', user?.uid],
        queryFn: async () => {
            if (!user) return null;
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.uid)
                .single();
            if (error) return null;
            return data;
        },
        enabled: !!user,
    });

    const { data: projectMembership } = useQuery({
        queryKey: ['project-membership', user?.uid, projectId],
        queryFn: async () => {
            if (!user || !projectId) return null;
            const { data, error } = await supabase
                .from('project_members')
                .select('*')
                .eq('project_id', projectId)
                .eq('profile_id', user.uid)
                .single();
            if (error) return null;
            return data;
        },
        enabled: !!user && !!projectId,
    });

    const isAdmin = profile?.role === 'admin';
    const isProjectLead = isAdmin || projectMembership?.role === 'lead';
    const isMember = !!profile;

    return {
        role: profile?.role,
        isAdmin,
        isProjectLead,
        isMember,
        isLoading: !profile && !!user
    };
}

import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type LocationRow = Database['public']['Tables']['project_locations']['Row'];
type LocationInsert = Database['public']['Tables']['project_locations']['Insert'];
type LocationUpdate = Database['public']['Tables']['project_locations']['Update'];

export async function getProjectLocations(): Promise<LocationRow[]> {
    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                   process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-instance');

    if (isMock) {
        return [
            {
                id: 'loc-01',
                project_id: 'WTR-2024-882',
                latitude: -15.7801,
                longitude: -47.9292,
                pincode: '70000-000',
                city: 'Brasília',
                state: 'DF',
                country: 'Brazil',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            } as any
        ];
    }

    const { data, error } = await supabase
        .from('project_locations')
        .select('*');

    if (error) throw error;
    return data || [];
}

export async function getProjectLocation(projectId: string): Promise<LocationRow | null> {
    const { data, error } = await supabase
        .from('project_locations')
        .select('*')
        .eq('project_id', projectId)
        .maybeSingle();
        
    if (error) throw error;
    return data;
}

export async function upsertProjectLocation(location: LocationInsert): Promise<LocationRow> {
    const { data, error } = await supabase
        .from('project_locations')
        .upsert(location, { onConflict: 'project_id' })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteProjectLocation(projectId: string): Promise<void> {
    const { error } = await supabase
        .from('project_locations')
        .delete()
        .eq('project_id', projectId);

    if (error) throw error;
}

import { supabase } from '../supabase';
import type { Database } from '@/types/database';

export type Incident = Database['public']['Tables']['incidents']['Row'];
export type IncidentInsert = Database['public']['Tables']['incidents']['Insert'];
export type IncidentUpdate = Database['public']['Tables']['incidents']['Update'];

export async function getIncidents() {
    const { data, error } = await supabase
        .from('incidents')
        .select(`
            *,
            projects (
                name
            )
        `)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getProjectIncidents(projectId: string) {
    const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getIncident(id: string) {
    const { data, error } = await supabase
        .from('incidents')
        .select(`
            *,
            projects (
                name
            )
        `)
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

export async function createIncident(incident: IncidentInsert) {
    const { data, error } = await supabase
        .from('incidents')
        .insert(incident)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateIncident(id: string, updates: IncidentUpdate) {
    const { data, error } = await supabase
        .from('incidents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteIncident(id: string) {
    const { error } = await supabase
        .from('incidents')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

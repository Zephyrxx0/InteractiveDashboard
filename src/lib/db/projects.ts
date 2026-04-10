import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type ProjectRow = Database['public']['Tables']['projects']['Row'];
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export async function getProjects(): Promise<ProjectRow[]> {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function getProject(id: string): Promise<ProjectRow | null> {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
        
    if (error) {
        if (error.code === 'PGRST116') return null; // PostgREST exact 1 row error
        throw error;
    }
    return data;
}

export async function createProject(project: ProjectInsert): Promise<ProjectRow> {
    const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateProject(id: string, updates: ProjectUpdate): Promise<ProjectRow> {
    const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteProject(id: string): Promise<void> {
    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

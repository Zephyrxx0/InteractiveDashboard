import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type TaskRow = Database['public']['Tables']['tasks']['Row'];
type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

export async function getTasks(projectId?: string): Promise<TaskRow[]> {
    let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });
    
    if (projectId) {
        query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
}

export async function getTask(id: string): Promise<TaskRow | null> {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();
        
    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    return data;
}

export async function createTask(task: TaskInsert): Promise<TaskRow> {
    const { data, error } = await supabase
        .from('tasks')
        .insert(task)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateTask(id: string, updates: TaskUpdate): Promise<TaskRow> {
    const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteTask(id: string): Promise<void> {
    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

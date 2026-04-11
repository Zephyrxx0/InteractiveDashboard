import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type TaskRow = Database['public']['Tables']['tasks']['Row'];
type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

export async function getTasks(projectId?: string): Promise<TaskRow[]> {
    // Fallback for development if Supabase is not configured
    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                   process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-instance');

    if (isMock) {
        return [
            {
                id: '1',
                title: 'Installation of Water Pumps - Sector A',
                status: 'in-progress',
                priority: 'High',
                project_id: projectId || 'WTR-2024-882',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                description: 'Deploying solar-powered pumps for phase 1 completion.'
            },
            {
                id: '2',
                title: 'Community Training Workshop',
                status: 'todo',
                priority: 'Medium',
                project_id: projectId || 'WTR-2024-882',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                description: 'Maintenance training for local technicians.'
            },
            {
                id: '3',
                title: 'Water Quality Sensor Calibration',
                status: 'done',
                priority: 'Low',
                project_id: projectId || 'WTR-2024-882',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                description: 'Final calibration of the IoT sensor array.'
            }
        ] as any[];
    }

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

import { supabase } from '../supabase';

export async function associateDocumentWithProject(mediaFileId: string, projectId: string) {
    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                   process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-instance');

    if (isMock) {
        console.log('Mock: Associated document with project', { mediaFileId, projectId });
        return;
    }

    const { error } = await supabase
        .from('project_documents')
        .insert({
            project_id: projectId,
            media_file_id: mediaFileId,
            created_at: new Date().toISOString()
        });
        
    if (error) {
        // Fallback: If table doesn't exist, we might need to create it or 
        // handle it gracefully. In a real environment, I'd run a migration.
        console.error('Failed to associate document:', error);
        throw error;
    }
}

export async function getProjectDocuments(projectId: string) {
    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                   process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-instance');

    if (isMock) {
        return [];
    }

    const { data, error } = await supabase
        .from('project_documents')
        .select(`
            *,
            media_files (*)
        `)
        .eq('project_id', projectId);
        
    if (error) throw error;
    return data;
}

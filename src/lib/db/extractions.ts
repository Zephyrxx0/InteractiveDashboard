import { supabase } from '../supabase';

export async function updateExtractionStatus(id: string, status: string, result?: any) {
  const { error } = await supabase
    .from('extractions')
    .update({ 
      status, 
      result: result || {},
      updated_at: new Date().toISOString()
    })
    .eq('id', id);
  if (error) throw error;
}

export async function getExtractionByMediaId(mediaFileId: string) {
  const { data, error } = await supabase
    .from('extractions')
    .select('*')
    .eq('media_file_id', mediaFileId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createExtraction(mediaFileId: string) {
  const { data, error } = await supabase
    .from('extractions')
    .insert({
      media_file_id: mediaFileId,
      status: 'pending',
      result: {},
    })
    .select()
    .single();
    if(error) throw error;
    return data;
}

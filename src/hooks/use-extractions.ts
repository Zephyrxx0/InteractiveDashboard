import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

export function useExtraction(id: string) {
  return useQuery({
    queryKey: ['extraction', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('extractions')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
    refetchInterval: (query) => {
        const data = query.state.data;
        if (data && (data as any).status === 'processing') return 2000;
        if (data && (data as any).status === 'pending') return 2000;
        return false;
    },
  });
}

export function useStartExtraction() {
  return useMutation({
    mutationFn: async (mediaFileId: string) => {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaFileId }),
      });
      if (!res.ok) {
        throw new Error('Failed to start extraction');
      }
      return res.json();
    },
  });
}

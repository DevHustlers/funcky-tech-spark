import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { getCompetitions } from '@/services/competitions.service';
import type { Tables } from '@/types/database';

export const useRealtimeCompetitions = () => {
  const queryClient = useQueryClient();

  const { data: competitions = [], isLoading: loading, error } = useQuery({
    queryKey: ['competitions'],
    queryFn: async () => {
      const { data, error } = await getCompetitions();
      if (error) throw new Error(error);
      return data || [];
    },
    staleTime: 60000, // Cache for 60 seconds as requested
  });

  useEffect(() => {
    const channel = supabase
      .channel('competitions-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'competitions',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['competitions'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { 
    competitions, 
    loading, 
    error: error instanceof Error ? error.message : null,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['competitions'] })
  };
};

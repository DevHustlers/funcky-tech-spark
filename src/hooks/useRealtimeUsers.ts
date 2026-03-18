import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { getUsers } from '@/services/users.service';
import type { Tables } from '@/types/database';

export const useRealtimeUsers = (includeDeleted: boolean = false) => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading: loading, error } = useQuery({
    queryKey: ['users', includeDeleted],
    queryFn: async () => {
      const { data, error } = await getUsers(includeDeleted);
      if (error) throw new Error(error);
      return data || [];
    },
    staleTime: 60000,
  });

  useEffect(() => {
    const channel = supabase
      .channel('users-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          console.log('Realtime event received: profile', payload.eventType);
          
          if (payload.eventType === 'INSERT') {
            const newUser = payload.new as Tables<'profiles'>;
            if (newUser.is_deleted && !includeDeleted) return; // Ignore if soft-deleted and we don't show them
            
            queryClient.setQueryData(['users', includeDeleted], (old: Tables<'profiles'>[] | undefined) => {
              const list = old || [];
              if (list.some(u => u.id === newUser.id)) return list;
              return [newUser, ...list];
            });
            // Also invalidate leaderboard if points exist
            queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
          } else if (payload.eventType === 'UPDATE') {
            const updatedUser = payload.new as Tables<'profiles'>;
            
            // Handle soft delete logic
            if (updatedUser.is_deleted && !includeDeleted) {
              queryClient.setQueryData(['users', includeDeleted], (old: Tables<'profiles'>[] | undefined) => {
                return (old || []).filter(u => u.id !== updatedUser.id);
              });
              queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
              return;
            }

            queryClient.setQueryData(['users', includeDeleted], (old: Tables<'profiles'>[] | undefined) => {
              const list = old || [];
              return list.map(u => u.id === updatedUser.id ? updatedUser : u);
            });
            // If points changed, invalidate leaderboard
            const oldUser = payload.old as Tables<'profiles'>;
            if (oldUser.points !== updatedUser.points) {
              queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
            }
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            queryClient.setQueryData(['users', includeDeleted], (old: Tables<'profiles'>[] | undefined) => {
              return (old || []).filter(u => u.id !== deletedId);
            });
            queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, includeDeleted]);

  return { 
    users, 
    loading, 
    error: error instanceof Error ? error.message : null,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  };
};

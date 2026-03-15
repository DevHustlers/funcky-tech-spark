import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/database';

export const useRealtimeProfiles = () => {
  const [profiles, setProfiles] = useState<Tables<'profiles'>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('points', { ascending: false });
      
      if (!error && data) {
        setProfiles(data);
      }
      setLoading(false);
    };

    fetchProfiles();

    // Set up realtime subscription
    const channel = supabase
      .channel('public:profiles')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProfiles((prev) => [payload.new as Tables<'profiles'>, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setProfiles((prev) =>
              prev.map((p) => (p.id === payload.new.id ? (payload.new as Tables<'profiles'>) : p))
            );
          } else if (payload.eventType === 'DELETE') {
            setProfiles((prev) => prev.filter((p) => p.id === payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { profiles, loading };
};

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getChallenges } from '@/services/challenges.service';
import type { Tables } from '@/types/database';

export const useRealtimeChallenges = () => {
  const [challenges, setChallenges] = useState<Tables<'challenges'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChallenges = async () => {
    const { data, error } = await getChallenges();
    if (error) {
      setError(error);
    } else if (data) {
      setChallenges(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChallenges();

    const channel = supabase
      .channel('challenges-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'challenges',
        },
        () => {
          fetchChallenges();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { challenges, loading, error, refresh: fetchChallenges };
};

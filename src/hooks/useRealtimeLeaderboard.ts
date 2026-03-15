import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getLeaderboard, type LeaderboardUser } from '@/services/leaderboard.service';

export const useRealtimeLeaderboard = (limit: number = 20) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    const { data, error } = await getLeaderboard(limit);
    if (error) {
      setError(error);
    } else if (data) {
      setLeaderboard(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();

    const channel = supabase
      .channel('leaderboard-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [limit]);

  return { leaderboard, loading, error, refresh: fetchLeaderboard };
};

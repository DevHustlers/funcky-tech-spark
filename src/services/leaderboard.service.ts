import { supabase } from '@/lib/supabase';
import type { Tables, ServiceResponse } from '@/types/database';

export interface LeaderboardUser extends Tables<'profiles'> {
  rank: number;
}

export const getLeaderboard = async (limit: number = 20): Promise<ServiceResponse<LeaderboardUser[]>> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('points', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const rankedData = (data || []).map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    return { data: rankedData, error: null };
  } catch (error: any) {
    console.error('Error in getLeaderboard:', error.message);
    return { data: null, error: error.message };
  }
};

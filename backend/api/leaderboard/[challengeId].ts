import { supabase } from '../../supabaseClient';

export default async function handler(req: any, res: any) {
  const { method, query: { challengeId } } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
  }

  if (!challengeId) {
    return res.status(400).json({ success: false, error: 'Challenge ID is required' });
  }

  try {
    // Get leaderboard entries for specific challenge, ordered by score descending
    // Note: We might want to join with a profiles table to get usernames/emails
    const { data, error } = await supabase
      .from('leaderboard')
      .select('user_id, score, updated_at')
      .eq('challenge_id', challengeId)
      .order('score', { ascending: false });

    if (error) throw error;

    // Add rank dynamically if not stored accurately enough
    const rankedData = data.map((entry: any, index: number) => ({
      ...entry,
      rank: index + 1
    }));

    return res.status(200).json({ success: true, data: rankedData });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
}

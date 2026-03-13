import { supabaseAdmin } from '../../supabaseClient';
import { authMiddleware } from '../../authMiddleware';
import { z } from 'zod';

const submissionSchema = z.object({
  challenge_id: z.string().uuid(),
  solution: z.string().min(1)
});

export default async function handler(req: any, res: any) {
  const { method } = req;

  switch (method) {
    case 'POST':
      return authMiddleware(req, res, async () => {
        try {
          const validation = submissionSchema.safeParse(req.body);
          if (!validation.success) {
            return res.status(400).json({ success: false, error: validation.error.errors });
          }

          const { challenge_id, solution } = validation.data;
          const user_id = req.user.id;

          // 1. Get challenge details to get points
          const { data: challenge, error: challengeError } = await supabaseAdmin
            .from('challenges')
            .select('points')
            .eq('id', challenge_id)
            .single();

          if (challengeError || !challenge) {
            return res.status(404).json({ success: false, error: 'Challenge not found' });
          }

          // 2. Simple mock grading logic (or you can expand this)
          // For now, we'll mark as 'pending' or 'accepted' based on some logic
          const status = 'accepted'; 
          const score = challenge.points;

          // 3. Create submission
          const { data: submission, error: submissionError } = await supabaseAdmin
            .from('submissions')
            .insert([{
              user_id,
              challenge_id,
              solution,
              score,
              status
            }])
            .select()
            .single();

          if (submissionError) throw submissionError;

          // 4. Update leaderboard
          const { error: leaderboardError } = await supabaseAdmin
            .from('leaderboard')
            .upsert({
              user_id,
              challenge_id,
              score,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id,challenge_id'
            });

          if (leaderboardError) {
              console.error('Leaderboard update error:', leaderboardError);
              // We don't necessarily want to fail the whole request if leaderboard update fails
          }

          return res.status(201).json({ success: true, data: submission });
        } catch (error: any) {
          return res.status(400).json({ success: false, error: error.message });
        }
      });
      
    case 'GET':
        // Optional: Get submissions for a challenge (if admin or if it's user's own)
        return authMiddleware(req, res, async () => {
             const { challengeId } = req.query;
             if (!challengeId) return res.status(400).json({ success: false, error: 'Challenge ID required' });
             
             // Check if admin
             const isAdmin = req.user.app_metadata?.role === 'admin' || req.user.user_metadata?.is_admin === true;
             
             let query = supabaseAdmin
                .from('submissions')
                .select('*, profiles(email)') // assuming profiles table exists
                .eq('challenge_id', challengeId);
                
             if (!isAdmin) {
                 query = query.eq('user_id', req.user.id);
             }
             
             const { data, error } = await query;
             if (error) return res.status(400).json({ success: false, error: error.message });
             return res.status(200).json({ success: true, data });
        });

    default:
      res.setHeader('Allow', ['POST', 'GET']);
      return res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
  }
}

import { supabase, supabaseAdmin } from '../../supabaseClient';
import { authMiddleware } from '../../authMiddleware';
import { adminMiddleware } from '../../adminMiddleware';
import { z } from 'zod';

const challengeSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  track: z.string().min(2),
  points: z.number().int().positive()
});

export default async function handler(req: any, res: any) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { data, error } = await supabase
          .from('challenges')
          .select('*')
          .eq('is_deleted', false);

        if (error) throw error;
        return res.status(200).json({ success: true, data });
      } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
      }

    case 'POST':
      // Apply middlewares
      return authMiddleware(req, res, async () => {
        return adminMiddleware(req, res, async () => {
          try {
            const validation = challengeSchema.safeParse(req.body);
            if (!validation.success) {
              return res.status(400).json({ success: false, error: validation.error.errors });
            }

            const { data, error } = await supabaseAdmin
              .from('challenges')
              .insert([validation.data])
              .select()
              .single();

            if (error) throw error;
            return res.status(201).json({ success: true, data });
          } catch (error: any) {
            return res.status(400).json({ success: false, error: error.message });
          }
        });
      });

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
  }
}

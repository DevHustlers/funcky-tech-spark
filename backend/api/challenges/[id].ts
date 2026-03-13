import { supabase, supabaseAdmin } from '../../supabaseClient';
import { authMiddleware } from '../../authMiddleware';
import { adminMiddleware } from '../../adminMiddleware';
import { z } from 'zod';

const updateChallengeSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(10).optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
  track: z.string().min(2).optional(),
  points: z.number().int().positive().optional()
});

export default async function handler(req: any, res: any) {
  const { method, query: { id } } = req;

  if (!id) {
    return res.status(400).json({ success: false, error: 'Challenge ID is required' });
  }

  switch (method) {
    case 'GET':
      try {
        const { data, error } = await supabase
          .from('challenges')
          .select('*')
          .eq('id', id)
          .eq('is_deleted', false)
          .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ success: false, error: 'Challenge not found' });

        return res.status(200).json({ success: true, data });
      } catch (error: any) {
        return res.status(400).json({ success: false, error: error.message });
      }

    case 'PUT':
      return authMiddleware(req, res, async () => {
        return adminMiddleware(req, res, async () => {
          try {
            const validation = updateChallengeSchema.safeParse(req.body);
            if (!validation.success) {
              return res.status(400).json({ success: false, error: validation.error.errors });
            }

            const { data, error } = await supabaseAdmin
              .from('challenges')
              .update(validation.data)
              .eq('id', id)
              .select()
              .single();

            if (error) throw error;
            return res.status(200).json({ success: true, data });
          } catch (error: any) {
            return res.status(400).json({ success: false, error: error.message });
          }
        });
      });

    case 'DELETE':
      return authMiddleware(req, res, async () => {
        return adminMiddleware(req, res, async () => {
          try {
            // Soft delete
            const { error } = await supabaseAdmin
              .from('challenges')
              .update({ is_deleted: true })
              .eq('id', id);

            if (error) throw error;
            return res.status(200).json({ success: true, data: { message: 'Challenge deleted successfully' } });
          } catch (error: any) {
            return res.status(400).json({ success: false, error: error.message });
          }
        });
      });

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
  }
}

import { supabaseAdmin } from './supabaseClient';

export const adminMiddleware = async (req: any, res: any, next: () => void) => {
  try {
    // Note: This assumes you have a 'profiles' table or similar with a 'role' column
    // For now, we'll check if the user exists and has an admin role metadata/column
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Example check: check app_metadata or a separate profiles table
    // Adjust based on your actual role implementation
    const isAdmin = user.app_metadata?.role === 'admin' || user.user_metadata?.is_admin === true;

    if (!isAdmin) {
      // Fallback: check a 'profiles' table for admin flag
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error || !data?.is_admin) {
        return res.status(403).json({ success: false, error: 'Forbidden: Admin access required' });
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal server error in admin middleware' });
  }
};

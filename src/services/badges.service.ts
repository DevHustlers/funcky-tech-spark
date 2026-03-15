import { supabase } from '@/lib/supabase';
import type { Tables, TablesInsert, ServiceResponse } from '@/types/database';

export const getBadges = async (): Promise<ServiceResponse<Tables<'badges'>[]>> => {
  try {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .order('min_points', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getBadges:', error.message);
    return { data: null, error: error.message };
  }
};

export const createBadge = async (
  data: TablesInsert<'badges'>
): Promise<ServiceResponse<Tables<'badges'>>> => {
  try {
    const { data: result, error } = await supabase
      .from('badges')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return { data: result, error: null };
  } catch (error: any) {
    console.error('Error in createBadge:', error.message);
    return { data: null, error: error.message };
  }
};

export const updateBadge = async (
  id: string,
  data: any
): Promise<ServiceResponse<Tables<'badges'>>> => {
  try {
    const { data: result, error } = await supabase
      .from('badges')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: result, error: null };
  } catch (error: any) {
    console.error('Error in updateBadge:', error.message);
    return { data: null, error: error.message };
  }
};

export const deleteBadge = async (id: string): Promise<ServiceResponse<null>> => {
  try {
    const { error } = await supabase.from('badges').delete().eq('id', id);
    if (error) throw error;
    return { data: null, error: null };
  } catch (error: any) {
    console.error('Error in deleteBadge:', error.message);
    return { data: null, error: error.message };
  }
};

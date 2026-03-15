import { supabase } from '@/lib/supabase';
import type { Tables, TablesInsert, ServiceResponse } from '@/types/database';

export const getPointRules = async (): Promise<ServiceResponse<Tables<'point_rules'>[]>> => {
  try {
    const { data, error } = await supabase
      .from('point_rules')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getPointRules:', error.message);
    return { data: null, error: error.message };
  }
};

export const createPointRule = async (
  data: TablesInsert<'point_rules'>
): Promise<ServiceResponse<Tables<'point_rules'>>> => {
  try {
    const { data: result, error } = await supabase
      .from('point_rules')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return { data: result, error: null };
  } catch (error: any) {
    console.error('Error in createPointRule:', error.message);
    return { data: null, error: error.message };
  }
};

export const updatePointRule = async (
  id: string,
  data: any
): Promise<ServiceResponse<Tables<'point_rules'>>> => {
  try {
    const { data: result, error } = await supabase
      .from('point_rules')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: result, error: null };
  } catch (error: any) {
    console.error('Error in updatePointRule:', error.message);
    return { data: null, error: error.message };
  }
};

export const deletePointRule = async (id: string): Promise<ServiceResponse<null>> => {
  try {
    const { error } = await supabase.from('point_rules').delete().eq('id', id);
    if (error) throw error;
    return { data: null, error: null };
  } catch (error: any) {
    console.error('Error in deletePointRule:', error.message);
    return { data: null, error: error.message };
  }
};

export const getPointsLog = async (): Promise<ServiceResponse<any[]>> => {
  try {
    const { data, error } = await supabase
      .from('points_log')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getPointsLog:', error.message);
    return { data: null, error: error.message };
  }
};

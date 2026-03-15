import { supabase } from '@/lib/supabase';
import type { Tables, TablesInsert, TablesUpdate, ServiceResponse } from '@/types/database';

export const getCompetitions = async (): Promise<ServiceResponse<Tables<'competitions'>[]>> => {
  try {
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getCompetitions:', error.message);
    return { data: null, error: error.message };
  }
};

export const getActiveCompetitions = async (): Promise<ServiceResponse<Tables<'competitions'>[]>> => {
  try {
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getActiveCompetitions:', error.message);
    return { data: null, error: error.message };
  }
};

export const createCompetition = async (
  data: TablesInsert<'competitions'>
): Promise<ServiceResponse<Tables<'competitions'>>> => {
  try {
    const { data: result, error } = await supabase
      .from('competitions')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return { data: result, error: null };
  } catch (error: any) {
    console.error('Error in createCompetition:', error.message);
    return { data: null, error: error.message };
  }
};

export const updateCompetition = async (
  id: string,
  data: TablesUpdate<'competitions'>
): Promise<ServiceResponse<Tables<'competitions'>>> => {
  try {
    const { data: result, error } = await supabase
      .from('competitions')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: result, error: null };
  } catch (error: any) {
    console.error('Error in updateCompetition:', error.message);
    return { data: null, error: error.message };
  }
};

import { supabase } from '@/lib/supabase';
import type { Tables, TablesInsert, TablesUpdate, ServiceResponse } from '@/types/database';

export const getTracks = async (): Promise<ServiceResponse<Tables<'tracks'>[]>> => {
  try {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .order('name');

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getTracks:', error.message);
    return { data: null, error: error.message };
  }
};

export const createTrack = async (
  data: TablesInsert<'tracks'>
): Promise<ServiceResponse<Tables<'tracks'>>> => {
  try {
    const { data: result, error } = await supabase
      .from('tracks')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return { data: result, error: null };
  } catch (error: any) {
    console.error('Error in createTrack:', error.message);
    return { data: null, error: error.message };
  }
};

export const updateTrack = async (
  id: string,
  data: TablesUpdate<'tracks'>
): Promise<ServiceResponse<Tables<'tracks'>>> => {
  try {
    const { data: result, error } = await supabase
      .from('tracks')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: result, error: null };
  } catch (error: any) {
    console.error('Error in updateTrack:', error.message);
    return { data: null, error: error.message };
  }
};

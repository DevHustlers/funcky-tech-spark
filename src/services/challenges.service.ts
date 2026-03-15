import { supabase } from '@/lib/supabase';
import type { Tables, TablesInsert, ServiceResponse } from '@/types/database';

export const getChallenges = async (): Promise<ServiceResponse<Tables<'challenges'>[]>> => {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getChallenges:', error.message);
    return { data: null, error: error.message };
  }
};

export const getChallengesByTrack = async (
  trackId: string
): Promise<ServiceResponse<Tables<'challenges'>[]>> => {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('track_id', trackId)
      .eq('is_deleted', false);

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getChallengesByTrack:', error.message);
    return { data: null, error: error.message };
  }
};

export const createChallenge = async (
  data: TablesInsert<'challenges'>
): Promise<ServiceResponse<Tables<'challenges'>>> => {
  try {
    const { data: result, error } = await supabase
      .from('challenges')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return { data: result, error: null };
  } catch (error: any) {
    console.error('Error in createChallenge:', error.message);
    return { data: null, error: error.message };
  }
};

export const updateChallenge = async (
  id: string,
  data: any
): Promise<ServiceResponse<Tables<'challenges'>>> => {
  try {
    const { data: result, error } = await supabase
      .from('challenges')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: result, error: null };
  } catch (error: any) {
    console.error('Error in updateChallenge:', error.message);
    return { data: null, error: error.message };
  }
};

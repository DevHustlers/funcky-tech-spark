import { supabase } from '@/lib/supabase';
import type { Tables, TablesInsert, TablesUpdate, ServiceResponse } from '@/types/database';

export const getChallenges = async (limit: number = 20): Promise<ServiceResponse<Tables<'challenges'>[]>> => {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getChallenges:', error.message);
    return { data: null, error: error.message };
  }
};

export const getChallengeById = async (id: string): Promise<ServiceResponse<Tables<'challenges'>>> => {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getChallengeById:', error.message);
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

import { challengeSchema } from '@/lib/validation/challenge.schema';

export const createChallenge = async (
  data: TablesInsert<'challenges'>
): Promise<ServiceResponse<Tables<'challenges'>>> => {
  try {
    // 1. Sanitize input
    const sanitizedData = {
      ...data,
      title: data.title?.trim(),
      description: data.description?.trim(),
    };

    // 2. Validate with schema
    const validation = challengeSchema.safeParse(sanitizedData);
    if (!validation.success) {
      return { data: null, error: validation.error.errors[0].message };
    }

    // 3. Prevent duplicate title in same track
    const { data: existing } = await supabase
      .from('challenges')
      .select('id')
      .eq('title', sanitizedData.title)
      .eq('track', sanitizedData.track)
      .eq('is_deleted', false)
      .maybeSingle();

    if (existing) {
      return { data: null, error: 'A challenge with this title already exists in this track' };
    }

    const { data: result, error } = await supabase
      .from('challenges')
      .insert(sanitizedData)
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
  data: TablesUpdate<'challenges'>
): Promise<ServiceResponse<Tables<'challenges'>>> => {
  try {
    // 1. Sanitize input
    const sanitizedData = {
      ...data,
      title: data.title?.trim(),
      description: data.description?.trim(),
    };

    // 2. Validate partial data with schema (using .partial())
    const validation = challengeSchema.partial().safeParse(sanitizedData);
    if (!validation.success) {
      return { data: null, error: validation.error.errors[0].message };
    }

    const { data: result, error } = await supabase
      .from('challenges')
      .update(sanitizedData)
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
export const deleteChallenge = async (id: string): Promise<ServiceResponse<null>> => {
  try {
    // Soft delete by setting is_deleted to true
    const { error } = await supabase
      .from('challenges')
      .update({ is_deleted: true })
      .eq('id', id);

    if (error) throw error;
    return { data: null, error: null };
  } catch (error: any) {
    console.error('Error in deleteChallenge:', error.message);
    return { data: null, error: error.message };
  }
};

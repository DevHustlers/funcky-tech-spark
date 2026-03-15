import { supabase } from '@/lib/supabase';
import type { Tables, TablesInsert, TablesUpdate, ServiceResponse } from '@/types/database';

export const getCompetitions = async (limit: number = 20): Promise<ServiceResponse<Tables<'competitions'>[]>> => {
  try {
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getCompetitions:', error.message);
    return { data: null, error: error.message };
  }
};

export const getCompetitionById = async (id: string): Promise<ServiceResponse<Tables<'competitions'>>> => {
  try {
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getCompetitionById:', error.message);
    return { data: null, error: error.message };
  }
};

export const getLiveCompetitions = async (): Promise<ServiceResponse<Tables<'competitions'>[]>> => {
  try {
    const { data, error } = await supabase
      .from('competitions')
      .select('*')
      .eq('status', 'live')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getLiveCompetitions:', error.message);
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

import { competitionSchema } from '@/lib/validation/competition.schema';

export const createCompetition = async (
  data: TablesInsert<'competitions'>
): Promise<ServiceResponse<Tables<'competitions'>>> => {
  try {
    // 1. Sanitize input
    const sanitizedData = {
      ...data,
      title: data.title?.trim(),
      description: data.description?.trim(),
    };

    // 2. Validate with schema
    const validation = competitionSchema.safeParse(sanitizedData);
    if (!validation.success) {
      return { data: null, error: validation.error.errors[0].message };
    }

    // 3. Prevent overlapping live competitions (if this one is live)
    if (sanitizedData.status === 'live') {
      const { data: liveComps } = await supabase
        .from('competitions')
        .select('id')
        .eq('status', 'live')
        .maybeSingle();

      if (liveComps) {
        return { data: null, error: 'A competition is already live. Only one live competition is allowed at a time.' };
      }
    }

    const { data: result, error } = await supabase
      .from('competitions')
      .insert(sanitizedData)
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
    // 1. Sanitize input
    const sanitizedData = {
      ...data,
      title: data.title?.trim(),
      description: data.description?.trim(),
    };

    // 2. Validate partial data with schema
    const validation = competitionSchema.partial().safeParse(sanitizedData);
    if (!validation.success) {
      return { data: null, error: validation.error.errors[0].message };
    }

    // 3. Prevent overlapping live competitions (if this one is updated to live)
    if (sanitizedData.status === 'live') {
      const { data: liveComps } = await supabase
        .from('competitions')
        .select('id')
        .eq('status', 'live')
        .neq('id', id) // Exclude current competition
        .maybeSingle();

      if (liveComps) {
        return { data: null, error: 'A competition is already live. Only one live competition is allowed at a time.' };
      }
    }

    const { data: result, error } = await supabase
      .from('competitions')
      .update(sanitizedData)
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
export const deleteCompetition = async (id: string): Promise<ServiceResponse<null>> => {
  try {
    const { error } = await supabase.from('competitions').delete().eq('id', id);
    if (error) throw error;
    return { data: null, error: null };
  } catch (error: any) {
    console.error('Error in deleteCompetition:', error.message);
    return { data: null, error: error.message };
  }
};

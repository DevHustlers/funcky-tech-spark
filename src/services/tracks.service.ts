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

export const getTrackBySlug = async (slug: string): Promise<ServiceResponse<Tables<'tracks'>>> => {
  try {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getTrackBySlug:', error.message);
    return { data: null, error: error.message };
  }
};

import { trackSchema } from '@/lib/validation/track.schema';

export const createTrack = async (
  data: TablesInsert<'tracks'>
): Promise<ServiceResponse<Tables<'tracks'>>> => {
  try {
    // 1. Sanitize input
    const sanitizedData = {
      ...data,
      name: data.name?.trim(),
      slug: data.slug?.trim().toLowerCase().replace(/\s+/g, '-'),
      description: data.description?.trim(),
    };

    // 2. Validate with schema
    const validation = trackSchema.safeParse(sanitizedData);
    if (!validation.success) {
      return { data: null, error: validation.error.errors[0].message };
    }

    // 3. Prevent duplicate name or slug
    const { data: existing } = await supabase
      .from('tracks')
      .select('id')
      .or(`name.eq."${sanitizedData.name}",slug.eq."${sanitizedData.slug}"`)
      .maybeSingle();

    if (existing) {
      return { data: null, error: 'A track with this name or slug already exists' };
    }

    const { data: result, error } = await supabase
      .from('tracks')
      .insert(sanitizedData)
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
    // 1. Sanitize input
    const sanitizedData = {
      ...data,
      name: data.name?.trim(),
      slug: data.slug?.trim().toLowerCase().replace(/\s+/g, '-'),
      description: data.description?.trim(),
    };

    // 2. Validate partial data with schema
    const validation = trackSchema.partial().safeParse(sanitizedData);
    if (!validation.success) {
      return { data: null, error: validation.error.errors[0].message };
    }

    const { data: result, error } = await supabase
      .from('tracks')
      .update(sanitizedData)
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
export const deleteTrack = async (id: string): Promise<ServiceResponse<null>> => {
  try {
    const { error } = await supabase.from('tracks').delete().eq('id', id);
    if (error) throw error;
    return { data: null, error: null };
  } catch (error: any) {
    console.error('Error in deleteTrack:', error.message);
    return { data: null, error: error.message };
  }
};

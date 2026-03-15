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

import { badgeSchema } from '@/lib/validation/badge.schema';
import type { TablesUpdate } from '@/types/database';

export const createBadge = async (
  data: TablesInsert<'badges'>
): Promise<ServiceResponse<Tables<'badges'>>> => {
  try {
    // 1. Sanitize input
    const sanitizedData = {
      ...data,
      name: data.name?.trim(),
    };

    // 2. Validate with schema
    const validation = badgeSchema.safeParse(sanitizedData);
    if (!validation.success) {
      return { data: null, error: validation.error.errors[0].message };
    }

    // 3. Prevent duplicate name
    const { data: existing } = await supabase
      .from('badges')
      .select('id')
      .eq('name', sanitizedData.name)
      .maybeSingle();

    if (existing) {
      return { data: null, error: 'A badge with this name already exists' };
    }

    const { data: result, error } = await supabase
      .from('badges')
      .insert(sanitizedData)
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
  data: TablesUpdate<'badges'>
): Promise<ServiceResponse<Tables<'badges'>>> => {
  try {
    // 1. Sanitize
    const sanitizedData = {
      ...data,
      name: data.name?.trim(),
    };

    // 2. Validate
    const validation = badgeSchema.partial().safeParse(sanitizedData);
    if (!validation.success) {
      return { data: null, error: validation.error.errors[0].message };
    }

    const { data: result, error } = await supabase
      .from('badges')
      .update(sanitizedData)
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

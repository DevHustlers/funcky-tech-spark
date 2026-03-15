import { supabase } from '@/lib/supabase';
import type { Tables, TablesInsert, TablesUpdate, ServiceResponse } from '@/types/database';

export const getEvents = async (limit: number = 20): Promise<ServiceResponse<Tables<'events'>[]>> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getEvents:', error.message);
    return { data: null, error: error.message };
  }
};

export const getLiveEvents = async (): Promise<ServiceResponse<Tables<'events'>[]>> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'live')
      .order('date', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getLiveEvents:', error.message);
    return { data: null, error: error.message };
  }
};

export const getUpcomingEvents = async (limit: number = 3): Promise<ServiceResponse<Tables<'events'>[]>> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', today)
      .order('date', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getUpcomingEvents:', error.message);
    return { data: null, error: error.message };
  }
};

import { eventSchema } from '@/lib/validation/event.schema';

export const createEvent = async (
  data: TablesInsert<'events'>
): Promise<ServiceResponse<Tables<'events'>>> => {
  try {
    // 1. Sanitize input
    const sanitizedData = {
      ...data,
      title: data.title?.trim(),
      description: data.description?.trim(),
      location: data.location?.trim(),
    };

    // 2. Validate with schema
    const validation = eventSchema.safeParse(sanitizedData);
    if (!validation.success) {
      return { data: null, error: validation.error.errors[0].message };
    }

    // 3. Prevent duplicate event with same title and date
    const { data: existing } = await supabase
      .from('events')
      .select('id')
      .eq('title', sanitizedData.title)
      .eq('date', sanitizedData.date)
      .maybeSingle();

    if (existing) {
      return { data: null, error: 'An event with this title on this date already exists' };
    }

    const { data: result, error } = await supabase
      .from('events')
      .insert(sanitizedData)
      .select()
      .single();

    if (error) throw error;
    return { data: result, error: null };
  } catch (error: any) {
    console.error('Error in createEvent:', error.message);
    return { data: null, error: error.message };
  }
};

export const updateEvent = async (
  id: string,
  data: TablesUpdate<'events'>
): Promise<ServiceResponse<Tables<'events'>>> => {
  try {
    // 1. Sanitize input
    const sanitizedData = {
      ...data,
      title: data.title?.trim(),
      description: data.description?.trim(),
      location: data.location?.trim(),
    };

    // 2. Validate partial data with schema
    const validation = eventSchema.partial().safeParse(sanitizedData);
    if (!validation.success) {
      return { data: null, error: validation.error.errors[0].message };
    }

    const { data: result, error } = await supabase
      .from('events')
      .update(sanitizedData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: result, error: null };
  } catch (error: any) {
    console.error('Error in updateEvent:', error.message);
    return { data: null, error: error.message };
  }
};
export const deleteEvent = async (id: string): Promise<ServiceResponse<null>> => {
  try {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
    return { data: null, error: null };
  } catch (error: any) {
    console.error('Error in deleteEvent:', error.message);
    return { data: null, error: error.message };
  }
};

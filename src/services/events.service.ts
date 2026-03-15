import { supabase } from '@/lib/supabase';
import type { Tables, TablesInsert, TablesUpdate, ServiceResponse } from '@/types/database';

export const getEvents = async (): Promise<ServiceResponse<Tables<'events'>[]>> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getEvents:', error.message);
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

export const createEvent = async (
  data: TablesInsert<'events'>
): Promise<ServiceResponse<Tables<'events'>>> => {
  try {
    const { data: result, error } = await supabase
      .from('events')
      .insert(data)
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
    const { data: result, error } = await supabase
      .from('events')
      .update(data)
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

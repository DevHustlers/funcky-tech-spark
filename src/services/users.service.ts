import { supabase } from '@/lib/supabase';
import type { Tables, TablesUpdate, ServiceResponse } from '@/types/database';

export const getUsers = async (): Promise<ServiceResponse<Tables<'profiles'>[]>> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in getUsers:', error.message);
    return { data: null, error: error.message };
  }
};

export const updateUserRoleAndPoints = async (
  id: string,
  updates: TablesUpdate<'profiles'>
): Promise<ServiceResponse<Tables<'profiles'>>> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in updateUserRoleAndPoints:', error.message);
    return { data: null, error: error.message };
  }
};

export const deleteUser = async (id: string): Promise<ServiceResponse<null>> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { data: null, error: null };
  } catch (error: any) {
    console.error('Error in deleteUser:', error.message);
    return { data: null, error: error.message };
  }
};

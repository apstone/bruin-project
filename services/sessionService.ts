import { supabase } from '../lib/supabaseClient';

export const createSession = async () => {
  const { data, error } = await supabase
    .from('sessions')
    .insert([{ status: 'in_progress' }])
    .select('id')
    .single();

  if (error) {
    console.error('Error creating session:', error);
    throw error;
  }

  return data;
};

export const deleteSessionById = async (sessionId: string) => {
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', sessionId);

  if (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
};


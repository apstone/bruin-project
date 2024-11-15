import { supabase } from '../lib/supabaseClient';

export const createSession = async () => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .insert([{ status: 'in_progress' }])
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

export const deleteSessionById = async (sessionId: string) => {
  try {
    const { error } = await supabase.from('sessions').delete().eq('id', sessionId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
};

export const getSessionById = async (sessionId: string) => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching session:', error);
    throw error;
  }
};

export const getAllSessions = async () => {
  try {
    const { data, error } = await supabase.from('sessions').select('*');

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching all sessions:', error);
    throw error;
  }
};


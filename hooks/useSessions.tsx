import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useSessions() {
  const [sessions, setSessions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedSessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    setSessions(savedSessions);
  }, []);

  const startNewSession = async (): Promise<string> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert([{ status: 'in_progress' }])
        .select('id')
        .single();

      if (error) {
        throw new Error('Error creating session');
      }

      const newSessionId = data.id;
      const updatedSessions = [newSessionId, ...sessions];
      setSessions(updatedSessions);
      localStorage.setItem('sessions', JSON.stringify(updatedSessions));

      return newSessionId;
    } catch (error) {
      console.error('Failed to create session:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    const updatedSessions = sessions.filter((session) => session !== sessionId);
    setSessions(updatedSessions);
    localStorage.setItem('sessions', JSON.stringify(updatedSessions));

    try {
      await supabase.from('sessions').delete().eq('id', sessionId);
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  return {
    sessions,
    isLoading,
    startNewSession,
    deleteSession,
  };
}


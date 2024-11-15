import { supabase } from '@/lib/supabaseClient';

interface SaveAnswerParams {
  sessionId: string;
  questionId: number;
  answerText: string;
  answeredAt?: string;
}

export const fetchAnswersBySession = async (sessionId: string) => {
  try {
    const { data, error } = await supabase
      .from('answers')
      .select('question_id, answer_text')
      .eq('session_id', sessionId);

    if (error) {
      throw new Error(`Error fetching answers: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const saveAnswer = async ({
  sessionId,
  questionId,
  answerText,
  answeredAt = new Date().toISOString(),
}: SaveAnswerParams) => {
  try {
    const { error } = await supabase
      .from('answers')
      .upsert(
        {
          session_id: sessionId,
          question_id: questionId,
          answer_text: answerText,
          answered_at: answeredAt,
        },
        { onConflict: 'session_id,question_id' }
      );

    if (error) {
      throw new Error(`Error saving answer: ${error.message}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};


'use client';
import { useEffect, useState, use } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Database } from '@/lib/database.types';
import questionsData from '../../../question-data.json';
import ProgressBar from '@/app/components/ProgressBar';
import Question from '@/app/components/Question';

type Session = Database['public']['Tables']['sessions']['Row'];

const validQuestions = questionsData.questions.filter(
  (q): q is { id: number; question: string; answers: string[] } =>
    typeof q.question === 'string' && Array.isArray(q.answers)
);

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchSessionData = async () => {
      if (id) {
        setLoading(true);

        const { data: session, error: sessionError } = await supabase
          .from('sessions')
          .select('*')
          .eq('id', id)
          .single();

        if (sessionError) {
          console.error('Error fetching session data:', sessionError);
          setLoading(false);
          return;
        }
        setSessionData(session);

        // Fetch saved answers for the session
        const { data: savedAnswers, error: answersError } = await supabase
          .from('answers')
          .select('question_id, answer_text')
          .eq('session_id', id);

        if (answersError) {
          console.error('Error fetching answers:', answersError);
          setLoading(false);
          return;
        }

        const answersMap = savedAnswers?.reduce((acc, answer) => {
          acc[answer.question_id] = answer.answer_text || '';
          return acc;
        }, {} as { [key: number]: string }) || {};

        setAnswers(answersMap);

        const lastAnsweredQuestionIndex = savedAnswers
          ? savedAnswers.length
          : 0;
        setCurrentQuestionIndex(lastAnsweredQuestionIndex);

        setLoading(false);
      }
    };

    fetchSessionData();
  }, [id]);

  const saveAnswer = async (questionId: number, answerText: string) => {
    if (!id) return;

    const { error } = await supabase
      .from('answers')
      .upsert(
        {
          session_id: id,
          question_id: questionId,
          answer_text: answerText,
          answered_at: new Date().toISOString(),
        },
        { onConflict: 'session_id,question_id' }
      );

    if (error) {
      console.error('Error saving answer:', error);
    }
  };

  const handleAnswer = (questionId: number, answerText: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerText }));
    saveAnswer(questionId, answerText);

    if (questionId === validQuestions[currentQuestionIndex].id && currentQuestionIndex < validQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < validQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading session data...</div>;
  }

  return (
    <div className="md:min-h-screen p-2 md:p-6 bg-gray-100 text-center flex flex-col items-center overflow-hidden">
      <h1 className="text-2xl font-bold mb-4">Session</h1>
      {sessionData ? (
        <>
          <ProgressBar current={currentQuestionIndex + 1} total={validQuestions.length} />

          <div className="relative w-full max-w-[800px] mt-8">
            <div
              className="space-y-8 overflow-y-auto h-[65vh] md:h-[75vh] pr-4 flex flex-col-reverse"
              style={{ scrollbarWidth: 'none' }}
            >
              {validQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className={`p-2 rounded-lg shadow-md transition-transform duration-300 ${index === currentQuestionIndex
                    ? 'bg-white border-2 border-blue-500'
                    : 'bg-gray-200 opacity-75'
                  }`}
                  ref={
                    index === currentQuestionIndex
                      ? (el) => el?.scrollIntoView({ behavior: 'smooth', block: 'end' })
                      : null
                  }
                >
                  <Question
                    question={question}
                    onAnswer={handleAnswer}
                    selectedAnswer={answers[question.id]}
                  />
                </div>
              ))}
            </div>

            <div className="absolute bottom-4 right-4 space-y-2 flex flex-col">
              <button
                className="bg-blue-500 text-white w-12 h-12 rounded shadow-md hover:bg-blue-600 disabled:opacity-50"
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === validQuestions.length - 1}
              >
                &#8593;
              </button>
              <button
                className="bg-blue-500 text-white w-12 h-12 rounded shadow-md hover:bg-blue-600 disabled:opacity-50"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                &#8595;
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-lg text-red-500">Session not found.</p>
      )}
    </div>
  );
}


'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Question = { id: number; question: string; answers: string[] };
type AnswerMap = { [key: number]: string };

export function useAssessment(sessionId: string, questions: Question[]) {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAssessmentData = async () => {
      if (!sessionId) return;

      setLoading(true);

      try {
        const { data: savedAnswers, error: answersError } = await supabase
          .from('answers')
          .select('question_id, answer_text')
          .eq('session_id', sessionId);

        if (answersError) {
          console.error('Error fetching answers:', answersError);
          return;
        }

        const answersMap =
          savedAnswers?.reduce((acc, answer) => {
            acc[answer.question_id] = answer.answer_text || '';
            return acc;
          }, {} as AnswerMap) || {};

        setAnswers(answersMap);

        const lastAnsweredIndex = questions.findIndex(
          (q) => !answersMap[q.id]
        );
        setCurrentQuestionIndex(
          lastAnsweredIndex !== -1 ? lastAnsweredIndex : questions.length - 1
        );
      } catch (error) {
        console.error('Error fetching assessment data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentData();
  }, [sessionId, questions]);

  const saveAnswer = async (questionId: number, answerText: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerText }));

    try {
      const { error } = await supabase
        .from('answers')
        .upsert(
          {
            session_id: sessionId,
            question_id: questionId,
            answer_text: answerText,
            answered_at: new Date().toISOString(),
          },
          { onConflict: 'session_id,question_id' }
        );

      if (error) {
        console.error('Error saving answer:', error);
      }
    } catch (error) {
      console.error('Unexpected error saving answer:', error);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      scrollToQuestion(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      scrollToQuestion(currentQuestionIndex - 1);
    }
  };

  const scrollToQuestion = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;

    const questionDiv = container.children[index];
    if (questionDiv) {
      const containerRect = container.getBoundingClientRect();
      const questionRect = questionDiv.getBoundingClientRect();
      const offset = 8;

      // Calculate the target scroll position with offset
      const targetScrollPosition =
        container.scrollTop + (questionRect.top - containerRect.top) + offset - (container.clientHeight - questionDiv.clientHeight);

      smoothScrollTo(container, targetScrollPosition);
    }
  }, []);

  const smoothScrollTo = (element: HTMLElement, target: number) => {
    const duration = 500; // Total animation duration in ms
    const start = element.scrollTop;
    const distance = target - start;
    let startTime: number | null = null;

    const animateScroll = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1); // Progress ranges from 0 to 1

      // Ease-in-out effect
      const ease = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

      element.scrollTop = start + distance * ease;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // Scroll to the current question on initial load
  useEffect(() => {
    scrollToQuestion(currentQuestionIndex);
  }, [currentQuestionIndex, scrollToQuestion]);

  return {
    questions,
    answers,
    currentQuestionIndex,
    completedCount: Object.keys(answers).length,
    loading,
    saveAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    containerRef,
  };
}


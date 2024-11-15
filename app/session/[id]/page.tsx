'use client';
import questionsData from '../../../question-data.json';
import ProgressBar from '@/app/components/ProgressBar';
import Question from '@/app/components/Question';
import { useAssessment } from '@/hooks/useAssessment';
import { use } from 'react';

const validQuestions = questionsData.questions.filter(
  (q): q is { id: number; question: string; answers: string[] } =>
    typeof q.question === 'string' && Array.isArray(q.answers)
);

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const {
    questions,
    answers,
    currentQuestionIndex,
    completedCount,
    loading,
    saveAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    containerRef,
  } = useAssessment(id, validQuestions);

  if (loading) {
    return <div className="text-center mt-20">Loading assessment...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-center flex flex-col items-center">
      <ProgressBar current={completedCount} total={questions.length} />
      <div className="relative w-full max-w-2xl mt-8">
        <div
          ref={containerRef}
          className="space-y-8 overflow-y-auto h-[65vh] flex flex-col-reverse"
          style={{ scrollbarWidth: 'none' }}
        >
          {questions.map((question, index) => (
            <div
              key={question.id}
              className={`p-4 rounded-lg shadow-md transition-transform duration-300 ${index === currentQuestionIndex
                ? 'bg-white border-2 border-blue-500 mt-8'
                : 'bg-gray-200 opacity-75 mt-8'
              }`}
            >
              <Question
                question={question}
                onAnswer={(answer) => {
                  saveAnswer(question.id, answer.toString());
                  goToNextQuestion();
                }}
                selectedAnswer={answers[question.id]}
              />
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 right-4 space-y-2 flex flex-col">
          <button
            className="bg-blue-500 text-white w-12 h-12 rounded shadow-md hover:bg-blue-600 disabled:opacity-50"
            onClick={goToNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            &#8593;
          </button>
          <button
            className="bg-blue-500 text-white w-12 h-12 rounded shadow-md hover:bg-blue-600 disabled:opacity-50"
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            &#8595;
          </button>
        </div>
      </div>
    </div>
  );
}


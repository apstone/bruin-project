import React from 'react';
import Question from './Question';

interface QuestionListProps {
  questions: Array<{ id: number; question: string; answers: string[] }>;
  onAnswer: (questionId: number, answer: string) => void;
  selectedAnswers: { [key: number]: string };
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, onAnswer, selectedAnswers }) => {
  return (
    <div className="space-y-6">
      {questions.map((q) => (
        <Question
          key={q.id}
          question={q}
          onAnswer={onAnswer}
          selectedAnswer={selectedAnswers[q.id]}
        />
      ))}
    </div>
  );
};

export default QuestionList;


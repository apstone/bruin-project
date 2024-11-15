import React from 'react';

interface QuestionProps {
  question: {
    id: number;
    question: string;
    answers: string[];
  };
  onAnswer: (questionId: number, answer: string) => void;
  selectedAnswer?: string;
}

const Question: React.FC<QuestionProps> = ({ question, onAnswer, selectedAnswer }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-lg font-semibold mb-4 text-gray-800">{question.question}</p>
      <div className="flex justify-around items-center">
        {question.answers.map((answer, index) => (
          <label key={index} className="flex flex-col items-center space-y-1">
            <input
              type="radio"
              name={`question-${question.id}`}
              value={answer}
              checked={selectedAnswer === answer}
              onChange={() => onAnswer(question.id, answer)}
              className="form-radio h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600 font-medium">{answer}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Question;


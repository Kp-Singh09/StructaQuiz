// src/components/results/AnswerCard.jsx
import React from 'react';

// This helper function determines if the entire question was answered correctly.
const isAnswerCorrect = (answerData) => {
  const { questionId, answer } = answerData;
  if (!questionId || !answer) return false;

  try {
    switch (questionId.type) {
      case 'Comprehension':
        return questionId.mcqs.every(mcq => answer[mcq._id.toString()] === mcq.correctAnswer);
      case 'Categorize':
        if (Object.keys(answer).length === 0) return false;
        return questionId.items.every(item => {
          const submittedCategory = Object.keys(answer).find(cat => answer[cat] && answer[cat].includes(item.text));
          return submittedCategory === item.category;
        });
      case 'Cloze':
        if (Object.keys(answer).length === 0) return false;
        return questionId.options.every((option, index) => answer[`blank_${index}`] === option);
      default:
        return false;
    }
  } catch (e) {
    console.error("Error checking answer:", e);
    return false;
  }
};

// --- RENDER FUNCTIONS FOR EACH QUESTION TYPE ---

const ComprehensionBreakdown = ({ question, userAnswer }) => (
  <div className="space-y-3">
    {question.mcqs.map((mcq, index) => {
      const userChoice = userAnswer[mcq._id.toString()] || "No answer";
      const isMcqCorrect = userChoice === mcq.correctAnswer;
      return (
        <div key={mcq._id} className="text-sm">
          <p className="text-gray-700">Q{index + 1}: {mcq.questionText}</p>
          <p className={`pl-4 ${isMcqCorrect ? 'text-green-600' : 'text-red-600'}`}>Your Answer: {userChoice}</p>
          {!isMcqCorrect && <p className="pl-4 text-green-700">Correct Answer: {mcq.correctAnswer}</p>}
        </div>
      );
    })}
  </div>
);

const CategorizeBreakdown = ({ question, userAnswer }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
    <div>
      <h5 className="font-semibold text-gray-800 mb-2">Your Answer:</h5>
      {Object.entries(userAnswer).map(([category, items]) => (
        <div key={category}>
            <p className="text-gray-700 font-medium">{category}:</p>
            <p className="pl-4 text-gray-600">{Array.isArray(items) && items.length > 0 ? items.join(', ') : 'Empty'}</p>
        </div>
      ))}
    </div>
    <div>
      <h5 className="font-semibold text-green-700 mb-2">Correct Answer:</h5>
      {question.categories.map(category => (
        <div key={category}>
            <p className="text-gray-700 font-medium">{category}:</p>
            <p className="pl-4 text-green-600">{question.items.filter(i => i.category === category).map(i => i.text).join(', ')}</p>
        </div>
      ))}
    </div>
  </div>
);

const ClozeBreakdown = ({ question, userAnswer }) => (
    <div className="text-sm">
        <h5 className="font-semibold text-gray-800 mb-2">Your Answer:</h5>
        <p className="text-gray-700">{Object.values(userAnswer).join(', ')}</p>
        <h5 className="font-semibold text-green-700 my-2">Correct Answer:</h5>
        <p className="text-green-600">{question.options.join(', ')}</p>
    </div>
);


const AnswerCard = ({ answerData, index }) => {
  const { questionId, answer } = answerData;
  const wasCorrect = isAnswerCorrect(answerData);

  const renderBreakdown = () => {
    switch (questionId.type) {
      case 'Comprehension':
        return <ComprehensionBreakdown question={questionId} userAnswer={answer} />;
      case 'Categorize':
        return <CategorizeBreakdown question={questionId} userAnswer={answer} />;
      case 'Cloze':
        return <ClozeBreakdown question={questionId} userAnswer={answer} />;
      default:
        return <p>Cannot display breakdown for this question type.</p>;
    }
  };

  return (
    <div className={`bg-white p-6 rounded-lg border-l-4 ${wasCorrect ? 'border-green-500' : 'border-red-500'} shadow-sm`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Question #{index + 1}: {questionId.type}</h3>
        {wasCorrect ? (
          <span className="text-sm font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">Correct</span>
        ) : (
          <span className="text-sm font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full">Incorrect</span>
        )}
      </div>
      <p className="mt-2 text-gray-600 italic text-sm">{questionId.passage || questionId.comprehensionPassage || 'Categorize the following items:'}</p>
      
      <div className="mt-4 border-t border-gray-200 pt-4">
        {renderBreakdown()}
      </div>
    </div>
  );
};

export default AnswerCard;
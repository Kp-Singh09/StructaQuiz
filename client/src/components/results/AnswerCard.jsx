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
          <p className="text-slate-300">Q{index + 1}: {mcq.questionText}</p>
          <p className={`pl-4 ${isMcqCorrect ? 'text-green-400' : 'text-red-400'}`}>Your Answer: {userChoice}</p>
          {!isMcqCorrect && <p className="pl-4 text-green-400">Correct Answer: {mcq.correctAnswer}</p>}
        </div>
      );
    })}
  </div>
);

const CategorizeBreakdown = ({ question, userAnswer }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
    <div>
      <h5 className="font-semibold text-slate-200 mb-2">Your Answer:</h5>
      {Object.entries(userAnswer).map(([category, items]) => (
        <div key={category}>
            <p className="text-slate-300 font-medium">{category}:</p>
            <p className="pl-4 text-slate-400">{Array.isArray(items) && items.length > 0 ? items.join(', ') : 'Empty'}</p>
        </div>
      ))}
    </div>
    <div>
      <h5 className="font-semibold text-green-400 mb-2">Correct Answer:</h5>
      {question.categories.map(category => (
        <div key={category}>
            <p className="text-slate-300 font-medium">{category}:</p>
            <p className="pl-4 text-green-400">{question.items.filter(i => i.category === category).map(i => i.text).join(', ')}</p>
        </div>
      ))}
    </div>
  </div>
);

const ClozeBreakdown = ({ question, userAnswer }) => (
    <div className="text-sm">
        <h5 className="font-semibold text-slate-200 mb-2">Your Answer:</h5>
        <p className="text-slate-300">{Object.values(userAnswer).join(', ')}</p>
        <h5 className="font-semibold text-green-400 my-2">Correct Answer:</h5>
        <p className="text-green-400">{question.options.join(', ')}</p>
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
    <div className={`bg-slate-800/50 p-6 rounded-lg border-l-4 ${wasCorrect ? 'border-green-500' : 'border-red-500'}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Question #{index + 1}: {questionId.type}</h3>
        {wasCorrect ? (
          <span className="text-sm font-bold text-green-400 bg-green-900/50 px-3 py-1 rounded-full">Correct</span>
        ) : (
          <span className="text-sm font-bold text-red-400 bg-red-900/50 px-3 py-1 rounded-full">Incorrect</span>
        )}
      </div>
      <p className="mt-2 text-slate-300 italic text-sm">{questionId.passage || questionId.comprehensionPassage || 'Categorize the following items:'}</p>
      
      <div className="mt-4 border-t border-slate-700 pt-4">
        {renderBreakdown()}
      </div>
    </div>
  );
};

export default AnswerCard;
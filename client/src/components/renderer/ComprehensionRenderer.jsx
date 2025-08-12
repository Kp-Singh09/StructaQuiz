// src/components/renderer/ComprehensionRenderer.jsx
import { useState } from 'react';

const ComprehensionRenderer = ({ question, onAnswerChange }) => {
  // This state now stores the INDEX of the selected answer for each MCQ
  const [selectedAnswerIndices, setSelectedAnswerIndices] = useState({});

  const handleSelection = (mcqId, optionIndex, optionText) => {
    // Update the local state with the selected index
    const newSelectedIndices = { ...selectedAnswerIndices, [mcqId]: optionIndex };
    setSelectedAnswerIndices(newSelectedIndices);
    
    // Create a separate object to send the ANSWER TEXT to the parent
    // This keeps the final data structure correct
    const newAnswersForParent = {};
    for (const id in newSelectedIndices) {
        // Find the text corresponding to the stored index
        const questionForMcq = question.mcqs.find(mcq => mcq._id === id);
        if (questionForMcq) {
            newAnswersForParent[id] = questionForMcq.options[newSelectedIndices[id]];
        }
    }
    
    onAnswerChange(question._id, newAnswersForParent);
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-lg shadow-md">
      {question.image && <img src={question.image} alt="Question visual" className="w-full h-48 object-cover rounded-md mb-6" />}
      <h3 className="text-2xl font-bold mb-4 text-white">Reading Comprehension</h3>
      
      <div className="prose prose-invert max-w-none bg-slate-900/50 p-4 rounded-md border border-slate-700 mb-6">
        <p>{question.comprehensionPassage}</p>
      </div>

      <div className="space-y-6">
        {question.mcqs.map((mcq) => (
          <div key={mcq._id} className="border-t border-slate-700 pt-4">
            <p className="font-semibold text-lg mb-3">{mcq.questionText}</p>
            <div className="space-y-2">
              {mcq.options.map((optionText, optIndex) => {
                const uniqueId = `mcq-option-${mcq._id}-${optIndex}`;
                return (
                  <label key={uniqueId} htmlFor={uniqueId} className="flex items-center p-3 rounded-md hover:bg-slate-700/50 cursor-pointer transition-colors">
                    <input
                      id={uniqueId}
                      type="radio"
                      name={`mcq-${mcq._id}`}
                      // The value is the index, ensuring uniqueness
                      value={optIndex}
                      // Check against the stored index
                      checked={selectedAnswerIndices[mcq._id] === optIndex}
                      // Pass both index and text to the handler
                      onChange={() => handleSelection(mcq._id, optIndex, optionText)}
                      className="mr-4 h-5 w-5 bg-slate-800 border-slate-600 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-slate-200">{optionText}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComprehensionRenderer;
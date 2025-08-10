import { useState } from 'react';

const ComprehensionRenderer = ({ question, onAnswerChange }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleSelection = (mcqId, option) => {
    // Create the new state for the answers within this component
    const newAnswers = { ...selectedAnswers, [mcqId]: option };
    setSelectedAnswers(newAnswers);
    
    // Call the onAnswerChange prop to send the updated answers up to the FormRenderer
    onAnswerChange(question._id, newAnswers);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
    {question.image && <img src={question.image} alt="Question visual" className="w-full h-40 object-cover rounded-md mb-4" />}

    <h3 className="text-xl font-bold mb-4 text-gray-800">Reading Comprehension</h3>
      
      <div className="prose max-w-none bg-gray-50 p-4 rounded-md border">
        <p>{question.comprehensionPassage}</p>
      </div>

      <div className="mt-6 space-y-4">
        {question.mcqs.map((mcq) => (
          <div key={mcq._id} className="border-t pt-4">
            <p className="font-semibold mb-2">{mcq.questionText}</p>
            <div className="space-y-2">
              {mcq.options.map((option, optIndex) => (
                <label key={optIndex} className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                  <input
                    type="radio"
                    name={`mcq-${mcq._id}`}
                    value={option}
                    checked={selectedAnswers[mcq._id] === option}
                    onChange={() => handleSelection(mcq._id, option)}
                    className="mr-3 h-4 w-4"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComprehensionRenderer;
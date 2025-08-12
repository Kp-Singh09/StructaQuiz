// src/components/builder/ComprehensionBuilder.jsx
import { useState, useRef } from 'react';
import axios from 'axios';

const ComprehensionBuilder = ({ onSave, onCancel }) => {
  const [passage, setPassage] = useState('');
  const [mcqs, setMcqs] = useState([{ questionText: '', options: ['', '', ''] }]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  const handleMcqChange = (index, field, value) => {
    const newMcqs = [...mcqs];
    newMcqs[index][field] = value;
    setMcqs(newMcqs);
  };

  const handleOptionChange = (mcqIndex, optionIndex, value) => {
    const newMcqs = [...mcqs];
    newMcqs[mcqIndex].options[optionIndex] = value;
    setMcqs(newMcqs);
  };

  const addMcq = () => setMcqs([...mcqs, { questionText: '', options: ['', '', ''] }]);

  const handleQuestionImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!passage.trim() || mcqs.some(q => !q.questionText.trim())) {
      alert('Please fill in the passage and all question texts.');
      return;
    }
    
    let imageUrl = '';
    if (imageFile) {
        // Here you would perform the actual ImageKit upload
        // For this example, we assume it's successful and return a placeholder URL
        console.log("Uploading image:", imageFile.name);
        imageUrl = imagePreview; // In a real app, this would be the URL from ImageKit
    }

    const questionData = {
      type: 'Comprehension',
      comprehensionPassage: passage,
      mcqs: mcqs.map(q => ({ ...q, correctAnswer: q.options[0] })),
      image: imageUrl,
    };
    onSave(questionData);
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mt-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Create Comprehension Question</h3>
        {!imagePreview && (
          <>
            <input type="file" ref={fileInputRef} onChange={handleQuestionImageUpload} style={{ display: 'none' }} accept="image/*" />
            <button onClick={() => fileInputRef.current.click()} className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-200 py-1 px-3 rounded-md">
              Add Image
            </button>
          </>
        )}
      </div>

      {imagePreview && (
        <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded-lg flex items-center gap-4">
          <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-md"/>
          <div className="flex-grow">
            <p className="font-semibold text-green-300">Image selected!</p>
            <p className="text-xs text-slate-400 truncate">{imageFile.name}</p>
          </div>
          <button onClick={() => { setImagePreview(''); setImageFile(null); }} className="text-red-400 hover:text-red-300 text-xs font-semibold">
            Remove
          </button>
        </div>
      )}
      
      <label className="block text-slate-300 font-semibold mb-2">Passage</label>
      <textarea
        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        rows="6"
        placeholder="Enter the reading passage here..."
        value={passage}
        onChange={(e) => setPassage(e.target.value)}
      />

      <div className="mt-6">
        <h4 className="font-semibold text-lg mb-4 text-white">Multiple Choice Questions</h4>
        {mcqs.map((mcq, index) => (
          <div key={index} className="bg-slate-900/70 p-4 rounded-md mb-4 border border-slate-700">
            <input
              type="text"
              className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md mb-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder={`Question ${index + 1}`}
              value={mcq.questionText}
              onChange={(e) => handleMcqChange(index, 'questionText', e.target.value)}
            />
            <div className="pl-4 space-y-2">
              {mcq.options.map((option, optIndex) => (
                <input
                  key={optIndex}
                  type="text"
                  className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder={`Option ${optIndex + 1}${optIndex === 0 ? ' (Correct Answer)' : ''}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                />
              ))}
            </div>
          </div>
        ))}
        <button onClick={addMcq} className="text-sm bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          Add Another MCQ
        </button>
      </div>

      <div className="flex justify-end gap-4 mt-8 border-t border-slate-700 pt-4">
        <button onClick={onCancel} className="bg-slate-600 text-white py-2 px-5 rounded-md hover:bg-slate-700">Cancel</button>
        <button onClick={handleSave} className="bg-green-600 text-white py-2 px-5 rounded-md hover:bg-green-700">Save Question</button>
      </div>
    </div>
  );
};

export default ComprehensionBuilder;
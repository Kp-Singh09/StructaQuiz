import { useState, useRef } from 'react';
import axios from 'axios';

const ComprehensionBuilder = ({ onSave, onCancel }) => {
  const [passage, setPassage] = useState('');
  const [mcqs, setMcqs] = useState([{ questionText: '', options: ['', '', ''], correctAnswer: '' }]);
  const [imageUrl, setImageUrl] = useState(''); // State to hold the uploaded image URL
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

  const addMcq = () => {
    setMcqs([...mcqs, { questionText: '', options: ['', '', ''], correctAnswer: '' }]);
  };

  const handleQuestionImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const authResponse = await axios.get('http://localhost:5000/api/imagekit/auth');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('publicKey', import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
    formData.append('signature', authResponse.data.signature);
    formData.append('expire', authResponse.data.expire);
    formData.append('token', authResponse.data.token);

    try {
      const uploadResponse = await axios.post('https://upload.imagekit.io/api/v1/files/upload', formData);
      setImageUrl(uploadResponse.data.url);
    } catch (err) {
      alert('Failed to upload image.');
    }
  };

  const handleSave = () => {
    if (!passage.trim() || mcqs.some(q => !q.questionText.trim())) {
      alert('Please fill in the passage and all question texts.');
      return;
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
    <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Create Comprehension Question</h3>
        <input type="file" ref={fileInputRef} onChange={handleQuestionImageUpload} style={{ display: 'none' }} accept="image/*" />
        <button onClick={() => fileInputRef.current.click()} className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-3 rounded-md">
          Add Image
        </button>
      </div>

      {imageUrl && <img src={imageUrl} alt="Question visual" className="w-full h-40 object-cover rounded-md mb-4" />}
      
      <textarea
        className="w-full p-2 border rounded-md"
        rows="6"
        placeholder="Enter the reading passage here..."
        value={passage}
        onChange={(e) => setPassage(e.target.value)}
      />

      <div className="mt-6">
        <h4 className="font-semibold text-lg mb-2">Multiple Choice Questions</h4>
        {mcqs.map((mcq, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-md mb-4 border">
            <input
              type="text"
              className="w-full p-2 border rounded-md mb-2"
              placeholder={`Question ${index + 1}`}
              value={mcq.questionText}
              onChange={(e) => handleMcqChange(index, 'questionText', e.target.value)}
            />
            {mcq.options.map((option, optIndex) => (
              <input
                key={optIndex}
                type="text"
                className="w-full p-2 border rounded-md mb-2 ml-4"
                placeholder={`Option ${optIndex + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
              />
            ))}
          </div>
        ))}
        <button onClick={addMcq} className="text-sm bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600">
          Add Another MCQ
        </button>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button onClick={onCancel} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400">Cancel</button>
        <button onClick={handleSave} className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">Save Question</button>
      </div>
    </div>
  );
};

export default ComprehensionBuilder;
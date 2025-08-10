import { useState, useRef } from 'react';
import axios from 'axios';

const ClozeBuilder = ({ onSave, onCancel }) => {
  const [passage, setPassage] = useState("Your sentence with words to be blanked out goes here.");
  const [options, setOptions] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const passageRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleMakeBlank = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (!selectedText) {
      alert('Please select a word or phrase from the passage to make it a blank.');
      return;
    }
    
    setOptions([...options, selectedText]);
    
    const currentPassage = passageRef.current.innerText;
    const newPassage = currentPassage.replace(selectedText, `[BLANK]`);
    setPassage(newPassage);
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
    const finalPassage = passageRef.current.innerText;
    if (!finalPassage.includes('[BLANK]') || options.length === 0) {
      alert('Please create at least one blank in the passage.');
      return;
    }
    onSave({ type: 'Cloze', passage: finalPassage, options, image: imageUrl });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-teal-200 mt-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-gray-800">Create Cloze (Fill-in-the-Blanks) Question</h3>
        <input type="file" ref={fileInputRef} onChange={handleQuestionImageUpload} style={{ display: 'none' }} accept="image/*" />
        <button onClick={() => fileInputRef.current.click()} className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-3 rounded-md">
          Add Image
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Type your sentence below. Then, select a word and click "Make Blank" to create a fill-in-the-blank question.
      </p>

      {imageUrl && <img src={imageUrl} alt="Question visual" className="w-full h-40 object-cover rounded-md mb-4" />}

      <div 
        ref={passageRef}
        contentEditable={true}
        className="w-full p-3 border rounded-md bg-gray-50 min-h-[100px]"
        suppressContentEditableWarning={true}
      >
        {passage}
      </div>

      <button 
        onClick={handleMakeBlank} 
        className="my-4 bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600"
      >
        Make Blank from Selection
      </button>

      <div className="mb-6">
        <h4 className="font-semibold text-lg mb-2">Blanked Words (Options)</h4>
        {options.length > 0 ? (
          <ul className="list-disc list-inside bg-gray-50 p-4 rounded-md border">
            {options.map((option, index) => (
              <li key={index} className="text-gray-700">{option}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No blanks created yet.</p>
        )}
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button onClick={onCancel} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400">Cancel</button>
        <button onClick={handleSave} className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">Save Question</button>
      </div>
    </div>
  );
};

export default ClozeBuilder;
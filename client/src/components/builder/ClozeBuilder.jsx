// src/components/builder/ClozeBuilder.jsx
import { useState, useRef } from 'react';
import axios from 'axios';

const ClozeBuilder = ({ onSave, onCancel }) => {
  const [options, setOptions] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const passageRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleMakeBlank = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const selectedText = selection.toString().trim();

    if (!selectedText) {
      alert('Please select a word or phrase from the passage to make it a blank.');
      return;
    }
    
    if (options.includes(selectedText)) {
      alert('This word has already been added as an option.');
      return;
    }

    setOptions(prevOptions => [...prevOptions, selectedText]);
    
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode('[BLANK]'));
  };
  
  const handleQuestionImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    const finalPassage = passageRef.current.innerText;
    if (!finalPassage.includes('[BLANK]') || options.length === 0) {
      alert('Please create at least one blank in the passage.');
      return;
    }

    let imageUrl = '';
    if (imageFile) {
        imageUrl = imagePreview; // Placeholder for actual ImageKit URL
    }

    onSave({ type: 'Cloze', passage: finalPassage, options, image: imageUrl });
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mt-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-white">Create Cloze (Fill-in-the-Blanks) Question</h3>
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

      <p className="text-sm text-slate-400 mb-4">
        Type your sentence below. Then, select a word and click "Make Blank" to create an answer option.
      </p>

      <div 
        ref={passageRef}
        contentEditable={true}
        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-md text-white min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
        suppressContentEditableWarning={true}
      >
        Your sentence with words to be blanked out goes here.
      </div>

      <button 
        onClick={handleMakeBlank} 
        className="my-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Make Blank from Selection
      </button>

      <div className="mb-6">
        <h4 className="font-semibold text-lg mb-2 text-white">Answer Options</h4>
        {options.length > 0 ? (
          <div className="bg-slate-900/70 p-4 rounded-md border border-slate-700">
            <ul className="flex flex-wrap gap-2">
              {options.map((option, index) => (
                <li key={index} className="bg-slate-700 text-white px-3 py-1 rounded-full text-sm">{option}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-slate-500 italic">No answer options created yet.</p>
        )}
      </div>

      <div className="flex justify-end gap-4 mt-8 border-t border-slate-700 pt-4">
        <button onClick={onCancel} className="bg-slate-600 text-white py-2 px-5 rounded-md hover:bg-slate-700">Cancel</button>
        <button onClick={handleSave} className="bg-green-600 text-white py-2 px-5 rounded-md hover:bg-green-700">Save Question</button>
      </div>
    </div>
  );
};

export default ClozeBuilder;
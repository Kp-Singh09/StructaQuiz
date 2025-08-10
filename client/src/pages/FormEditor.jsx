import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ComprehensionBuilder from '../components/builder/ComprehensionBuilder';
import CategorizeBuilder from '../components/builder/CategorizeBuilder';
import ClozeBuilder from '../components/builder/ClozeBuilder';

const FormEditor = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeBuilder, setActiveBuilder] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/forms/${formId}`);
        setForm(response.data);
      } catch (err) {
        setError('Failed to fetch form data.');
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [formId]);

  const handleSaveQuestion = async (questionData) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/forms/${formId}/questions`, questionData);
      const newQuestion = response.data;
      setForm(prevForm => ({
        ...prevForm,
        questions: [...prevForm.questions, newQuestion],
      }));
      setActiveBuilder(null);
    } catch (err) {
      alert("Error: Could not save the question.");
    }
  };

  const handleHeaderImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 1. Get auth token
    const authResponse = await axios.get('http://localhost:5000/api/imagekit/auth');
    
    // 2. Prepare form data for upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    // You need to create a .env file in your /client directory for this key
    formData.append('publicKey', import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
    formData.append('signature', authResponse.data.signature);
    formData.append('expire', authResponse.data.expire);
    formData.append('token', authResponse.data.token);

    try {
      // 3. Upload to ImageKit
      const uploadResponse = await axios.post('https://upload.imagekit.io/api/v1/files/upload', formData);
      const imageUrl = uploadResponse.data.url;

      // 4. Save URL to our backend
      await axios.put(`http://localhost:5000/api/forms/${formId}`, { headerImage: imageUrl });

      // 5. Update local state
      setForm(prevForm => ({ ...prevForm, headerImage: imageUrl }));
    } catch (err) {
      alert('Failed to upload image.');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading form...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  // --- ADD THIS CHECK ---
  // If loading is finished but the form is still null, don't render the rest.
  if (!form) return null;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        {form.headerImage && <img src={form.headerImage} alt="Form Header" className="w-full h-48 object-cover rounded-t-lg mb-4" />}
        
        <div className="flex justify-between items-start">
            <h1 className="text-4xl font-bold">{form.title}</h1>
            <input type="file" ref={fileInputRef} onChange={handleHeaderImageUpload} style={{ display: 'none' }} accept="image/*" />
            {/* THIS IS THE CORRECTED LINE */}
            <button onClick={() => fileInputRef.current.click()} className="bg-gray-200 text-gray-700 py-1 px-3 rounded-md text-sm hover:bg-gray-300">
                Upload Header
            </button>
        </div>
        <p className="text-gray-500 mt-2">Editing form ID: {form._id}</p>
      </div>

      <div className="space-y-6">
        {form.questions.map((question, index) => (
          <div key={question._id} className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg font-semibold">Question {index + 1}: {question.type}</p>
            <p className="mt-2 text-gray-700">{question.passage || (question.comprehensionPassage && question.comprehensionPassage.substring(0, 100)) || 'Categorize Question'}...</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        {activeBuilder ? (
          <div>
            {activeBuilder === 'comprehension' && <ComprehensionBuilder onSave={handleSaveQuestion} onCancel={() => setActiveBuilder(null)}/>}
            {activeBuilder === 'categorize' && <CategorizeBuilder onSave={handleSaveQuestion} onCancel={() => setActiveBuilder(null)}/>}
            {activeBuilder === 'cloze' && <ClozeBuilder onSave={handleSaveQuestion} onCancel={() => setActiveBuilder(null)}/>}
          </div>
        ) : (
          <div className="text-center p-6 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Add a New Question</h3>
            <div className="flex justify-center gap-4">
              <button onClick={() => setActiveBuilder('comprehension')} className="bg-blue-600 text-white py-2 px-5 rounded-lg shadow hover:bg-blue-700 transition-colors">
                Comprehension
              </button>
              <button onClick={() => setActiveBuilder('categorize')} className="bg-purple-600 text-white py-2 px-5 rounded-lg shadow hover:bg-purple-700 transition-colors">
                Categorize
              </button>
              <button onClick={() => setActiveBuilder('cloze')} className="bg-teal-600 text-white py-2 px-5 rounded-lg shadow hover:bg-teal-700 transition-colors">
                Cloze
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormEditor;
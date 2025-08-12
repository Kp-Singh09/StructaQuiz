// src/pages/FormRenderer.jsx
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import ComprehensionRenderer from '../components/renderer/ComprehensionRenderer';
import CategorizeRenderer from '../components/renderer/CategorizeRenderer';
import ClozeRenderer from '../components/renderer/ClozeRenderer';

const FormRenderer = () => {
  const { formId } = useParams();
  const { user } = useUser(); 
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/forms/${formId}`);
        setForm(response.data);
      } catch (err) {
        setError('Failed to fetch form. Please check the URL.');
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [formId]);

  const handleAnswerChange = useCallback((questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  }, []);

  const handleSubmit = async () => {
    if (!user) {
      alert("You must be signed in to submit a response.");
      return;
    }
    try {
      // Capture the response from the backend
      const response = await axios.post('http://localhost:5000/api/responses', {
        formId,
        answers: Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer })),
        userId: user.id,
        userEmail: user.primaryEmailAddress.emailAddress,
      });
      
      // Extract the new responseId and redirect
      const { responseId } = response.data;
      if (responseId) {
        navigate(`/results/${responseId}`);
      } else {
        alert('Form submitted, but could not redirect to results.');
      }

    } catch (err) {
      alert('Error submitting form. Please try again.');
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0A0F1F] flex items-center justify-center text-white text-xl">Loading Form...</div>;
  if (error) return <div className="min-h-screen bg-[#0A0F1F] flex items-center justify-center text-red-500 text-xl">{error}</div>;
  if (!form) return null;

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 p-8 rounded-lg shadow-lg mb-10 text-center">
          {/* --- THIS IS THE CORRECTED LINE --- */}
          {/* It checks if form.headerImage exists and then renders the img tag */}
          {form.headerImage && (
            <img 
              src={form.headerImage} 
              alt="Form Header" 
              className="w-full h-56 object-cover rounded-t-lg mb-8 -mx-8 -mt-8" 
            />
          )}
          <h1 className="text-4xl font-bold">{form.title}</h1>
        </div>
        
        <div className="space-y-8">
            {form.questions.map(question => {
                switch (question.type) {
                case 'Comprehension':
                    return <ComprehensionRenderer key={question._id} question={question} onAnswerChange={handleAnswerChange} />;
                case 'Categorize':
                    return <CategorizeRenderer key={question._id} question={question} onAnswerChange={handleAnswerChange} />;
                case 'Cloze':
                    return <ClozeRenderer key={question._id} question={question} onAnswerChange={handleAnswerChange} />;
                default:
                    return null;
                }
            })}
        </div>

        <div className="mt-12 text-center">
          <button onClick={handleSubmit} className="glow-btn text-xl">
            Submit Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormRenderer;
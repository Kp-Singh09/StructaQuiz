import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ComprehensionRenderer from '../components/renderer/ComprehensionRenderer';
import CategorizeRenderer from '../components/renderer/CategorizeRenderer';
import ClozeRenderer from '../components/renderer/ClozeRenderer';

const FormRenderer = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});

  // Fetches the form data when the component mounts or formId changes
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/forms/${formId}`);
        setForm(response.data);
      } catch (err) {
        setError('Failed to fetch form. Please check the URL.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [formId]);

  // Memoized callback for child components to update the answers state
  const handleAnswerChange = useCallback((questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  }, []); // Empty dependency array ensures this function is created only once

  // Handles the final form submission
  const handleSubmit = async () => {
    const submissionData = {
      formId,
      answers: Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      })),
    };

    try {
      await axios.post('http://localhost:5000/api/responses', submissionData);
      alert('Form submitted successfully!');
      // You could redirect to a thank you page here, e.g., navigate('/thank-you');
    } catch (err) {
      alert('Error submitting form. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading form...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 text-center">
        {form.headerImage && <img src={form.headerImage} alt="Form Header" className="w-full h-48 object-cover rounded-t-lg mb-6 -mt-6 -mx-6" />}
        
        <h1 className="text-4xl font-bold mb-2">{form.title}</h1>
      </div>
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

      <div className="mt-8 text-center">
        <button onClick={handleSubmit} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
          Submit Form
        </button>
      </div>
    </div>
  );
};

export default FormRenderer;
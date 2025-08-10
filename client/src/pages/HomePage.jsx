import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const navigate = useNavigate();

  const handleCreateForm = async () => {
    try {
      // 1. Call your backend to create a new form document
      const response = await axios.post('http://localhost:5000/api/forms');
      const newForm = response.data;
      
      // 2. Get the new form's ID and navigate to the editor
      navigate(`/editor/${newForm._id}`);
    } catch (error) {
      console.error('Failed to create a new form', error);
      alert('Could not create a new form. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-8">StructaQuiz Form Builder</h1>
        <button 
          onClick={handleCreateForm}
          className="bg-blue-600 text-white font-bold py-4 px-8 text-xl rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Create a New Form
        </button>
      </div>
    </div>
  );
};

export default HomePage;
// src/pages/ResponseViewerPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const ResponseViewerPage = () => {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both form details and responses for that form
        const formRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/forms/${formId}`);
        const responsesRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/responses/${formId}`);
        
        setForm(formRes.data);
        setResponses(responsesRes.data);
      } catch (error) {
        console.error("Failed to fetch response data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [formId]);

  if (loading) return <p className="text-center text-slate-400 p-8">Loading responses...</p>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Link to="/responses" className="text-blue-400 hover:underline mb-6 block">&larr; Back to All Forms</Link>
      <h1 className="text-4xl font-bold mb-2">Responses for "{form?.title}"</h1>
      <p className="text-slate-400 mb-8">{responses.length} total submission(s)</p>

      {responses.length > 0 ? (
        <div className="space-y-6">
          {responses.map((response) => (
            <div key={response._id} className="bg-slate-800/50 p-6 rounded-lg flex justify-between items-center transition-shadow hover:shadow-xl">
              <div>
                <p className="font-semibold text-white">{response.userEmail}</p>
                <p className="text-sm text-slate-400 mt-1">
                  Score: {response.score} / {response.totalMarks}
                </p>
              </div>
              <Link 
                to={`/results/${response._id}`} 
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-transform hover:scale-105"
              >
                View Result
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-800/50 rounded-lg">
          <h3 className="text-2xl font-semibold">No responses yet for this form.</h3>
        </div>
      )}
    </motion.div>
  );
};

export default ResponseViewerPage;
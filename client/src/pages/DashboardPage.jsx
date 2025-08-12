// client/src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedFormId, setCopiedFormId] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchUserForms = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/forms/user/${user.id}`);
          setForms(response.data);
        } catch (error) {
          console.error("Failed to fetch user forms", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserForms();
    }
  }, [user]);

  const handleCreateForm = () => {
    navigate('/editor/new');
  };

  const handleShare = (formId, event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const shareLink = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopiedFormId(formId);
      setTimeout(() => setCopiedFormId(null), 2000);
    });
  };

  // --- NEW DELETE HANDLER ---
  const handleDelete = async (formId, formTitle, event) => {
    event.preventDefault();
    event.stopPropagation();

    if (window.confirm(`Are you sure you want to delete "${formTitle}"? This action cannot be undone.`)) {
      try {
        await axios.delete(`http://localhost:5000/api/forms/${formId}`);
        // Update state to remove the form from the UI instantly
        setForms(forms.filter(form => form._id !== formId));
      } catch (error) {
        console.error("Failed to delete form", error);
        alert("Could not delete the form. Please try again.");
      }
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center p-8">
            <p className="text-slate-400">Loading your forms...</p>
        </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-bold">Your Forms</h1>
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateForm} 
                className="glow-btn"
            >
                + Create New Form
            </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {forms.length > 0 ? (
                forms.map((form, index) => (
                    <div key={form._id} className="flex flex-col">
                        <Link to={`/editor/${form._id}`} className="block bg-slate-800/50 rounded-t-2xl p-6 flex-grow hover:bg-slate-800 transition-colors">
                            <h3 className="text-xl font-semibold mb-2 truncate">{form.title}</h3>
                            <p className="text-gray-400 text-sm">{form.responses.length} response(s)</p>
                        </Link>
                        {/* --- UPDATED BUTTON CONTAINER --- */}
                        <div className="bg-slate-800/50 rounded-b-2xl p-4 flex gap-2 border-t border-slate-700">
                            <button 
                              onClick={(e) => handleShare(form._id, e)}
                              className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
                                copiedFormId === form._id 
                                ? 'bg-green-500/20 text-green-300' 
                                : 'bg-purple-500/20 text-purple-300 hover:bg-purple-600 hover:text-white'
                              }`}
                            >
                              {copiedFormId === form._id ? 'Copied!' : 'Share'}
                            </button>
                            <Link to={`/editor/${form._id}`} className="w-full">
                                <button className="w-full bg-blue-500/20 text-blue-300 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 hover:text-white transition-colors">
                                  Edit
                                </button>
                            </Link>
                            {/* --- NEW DELETE BUTTON --- */}
                            <button 
                              onClick={(e) => handleDelete(form._id, form.title, e)}
                              className="p-2 px-3 bg-red-500/20 text-red-300 rounded-lg text-sm font-semibold hover:bg-red-600 hover:text-white transition-colors"
                              title="Delete Form"
                            >
                              🗑️
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-full text-center py-16 bg-slate-800/50 rounded-2xl">
                    <h3 className="text-2xl font-semibold">No forms yet!</h3>
                    <p className="text-gray-400 mt-2">Click "Create New Form" to get started.</p>
                </div>
            )}
        </div>
    </motion.div>
  );
};

export default DashboardPage;
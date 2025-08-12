// src/components/VerticalSidebar.jsx
import { NavLink, Link, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
    { href: "/dashboard", title: "Dashboard", icon: <span>📊</span> },
    { href: "/editor/new", title: "Create Form", icon: <span>📄</span> },
    { href: "/responses", title: "Responses", icon: <span>📈</span> }, 
    { href: "/submissions", title: "My Submissions", icon: <span>✅</span> },
    { href: "/stats", title: "Stats", icon: <span>⭐</span> },
  ];

const VerticalSidebar = () => {
  const { user } = useUser();
  const { formId } = useParams();
  const [userForms, setUserForms] = useState([]);
  const [isFormsExpanded, setIsFormsExpanded] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchUserForms = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/forms/user/${user.id}`);
          setUserForms(response.data);
        } catch (error) {
          console.error("Failed to fetch user forms", error);
        }
      };
      fetchUserForms();
    }
  }, [user, formId]); // Refetch when formId changes to update the list immediately after creation

  return (
    <aside className="fixed top-0 left-0 w-64 h-full bg-[#101828] border-r border-slate-800 z-40">
      <div className="h-20 flex items-center px-6 border-b border-slate-800">
        <Link to="/" className="text-2xl font-bold text-white drop-shadow-md">
          Structa<span className="text-blue-400">Quiz</span>
        </Link>
      </div>

      <nav className="flex flex-col gap-4 p-4">
        {navItems.map((item, index) => (
          <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors text-lg font-medium ${
                  isActive && !formId
                    ? "bg-blue-500/20 text-blue-300"
                    : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                }`
              }
            >
              <span className="text-2xl">{item.icon}</span>
              {item.title}
            </NavLink>
          </motion.div>
        ))}

        {/* --- CREATED FORMS SECTION --- */}
        <div className="mt-4">
            <button 
                onClick={() => setIsFormsExpanded(!isFormsExpanded)}
                className="w-full flex justify-between items-center text-left text-sm font-semibold text-slate-500 px-4 py-2 rounded-md hover:bg-slate-700/50"
            >
                <span>CREATED FORMS</span>
                <motion.span animate={{ rotate: isFormsExpanded ? 0 : -90 }}>▼</motion.span>
            </button>
            <AnimatePresence>
                {isFormsExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-2 space-y-1 overflow-hidden"
                    >
                        {userForms.length > 0 ? userForms.map(form => (
                            <NavLink
                                key={form._id}
                                to={`/editor/${form._id}`}
                                className={({ isActive }) => 
                                    `block text-sm px-4 py-2 rounded-md truncate ${
                                        isActive 
                                        ? 'bg-slate-700 text-white' 
                                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                                    }`
                                }
                            >
                                {form.title}
                            </NavLink>
                        )) : (
                            <p className="text-xs text-slate-500 px-4 py-2">No forms created yet.</p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </nav>
    </aside>
  );
};

export default VerticalSidebar;
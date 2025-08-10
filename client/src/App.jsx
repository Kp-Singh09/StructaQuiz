// client/src/App.jsx
import { Routes, Route } from 'react-router-dom';
import FormEditor from './pages/FormEditor';
import FormRenderer from './pages/FormRenderer';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
         <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/editor/:formId" element={<FormEditor />} />
            <Route path="/form/:formId" element={<FormRenderer />} />
        </Routes>
    </div>
  );
}

export default App;
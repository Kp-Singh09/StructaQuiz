// src/components/builder/CategorizeBuilder.jsx
import { useState, useRef } from 'react';
import axios from 'axios';

const CategorizeBuilder = ({ onSave, onCancel }) => {
  const [categories, setCategories] = useState(['Category 1', 'Category 2']);
  const [items, setItems] = useState([{ text: '', category: 'Category 1' }]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  const handleCategoryChange = (index, value) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    setCategories(newCategories);
  };

  const addCategory = () => setCategories([...categories, `Category ${categories.length + 1}`]);
  
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { text: '', category: categories[0] || '' }]);

  const handleQuestionImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (categories.some(c => !c.trim()) || items.some(i => !i.text.trim())) {
      alert('Please fill out all category and item fields.');
      return;
    }
    
    let imageUrl = '';
    if (imageFile) {
        imageUrl = imagePreview; // Placeholder for actual ImageKit URL
    }

    onSave({ type: 'Categorize', categories, items, image: imageUrl });
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mt-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Create Categorize Question</h3>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
            <h4 className="font-semibold text-lg mb-2 text-white">Categories</h4>
            <div className="space-y-2">
                {categories.map((category, index) => (
                <input
                    key={index}
                    type="text"
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={category}
                    onChange={(e) => handleCategoryChange(index, e.target.value)}
                />
                ))}
            </div>
            <button onClick={addCategory} className="mt-3 text-sm bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                Add Category
            </button>
        </div>

        <div>
            <h4 className="font-semibold text-lg mb-2 text-white">Items</h4>
            <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-slate-900/70 border border-slate-700 rounded-md">
                      <input
                        type="text"
                        className="flex-grow p-2 bg-slate-800 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Item name"
                        value={item.text}
                        onChange={(e) => handleItemChange(index, 'text', e.target.value)}
                      />
                      <select
                        className="p-2 border border-slate-600 rounded-md bg-slate-800 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={item.category}
                        onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                      >
                        {categories.map((cat, catIndex) => (
                            <option key={catIndex} value={cat}>{cat}</option>
                        ))}
                      </select>
                  </div>
                ))}
            </div>
            <button onClick={addItem} className="mt-3 text-sm bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                Add Item
            </button>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8 border-t border-slate-700 pt-4">
        <button onClick={onCancel} className="bg-slate-600 text-white py-2 px-5 rounded-md hover:bg-slate-700">Cancel</button>
        <button onClick={handleSave} className="bg-green-600 text-white py-2 px-5 rounded-md hover:bg-green-700">Save Question</button>
      </div>
    </div>
  );
};

export default CategorizeBuilder;
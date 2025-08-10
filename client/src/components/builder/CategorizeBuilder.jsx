import { useState, useRef } from 'react';
import axios from 'axios';

const CategorizeBuilder = ({ onSave, onCancel }) => {
  const [categories, setCategories] = useState(['Category 1']);
  const [items, setItems] = useState([{ text: '', category: 'Category 1' }]);
  const [imageUrl, setImageUrl] = useState('');
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

  const handleQuestionImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const authResponse = await axios.get('http://localhost:5000/api/imagekit/auth');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('publicKey', import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
    formData.append('signature', authResponse.data.signature);
    formData.append('expire', authResponse.data.expire);
    formData.append('token', authResponse.data.token);

    try {
      const uploadResponse = await axios.post('https://upload.imagekit.io/api/v1/files/upload', formData);
      setImageUrl(uploadResponse.data.url);
    } catch (err) {
      alert('Failed to upload image.');
    }
  };

  const handleSave = () => {
    if (categories.some(c => !c.trim()) || items.some(i => !i.text.trim())) {
      alert('Please fill out all category and item fields.');
      return;
    }
    onSave({ type: 'Categorize', categories, items, image: imageUrl });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-purple-200 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Create Categorize Question</h3>
        <input type="file" ref={fileInputRef} onChange={handleQuestionImageUpload} style={{ display: 'none' }} accept="image/*" />
        <button onClick={() => fileInputRef.current.click()} className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-3 rounded-md">
          Add Image
        </button>
      </div>
      
      {imageUrl && <img src={imageUrl} alt="Question visual" className="w-full h-40 object-cover rounded-md mb-4" />}

      <div className="mb-6">
        <h4 className="font-semibold text-lg mb-2">Categories</h4>
        {categories.map((category, index) => (
          <input
            key={index}
            type="text"
            className="w-full p-2 border rounded-md mb-2"
            value={category}
            onChange={(e) => handleCategoryChange(index, e.target.value)}
          />
        ))}
        <button onClick={addCategory} className="text-sm bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600">
          Add Category
        </button>
      </div>

      <div>
        <h4 className="font-semibold text-lg mb-2">Items</h4>
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-4 mb-2 p-2 bg-gray-50 border rounded-md">
            <input
              type="text"
              className="flex-grow p-2 border rounded-md"
              placeholder="Item name"
              value={item.text}
              onChange={(e) => handleItemChange(index, 'text', e.target.value)}
            />
            <select
              className="p-2 border rounded-md bg-white"
              value={item.category}
              onChange={(e) => handleItemChange(index, 'category', e.target.value)}
            >
              {categories.map((cat, catIndex) => (
                <option key={catIndex} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        ))}
        <button onClick={addItem} className="text-sm bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600">
          Add Item
        </button>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button onClick={onCancel} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400">Cancel</button>
        <button onClick={handleSave} className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">Save Question</button>
      </div>
    </div>
  );
};

export default CategorizeBuilder;
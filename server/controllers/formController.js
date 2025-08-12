import Form from '../models/Form.js';
import Question from '../models/Question.js';

// --- NEW CONTROLLER FUNCTION ---
// @desc    Get all forms for a specific user
// @route   GET /api/forms/user/:userId
// @access  Private
export const getFormsByUser = async (req, res) => {
  try {
    const forms = await Form.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not retrieve forms' });
  }
};

export const updateForm = async (req, res) => {
    // ... (This function remains the same)
};
  
export const createForm = async (req, res) => {
  try {
    // --- UPDATE THIS FUNCTION ---
    // We now require a userId to be passed in the request body
    const { title, userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required to create a form.' });
    }

    const form = new Form({
      title: title || 'My New Form',
      userId: userId, // Save the userId
    });

    const newForm = await form.save();
    res.status(201).json(newForm);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not create form', error });
  }
};

export const addQuestionToForm = async (req, res) => {
    try {
      const form = await Form.findById(req.params.id);
  
      if (!form) {
        return res.status(404).json({ message: 'Form not found' });
      }
  
      // The question data will come from the request body
      // This should match the structure of our Question schema
      const questionData = req.body;
  
      const newQuestion = new Question(questionData);
      await newQuestion.save();
  
      // Add the new question's ID to the form's questions array
      form.questions.push(newQuestion._id);
      await form.save();
  
      res.status(201).json(newQuestion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error: Could not add question' });
    }
  };

  export const getFormById = async (req, res) => {
    try {
      // Find the form by its ID and use .populate()
      // 'questions' is the field name in the Form schema
      const form = await Form.findById(req.params.id).populate('questions');
  
      if (!form) {
        return res.status(404).json({ message: 'Form not found' });
      }
  
      res.status(200).json(form);
    } catch (error) {
      res.status(500).json({ message: 'Server Error: Could not retrieve form' });
    }

    
  };
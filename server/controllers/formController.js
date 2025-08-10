// server/controllers/formController.js
import Form from '../models/Form.js';
import Question from '../models/Question.js';

// @desc    Create a new empty form
// @route   POST /api/forms
// @access  Public
export const updateForm = async (req, res) => {
    try {
      const form = await Form.findById(req.params.id);
      if (!form) {
        return res.status(404).json({ message: 'Form not found' });
      }
  
      // Update fields from request body
      form.title = req.body.title || form.title;
      form.headerImage = req.body.headerImage || form.headerImage;
  
      const updatedForm = await form.save();
      res.status(200).json(updatedForm);
    } catch (error) {
      res.status(500).json({ message: 'Server Error: Could not update form' });
    }
  };
  
export const createForm = async (req, res) => {
  try {
    // Create a new form document with a default title or a title from the request body
    const form = new Form({
      title: req.body.title || 'My New Form',
      // Other fields will be added later
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
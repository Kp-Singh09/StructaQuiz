import Response from '../models/Response.js';
import Form from '../models/Form.js';

// @desc    Submit answers for a form
// @route   POST /api/responses
// @access  Public
export const createResponse = async (req, res) => {
  try {
    const { formId, answers } = req.body;

    // Validate that the form exists
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const newResponse = new Response({ formId, answers });
    const savedResponse = await newResponse.save();

    // Optional: Add the response ID to the form's responses array
    form.responses.push(savedResponse._id);
    await form.save();

    res.status(201).json({ message: 'Response submitted successfully!', responseId: savedResponse._id });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not submit response', error });
  }
};
import Response from '../models/Response.js';
import Form from '../models/Form.js';
import Question from '../models/Question.js';

export const getResponsesByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        // Find all responses by this user and populate the form details (like the title)
        const responses = await Response.find({ userId })
            .populate({
                path: 'formId',
                model: 'Form',
                select: 'title' // We only need the title for the list
            })
            .sort({ submittedAt: -1 }); // Show the most recent first

        res.status(200).json(responses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Could not retrieve user responses', error });
    }
};

export const getSingleResponseById = async (req, res) => {
  try {
    const { responseId } = req.params;
    const response = await Response.findById(responseId).populate({
      path: 'answers.questionId',
      model: 'Question'
    });
    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not retrieve response', error });
  }
};

export const getResponsesByFormId = async (req, res) => {
    try {
      const { formId } = req.params;
      
      // Find all responses for the given formId and populate the question details
      const responses = await Response.find({ formId }).populate({
        path: 'answers.questionId',
        model: 'Question'
      });
  
      if (!responses) {
        return res.status(404).json({ message: 'No responses found for this form' });
      }
  
      res.status(200).json(responses);
    } catch (error) {
      res.status(500).json({ message: 'Server Error: Could not retrieve responses', error });
    }
  };

export const createResponse = async (req, res) => {
  try {
    const { formId, answers, userId, userEmail } = req.body;

    if (!userId || !userEmail) {
      return res.status(400).json({ message: 'User details are required.' });
    }

    const form = await Form.findById(formId).populate('questions');
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    let score = 0;
    const totalMarks = form.questions.length * 10;
    const marksPerQuestion = 10;

    // --- SCORING LOGIC ---
    for (const submittedAnswer of answers) {
      const question = form.questions.find(q => q._id.toString() === submittedAnswer.questionId);
      if (!question) continue;

      let isCorrect = false;
      switch (question.type) {
        case 'Comprehension':
          // Check if submitted answers match correct answers for each MCQ
          const correctMcqs = question.mcqs.filter(mcq => {
            const mcqId = mcq._id.toString();
            return submittedAnswer.answer[mcqId] === mcq.correctAnswer;
          });
          // For simplicity, we give marks if all MCQs are correct.
          if (correctMcqs.length === question.mcqs.length) isCorrect = true;
          break;
        
        case 'Categorize':
          // Check if all items are in their correct categories
          const allCategorizedCorrectly = question.items.every(item => {
              const submittedCategory = Object.keys(submittedAnswer.answer).find(cat => submittedAnswer.answer[cat].includes(item.text));
              return submittedCategory === item.category;
          });
          if (allCategorizedCorrectly) isCorrect = true;
          break;
          
        case 'Cloze':
          // Check if all blanks are filled with the correct options
          // This assumes the order of options matches the order of [BLANK]s
          const passageBlanks = question.passage.match(/\[BLANK\]/g) || [];
          let clozeCorrect = true;
          for (let i = 0; i < passageBlanks.length; i++) {
              if (submittedAnswer.answer[`blank_${i}`] !== question.options[i]) {
                  clozeCorrect = false;
                  break;
              }
          }
          if (clozeCorrect) isCorrect = true;
          break;
      }

      if (isCorrect) {
        score += marksPerQuestion;
      }
    }

    const newResponse = new Response({
      formId,
      answers,
      userId,
      userEmail,
      score,
      totalMarks
    });
    
    const savedResponse = await newResponse.save();
    form.responses.push(savedResponse._id);
    await form.save();

    res.status(201).json({ message: 'Response submitted successfully!', responseId: savedResponse._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error: Could not submit response', error });
  }
};
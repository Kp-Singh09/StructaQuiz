import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled Form' },
  headerImage: { type: String, default: null }, 
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  responses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Response' }],
  createdAt: { type: Date, default: Date.now },
});

const Form = mongoose.model('Form', formSchema);
export default Form;
import express from 'express';
import { createForm, addQuestionToForm, getFormById, updateForm } from '../controllers/formController.js';


const router = express.Router();

router.post('/', createForm);

router.get('/:id', getFormById);
router.put('/:id', updateForm );
router.post('/:id/questions', addQuestionToForm);


export default router;
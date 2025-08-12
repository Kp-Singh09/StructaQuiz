// /server/routes/formRoutes.js
import express from 'express';
// --- IMPORT THE NEW CONTROLLER ---
import { createForm, addQuestionToForm, getFormById, updateForm, getFormsByUser } from '../controllers/formController.js';


const router = express.Router();

// --- ADD THIS NEW ROUTE ---
router.get('/user/:userId', getFormsByUser);

router.post('/', createForm);
router.get('/:id', getFormById);
router.put('/:id', updateForm );
router.post('/:id/questions', addQuestionToForm);

export default router;
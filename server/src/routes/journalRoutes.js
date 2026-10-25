import express from 'express';
import { createEntry, getEntries, addReflectionResponse } from '../controllers/journalController.js';

const router = express.Router();

// Temporarily bypass token check
router.post('/entries', createEntry);
router.get('/entries', getEntries);
router.post('/reflections', addReflectionResponse);

export default router;
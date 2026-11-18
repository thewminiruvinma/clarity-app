import express from 'express';
import { createEntry, getEntries, addReflectionResponse } from '../controllers/journalController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Enforce strict user authentication and account isolation via JWT token
router.post('/entries', authenticateToken, createEntry);
router.get('/entries', authenticateToken, getEntries);
router.post('/reflections', authenticateToken, addReflectionResponse);

export default router;
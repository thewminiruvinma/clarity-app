import express from 'express';
import { getEntries, createEntry, addReflectionResponse } from '../controllers/journalController.js';
import { authenticateToken } from '../middleware/authMiddleware.js'; // මෙහි verifyToken වෙනුවට නැම්ඩ් ඉම්පෝට් එකක් ලෙස authenticateToken යොදා ඇත

const router = express.Router();

// Routes for journal entries and reflections
router.get('/entries', authenticateToken, getEntries);
router.post('/entries', authenticateToken, createEntry);
router.post('/reflections', authenticateToken, addReflectionResponse);

export default router;
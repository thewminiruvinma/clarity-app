import express from 'express';

const router = express.Router();

// Temporary mock routes for testing
router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint ready' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint ready' });
});

export default router;
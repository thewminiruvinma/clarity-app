import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'clarity_secret_key';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Strictly require a valid token
  if (!token) {
    return res.status(401).json({ error: 'Access token required for authentication' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    // Attach the verified user payload (contains id, email, name) to req.user
    req.user = user;
    next();
  });
};
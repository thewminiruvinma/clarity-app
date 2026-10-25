import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Provide a default dev user if token is missing or dummy
  if (!token || token === 'dev_dummy_token') {
    req.user = { id: 'dev-user-id', email: 'maya@example.com' };
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET || 'clarity_secret_key', (err, user) => {
    if (err) {
      // Dev fallback if JWT fails
      req.user = { id: 'dev-user-id', email: 'maya@example.com' };
      return next();
    }
    req.user = user;
    next();
  });
};
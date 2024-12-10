const jwt = require('jsonwebtoken');

const requireAuth = (roles = []) => (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from the "Bearer <token>" format
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!roles.includes(decoded.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    req.user = decoded; // Attach the decoded user information to the request
    next();
  } catch (error) {
    console.error('Token verification failed:', error); // Log error for debugging purposes
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { requireAuth };

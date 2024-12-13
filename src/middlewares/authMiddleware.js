const jwt = require('jsonwebtoken');

const requireAuth = (roles = []) => (req, res, next) => {
  // Extract token from either cookies or headers
  const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify token and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if role is present in decoded token
    if (!decoded.role) {
      return res.status(403).json({ message: 'Role not found in token' });
    }

    // Check if user's role matches the required roles
    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Attach decoded user info to the request object
    req.user = decoded;
    
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error('Token verification failed:', error); // Log error for debugging
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { requireAuth };

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    // Check if user exists in the request
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { role } = req.user;

    // Log the role for debugging purposes
    console.log('User role:', role);

    if (!roles.includes(role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Proceed to next middleware or route handler
    next();
  };
};

module.exports = roleMiddleware;

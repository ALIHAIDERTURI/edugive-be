const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Register a new user
const register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword, role });
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error });
  }
};

// Login an existing user
const login = async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // Find user by username or email
    const user = await User.findOne({ $or: [{ username }, { email }] });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ 
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name, // Add any other user fields you need
        role: user.role,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};


// Google OAuth callback
const googleCallback = (req, res) => {
  res.redirect(process.env.CLIENT_URL);
};

// Facebook OAuth callback
const facebookCallback = (req, res) => {
  res.redirect(process.env.CLIENT_URL);
};

module.exports = {
  register,
  login,
  googleCallback,
  facebookCallback,
};

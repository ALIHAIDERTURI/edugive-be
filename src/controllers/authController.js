const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { Cookie } = require('express-session');

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

const login = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Find user by username or email
    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Clear any previous 'auth_token' cookies before setting a new one
    res.clearCookie('auth_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
    
    // Clear the 'token' cookie if it was set elsewhere (to avoid conflicts)
    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });

    // Set the token in the 'auth_token' cookie
    res.cookie('auth_token', token, {
      httpOnly: true,  // Prevents JavaScript access
      secure: process.env.NODE_ENV === 'production',  // Only send over HTTPS in production
      maxAge: 3600000,  // 1 hour expiry
      sameSite: 'Strict',  // Prevent CSRF attacks
    });

    res.status(200).json({ 
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
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

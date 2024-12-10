require('dotenv').config();
const express = require('express');
const passport = require('./src/configs/passportConfig');
const authRoutes = require('./src/routes/authRoutes');
const session = require('express-session');
const mongoose = require('mongoose');
const { connectDB } = require('./src/configs/dbConfig');

const app = express();

// Middleware configurations
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Route setup
app.use('/api/v1/auth', authRoutes);

// Root route for connection status
app.get('/', (req, res) => {
  const mongooseStatus = mongoose.connection.readyState;
  res.send(`Server is running. Database connection status: ${mongooseStatus === 1 ? 'Connected' : 'Disconnected'}`);
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start the server and connect to the database
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`.underline.bgCyan);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

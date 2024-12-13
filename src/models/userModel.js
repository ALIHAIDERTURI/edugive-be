const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    collation: { locale: 'en', strength: 2 } // Case-insensitive uniqueness
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'], // Email format validation
    collation: { locale: 'en', strength: 2 } // Case-insensitive uniqueness
  },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['student', 'instructor', 'admin'], 
    default: 'student' 
  },
  googleId: { type: String, default: null },
  facebookId: { type: String, default: null },
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course' // Reference to the Course model
  }],
  createdAt: { type: Date, default: Date.now },
});

// Define compound indexes for case-insensitive uniqueness
userSchema.index({ username: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });
userSchema.index({ email: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

module.exports = mongoose.model('User', userSchema);

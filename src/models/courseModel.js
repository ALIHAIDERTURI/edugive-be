const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Course schema
const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
    trim: true, // e.g., "3 months"
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Reference to the Category model
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming User model exists to track the creator
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming User model exists to track students
  }],
});

courseSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the Course model
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Category schema
const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true, // Ensure category names are unique
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

categorySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the Category model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;

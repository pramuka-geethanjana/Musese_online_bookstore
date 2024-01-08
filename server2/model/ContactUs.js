const mongoose = require('mongoose');

// Define the schema for the contact information
const sys = new mongoose.Schema({
  name: {
    type: String,
    required: true, // This field is required
    trim: true // Trims whitespace from the ends
  },
  email: {
    type: String,
    required: true, // This field is required
    trim: true // Trims whitespace from the ends
  },
  message: {
    type: String,
    required: true, // This field is required
    trim: true // Trims whitespace from the ends
  },
  submittedAt: {
    type: Date,
    default: Date.now // Default value is the current date/time
  }
});

// Create a model from the schema
const contactus = mongoose.model('Contact', sys);

module.exports = sys; // Export the model

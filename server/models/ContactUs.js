const mongoose = require('mongoose');

// Define the schema for the contact information
const contactSchema = new mongoose.Schema({
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
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact; // Export the model

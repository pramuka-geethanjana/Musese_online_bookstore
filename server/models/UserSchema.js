const mongoose = require('mongoose');

// Define the schema for the user
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // No two users can have the same username
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    // Consider if you want to make it required or have a default value
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isCommentsBlocked: {
    type: Boolean,
    default: false
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  }],
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
  },
  receipts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Receipt',
  }],
  favoriteBooks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a virtual property 'id' that's computed from the default MongoDB '_id'
userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User; // Export the model

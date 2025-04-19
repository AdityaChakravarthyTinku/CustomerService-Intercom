const mongoose = require('mongoose');

// Define the schema for the user model
const CustomerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
   
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    //required: true,
    required: true,
  },
  category: {
    type: String,
    enum: [
      'General Queries',
      'Product Features Queries',
      'Product Pricing Queries',
      'Product Feature Implementation Requests'
    ],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  comments: {
    type: String,
     default: ''

  },
  response: {
   type: String, default: 'Your request has been received. Our team will respond shortly.'
  },
  conversationId: {
    type: String,
    default: null
  }
}, { timestamps: true });

// Create the model using the schema
const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;

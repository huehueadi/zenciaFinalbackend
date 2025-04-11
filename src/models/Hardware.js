import mongoose from "mongoose";

// Define the schema for hardware
const hardwareSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Use ObjectId for user references if it’s a relation
    ref: 'User', // This is optional if you want to reference the User model
    required: true,
  },

  hardwareId: {
    type: String,
    required: true,
    unique: true, // Add unique if you want hardwareId to be unique across the database
  },

  nickName: {
    type: String,
    required: false,
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },

});

// Create the model for the schema
const Hardware = mongoose.model('Hardware', hardwareSchema); // Correct

export default Hardware;

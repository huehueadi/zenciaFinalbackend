import mongoose from "mongoose";

const licenseSchema = new mongoose.Schema({
  hardware_id: {
    type: String,
    required: true,
  },
  isgeneratedLicense: {
    type: String,
    enum: ['Yes', 'No'],
  },
  license_key: {
    type: String,
    required: true,
  },
  plan_id:{ type: mongoose.Schema.Types.ObjectId, ref: "Plan" },

  expiration_date: {
    type: String,
  },
  user_id: {
    type: String,
  },
  duration_days: {
    type: String,
  },
  days_left: {
    type: String,
  },
  transactionId: {
    type: String, // Changed from ObjectId to String
    required: true,
  },
  start_date: {
    type: Date,
    default: Date.now, // Fixed typo: "deafult" -> "default"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const License = mongoose.model('License', licenseSchema);

export default License;
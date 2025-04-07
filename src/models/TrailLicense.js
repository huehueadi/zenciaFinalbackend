import mongoose from "mongoose";

const trailLicenseSchema = new mongoose.Schema({
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
  expiration_date: {
    type: String,
  },
  userId: {
    type: String,
    required:true
  },
  duration_days: {
    type: String,
  },
  days_left: {
    type: String,
  },

  start_date: {
    type: Date,
    default: Date.now, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TrailLicense = mongoose.model('TrailLicense', trailLicenseSchema);

export default TrailLicense;
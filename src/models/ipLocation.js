import mongoose from 'mongoose';

const ipLocationSchema = new mongoose.Schema({
  userId:{ type: String, required: true}, 
  ip: { type: String, required: true },
  hostname: { type: String, default: 'unknown' },
  city: { type: String, default: 'unknown' },
  region: { type: String, default: 'unknown' },
  country: { type: String, default: 'unknown' },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  org: { type: String, default: 'unknown' },
  postal: { type: String, default: 'unknown' },
  timezone: { type: String, default: 'unknown' },
  source: { type: String, enum: ['client', 'ipinfo'], required: true },
  createdAt: { type: Date, default: Date.now }
});

const IpLocation = mongoose.model("IpLocation", ipLocationSchema)

export default IpLocation
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName:{type:String, required:true},
  lastName:{type:String, required:true},
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, default: null },
  mobileNumber: { type: String, default: null },
  city: { type: String, default: null },
  state: { type: String, default: null },
  country: { type: String, default: null },
  isVerified: { type: Boolean, default: false },
  oauthProvider: { type: String, default: null },
  oauthProviderId: { type: String, default: null },
  isOnboardingCompleted: { type: Boolean, default: false },
  profilePicture: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null },
});

const User = mongoose.model("User", userSchema);

export default User;
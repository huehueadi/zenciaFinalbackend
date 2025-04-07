import mongoose from "mongoose";

const onboardingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    purpose: { type: String, required: true },
    workType: { type: String, default: null },
    personalUse: { type: String, default: null },
    educationType: { type: String, default: null },
    planToDo: { type: [String], default: [] },
    source: { type: String, default: null },
    submittedAt: { type: Date, default: Date.now },
  });
  
  const Onboarding = mongoose.model('Onboarding', onboardingSchema);
  
  export default Onboarding
import Onboarding from "../models/Onbaording.js";
import User from "../models/User.js";
export const submitOnboarding = async (req, res) => {
    try {
      const { purpose, workType, personalUse, educationType, planToDo, source } = req.body;
     
      const { id } = req.user;
  
      const userId = id
      if (!purpose) {
        return res.status(400).json({ success: false, message: 'Purpose is required' });
      }
  
      const onboardingData = new Onboarding({
        userId,
        purpose,
        workType: purpose === 'work' ? workType : null,
        personalUse: purpose === 'personal' ? personalUse : null,
        educationType: purpose === 'education' ? educationType : null,
        planToDo: planToDo || [],
        source,
      });
  
      const savedData = await onboardingData.save();
  
      await User.findByIdAndUpdate(userId, { isOnboardingCompleted: true });
  
      res.status(201).json({
        success: true,
        message: 'Onboarding data submitted successfully',
        data: savedData,
      });
    } catch (error) {
      console.error('Error submitting onboarding data:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
  
  export const getAllOnboarding = async (req, res) => {
    try {
      const onboardingData = await Onboarding.find().populate('userId', 'username email');
      res.status(200).json({ success: true, data: onboardingData });
    } catch (error) {
      console.error('Error fetching onboarding data:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
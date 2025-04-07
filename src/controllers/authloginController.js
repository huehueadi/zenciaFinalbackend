import User from "../models/User.js";

export const getuser= async(req, res)=>{
    try {
        const user = await User.findById(req.user.id).select('-password'); 
        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({
          success: true,
          data: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            mobileNumber: user.mobileNumber,
            city: user.city,
            state: user.state,
            country: user.country,
            isOnboardingCompleted: user.isOnboardingCompleted,
          },
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
}
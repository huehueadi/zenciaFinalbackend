import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/User.js";

export const login = async (req, res) => {
  

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    let redirectPath = '/dashboard';
    if (!user.isOnboardingCompleted) {
      redirectPath = '/auth/onboard';
    } else if (!user.hasDownloadedSoftware) {
      redirectPath = '/download';
    }

    const jwtToken = jwt.sign({ id: user._id }, 'Key', { expiresIn: '1h' });

    const userData = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      mobileNumber: user.mobileNumber,
      city: user.city,
      state: user.state,
      country: user.country,
    };

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token: jwtToken,
      redirectPath,
      user: userData,
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

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
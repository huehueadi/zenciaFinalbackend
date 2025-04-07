import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import { sendOTP } from "../utility/mailer.js";
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


export const register = async (req, res) => {
  const { firstName, lastName, email, password, mobileNumber, city, state, country } = req.body;

  console.log("Received registration request:", req.body);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`Email already registered: ${email}`);
      return res.status(400).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    const otp = generateOTP();
    console.log("Generated OTP:", otp);

    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 
    console.log("OTP expiry set for:", otpExpires);

    const user = new User({
      firstName,
      lastName,
      email,
      passwordHash,
      mobileNumber,
      city,
      state,
      country,
      otp,
      otpExpires,
    });

    console.log("Saving user to the database...");
    await user.save();
    console.log("User saved successfully");

    console.log("Sending OTP to the user's email...");
    await sendOTP(email, otp);
    console.log("OTP sent to email:", email);

    res.status(201).json({ message: "OTP sent to your email. Please verify." });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  console.log("Received OTP verification request:", req.body);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`User found: ${user.email}`);

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      console.log(`Invalid OTP or OTP expired for email: ${email}`);
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    console.log("OTP verified successfully, updating user status...");
    await user.save();
    console.log("User status updated successfully");

    const jwtToken = jwt.sign({ id: user._id },'Key', {expiresIn: '1h' });

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      token: jwtToken,  
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        mobileNumber: user.mobileNumber,
        city: user.city,
        state: user.state,
        country: user.country
      },
    });

  } catch (error) {
    console.error("Error during OTP verification:", error);
    res.status(500).json({ message: error.message });
  }
};


export const resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOTP(email, otp);

    res.status(200).json({ message: "New OTP sent successfully. Please verify." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

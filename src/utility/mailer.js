import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'temploginoffice@gmail.com', 
    pass: 'wime eode yrex gojo'    
  },
});

export const sendOTP = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Your OTP for Registration",
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Worker ${process.pid}: OTP sent to ${to}`);
  } catch (error) {
    console.error(`Worker ${process.pid}: Error sending OTP:`, error);
    throw new Error("Failed to send OTP");
  }
};
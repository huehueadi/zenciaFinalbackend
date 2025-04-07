import handleGoogleOAuth from "../services/authgoogleservice.js";
// Google OAuth registration/login handler
export const googleOAuthRegister = async (req, res) => {
  const { token, additionalData } = req.body; // The token sent by the client

  try {
    const result = await handleGoogleOAuth(token, additionalData);
    res.status(200).json(result); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

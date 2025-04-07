// import { OAuth2Client } from 'google-auth-library';
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js'; // Assuming this is the path to your user model

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '424370588012-s14oo8n1aqn4cjda2ahbmavnls1863rj.apps.googleusercontent.com');
// async function handleGoogleOAuth(token, additionalData = {}) {
//   try {
//     // Verify the token with Google
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: '424370588012-s14oo8n1aqn4cjda2ahbmavnls1863rj.apps.googleusercontent.com', // Ensure the token is from your client
//     });

//     const payload = ticket.getPayload();
//     console.log('Token payload:', payload);

//     const oauthProviderId = payload.sub; // Google user ID
//     const email = payload.email;
//     const firstName = additionalData.firstName || payload.given_name || 'Unknown';
//     const lastName = additionalData.lastName || payload.family_name || 'User';
//     const profilePicture = additionalData.profilePicture || payload.picture; // Google provides a profile picture URL

//     const userData = {
//       email,
//       firstName,
//       lastName,
//       mobileNumber: additionalData.mobileNumber || null,
//       city: additionalData.city || null,
//       state: additionalData.state || null,
//       country: additionalData.country || null,
//       profilePicture,
//       isVerified: true, // Google OAuth automatically verifies the user
//       isOnboardingDone: additionalData.isOnboardingDone || false,
//       oauthProvider: 'google', // Set the OAuth provider as 'google'
//       oauthProviderId, // Store the Google user ID
//     };

//     // Check if the user already exists with Google OAuth ID
//     let user = await User.findOne({ oauthProviderId, oauthProvider: 'google' });
//     if (user) {
//       // If the user exists, generate a JWT token and return it
//       const jwtToken = jwt.sign({ id: user._id }, 'Key', { expiresIn: '1h' });
//       return { success: true, message: 'Logged in via Google OAuth', token: jwtToken, user };
//     }

//     // Check if the user exists by email
//     user = await User.findOne({ email });
//     if (user) {
//       user.oauthProviderId = oauthProviderId;
//       user.oauthProvider = 'google';
//       user.isVerified = true; 
//       user.profilePicture = profilePicture; 
//       await user.save();

//       const jwtToken = jwt.sign({ id: user._id }, 'Key', { expiresIn: '1h' });
//       return { success: true, message: 'Logged in via Google OAuth', token: jwtToken, user };
//     }

//     user = new User(userData);
//     await user.save();

//     const jwtToken = jwt.sign({ id: user._id }, 'Key', { expiresIn: '1h' });
//     return { success: true, message: 'Account created and logged in via Google OAuth', token: jwtToken, user };
//   } catch (error) {
//     console.error('Error in Google OAuth:', error);
//     throw new Error('OAuth processing failed: ' + error.message);
//   }
// }

// export default handleGoogleOAuth;



import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Assuming your User model is imported

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '424370588012-s14oo8n1aqn4cjda2ahbmavnls1863rj.apps.googleusercontent.com');

async function handleGoogleOAuth(token, additionalData = {}) {
  try {
    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '424370588012-s14oo8n1aqn4cjda2ahbmavnls1863rj.apps.googleusercontent.com',
    });

    const payload = ticket.getPayload();
    console.log('Token payload:', payload);

    const oauthProviderId = payload.sub; // Google user ID
    const email = payload.email;
    const firstName = additionalData.firstName || payload.given_name || 'Unknown';
    const lastName = additionalData.lastName || payload.family_name || 'User';
    const profilePicture = additionalData.profilePicture || payload.picture;

    const userData = {
      email,
      firstName,
      lastName,
      mobileNumber: additionalData.mobileNumber || null,
      city: additionalData.city || null,
      state: additionalData.state || null,
      country: additionalData.country || null,
      profilePicture,
      isVerified: true,
      isOnboardingCompleted: additionalData.isOnboardingCompleted || false, // Renamed for consistency
      oauthProvider: 'google',
      oauthProviderId,
    };

    // Check if the user already exists with Google OAuth ID
    let user = await User.findOne({ oauthProviderId, oauthProvider: 'google' });
    if (user) {
      const jwtToken = jwt.sign({ id: user._id }, 'Key', { expiresIn: '1h' });
      const redirectPath = user.isOnboardingCompleted ? '/dashboard' : '/auth/onboard';
      return {
        success: true,
        message: 'Logged in via Google OAuth',
        token: jwtToken,
        redirectPath, // Added
        user,
      };
    }

    // Check if the user exists by email
    user = await User.findOne({ email });
    if (user) {
      user.oauthProviderId = oauthProviderId;
      user.oauthProvider = 'google';
      user.isVerified = true;
      user.profilePicture = profilePicture;
      await user.save();

      const jwtToken = jwt.sign({ id: user._id }, 'Key', { expiresIn: '1h' });
      const redirectPath = user.isOnboardingCompleted ? '/dashboard' : '/auth/onboard';
      return {
        success: true,
        message: 'Logged in via Google OAuth',
        token: jwtToken,
        redirectPath, // Added
        user,
      };
    }

    // New user
    user = new User(userData);
    await user.save();

    const jwtToken = jwt.sign({ id: user._id }, 'Key', { expiresIn: '1h' });
    const redirectPath = '/auth/onboard'; // New users always go to onboarding
    return {
      success: true,
      message: 'Account created and logged in via Google OAuth',
      token: jwtToken,
      redirectPath, // Added
      user,
    };
  } catch (error) {
    console.error('Error in Google OAuth:', error);
    throw new Error('OAuth processing failed: ' + error.message);
  }
}

export default handleGoogleOAuth;

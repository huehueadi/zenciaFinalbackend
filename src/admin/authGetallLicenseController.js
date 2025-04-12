import Hardware from '../models/Hardware.js';

export const getAllHardware = async (req, res) => {
  try {
    // Fetch all hardware records, populate userId with email (adjust based on User schema)
    const hardware = await Hardware.find().populate('userId', 'email name');

    // Return success response
    return res.status(200).json({
      success: true,
      data: hardware,
    });
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      success: false,
      error: `Failed to fetch hardware: ${error.message}`,
    });
  }
};
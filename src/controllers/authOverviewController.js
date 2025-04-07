import { getLicenseDetails } from "../services/authOverviewService.js";
export const licenseController = async (req, res) => {
  try {
   
    const {id} = req.user 

    const userId = id 

    // Fetch the data using the service
    const licenseDetails = await getLicenseDetails(userId);

    return res.status(200).json({
      success: true,
      data: licenseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error processing request',
      error: error.message,
    });
  }
};
import License from "../models/License.js";
export const getAllLicensekey = async (req, res) => {
    try {
      const { id } = req.user;  // Assuming user ID is added to the request object (via middleware)
  
      // Fetch the keys for the specific user
      const getkeys = await License.find({user_id:id});
  
      res.status(200).json({
        message: "All keys fetched successfully",
        getkeys,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  };
  
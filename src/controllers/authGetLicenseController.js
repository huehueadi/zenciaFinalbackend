import License from "../models/License.js";

export const getAllLicensekey = async (req, res) => {
  try {
    const { id } = req.user;

    // Fetch the licenses for the specific user and populate the plan details
    const getkeys = await License.find({ user_id: id }).populate({
      path: "plan_id", // The field in License that references Plan
      select: "name duration price", // Select only the fields you need from Plan
    });

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
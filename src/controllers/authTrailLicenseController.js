import NodeCache from "node-cache";
import Plan from "../models/Plan.js";
import TrailLicense from "../models/TrailLicense.js";
import { generateTrailLicense } from "../services/authTrailService.js";
// export async function generateTrailLicenseController(req, res) {
// try {
//     const { hardware_id, start_date, expiration_date, planId } = req.body;
  
//     console.log('Request body:', req.body);
  
//     const {id} = req.user
//     const userId = id 
//     if (!hardware_id || !planId ) {
//       const response = {
//         status: "error",
//         message: "Missing required fields",
//         data: { success: false, message: "Please provide Hardware ID, Plan ID, and Transaction ID." },
//       };
//       return res.status(400).json(response);
//     }
  
//     const result = await generateTrailLicense(hardware_id, start_date, expiration_date, planId, userId);
  
//     const response = {
//       status: result.success ? "success" : "error",
//       message: result.success ? "License Key Generated" : "License Generation Failed",
//       data: result,
//     };
  
//     return res.status(result.success ? 200 : 500).json(response);
//   }
  
  

    
//  catch (error) {
//     res.status(500).json({
//         message:"Internal server error",
//         error:error.message
//     })
    
// }
// }


export const generateTrailLicenseController = async (req, res) => {
    try {
      const { hardware_id, start_date, expiration_date, planId } = req.body;
  
      const userId = req.user ? req.user.id : null;
      if (!hardware_id || !planId) {
        return res.status(400).json({
          success: false,
          message: "Please provide Hardware ID and Plan ID.",
        });
      }
  
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "Please authenticate the user.",
        });
      }
  
      const result = await generateTrailLicense(hardware_id, start_date, expiration_date, planId, userId);
  
      return res.status(201).json(result);
    } catch (error) {
      console.error("Error generating trail license:", error);
  
      return res.status(500).json({
        success: false,
        message: error.message || "Something went wrong",
      });
    }
  };

  
  export const getalltrial = async (req, res) => {
    try {
      const { id } = req.user;
      const trialLicenses = await TrailLicense.find({ userId: id });
  
 
  
      return res.status(200).json({
        message: 'Fetched all trial licenses',
        getkeys: trialLicenses,
      });
    } catch (error) {
      console.error('Error fetching trial licenses:', error);
      return res.status(500).json({
        message: 'Failed to fetch trial licenses',
        error: error.message,
      });
    }
  };
  

  const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

  export const getallplans = async (req, res) => {
    try {
      const cachedPlans = cache.get("allPlans");
  
      if (cachedPlans) {
        return res.status(200).json({
          message: "All Plans (from cache)",
          allPlans: cachedPlans,
        });
      }
  
      const allPlans = await Plan.find();
  
      cache.set("allPlans", allPlans);
  
      return res.status(200).json({
        message: "All Plans",
        allPlans,
      });
    } catch (error) {
      console.error("Error fetching plans:", error);
      return res.status(500).json({
        message: "Error fetching plans",
        error: error.message,
      });
    }
  };

  export const getPlanbyId = async(req, res)=>{
    try {

      const {_id} = req.body

      const planId = _id

      const getplan = await Plan.findById(planId)

      res.stauts(200).json({
        message:"Plan fetched",
        getplan
      })
      
    } catch (error) {
      
    }
  }
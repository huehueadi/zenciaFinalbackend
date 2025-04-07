import Hardware from "../models/Hardware.js";

export const hardwareregister = async(req, res)=>{
    try {
        const {id} = req.user
        const userId = id
        const {hardwareId, nickName} = req.body
       
        const existingHardware = await Hardware.findOne({ hardwareId });
        if (existingHardware) {
          return res.status(400).json({ message: 'Hardware ID already exists' }); // Return to prevent further execution
        }
    
        // Create new hardware entry
        const newHardware = new Hardware({
          userId,
          hardwareId,
          nickName
        });
    
        // Save the hardware
        await newHardware.save();
    
        // Send success response
        return res.status(201).json({
          success: true,
          message: 'Hardware registered successfully',
          hardware: newHardware,
        });
    
      } catch (error) {
        // Log the error and send an error response if something goes wrong
        console.error('Error registering hardware:', error);
    
        // Ensure a response is sent only once
       
          return res.status(500).json({ message: 'Internal server error' });
      }
    };




export const getAllHardwareByUser = async (req, res) => {
    try {
       const {id} = req.user
       const userId = id 
        const hardwareList = await Hardware.find({ userId });


        res.status(200).json({
            message: "Hardware fetched successfully",
            hardwareList
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error. Please try again later."
        });
    }
};

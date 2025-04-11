import User from "../models/User.js";

export const isDownloaded = async(req, res)=>{
    try {
        const {id} = req.user 

        const userId = id 


        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
    
        user.hasDownloadedSoftware = true;
        await user.save();
        res.json(user);
      } catch (error) {
        console.error('Download completion error:', error);
        res.status(500).json({ message: 'Failed to update download status' });
      }
    };

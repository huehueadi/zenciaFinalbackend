import User from '../models/User.js';

export const isDownloaded = async (req, res) => {
  try {
    const { id } = req.user;
    console.log('isDownloaded called for user ID:', id); // Debug log

    const user = await User.findById(id);
    if (!user) {
      console.log('User not found for ID:', id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Current hasDownloadedSoftware:', user.hasDownloadedSoftware); // Before update
    if (user.hasDownloadedSoftware) {
      console.log('User already marked as downloaded:', id);
      return res.status(200).json({ message: 'Already marked as downloaded', user });
    }

    user.hasDownloadedSoftware = true; // Set to true (as intended)
    await user.save().catch(err => {
      console.error('MongoDB save error:', err);
      throw err;
    });
    console.log('User updated successfully:', user); // After update

    res.json({ message: 'Download status updated to true', user });
  } catch (error) {
    console.error('Download completion error:', error);
    res.status(500).json({ message: 'Failed to update download status', error: error.message });
  }
};
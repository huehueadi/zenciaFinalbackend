import Contact from "../models/contact.js";
export const submitContactForm = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const {id} = req.user.id; // From authenticateJWT, if present

    const userId = id

    // Validate input
    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required.',
      });
    }

    // Create new contact entry
    const newContact = new Contact({
      userId: userId || null, // Null if no user is authenticated
      subject,
      message,
    });

    await newContact.save();

    return res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
};
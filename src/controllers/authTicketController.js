import { createTicket, getAllTickets, getTicketById } from "../services/authTicketService.js";

export const createTicketController = async (req, res) => {
  try {
    // Assuming req.user is an object with an id property from authenticateJWT
    const { id: userId } = req.user; // Correct destructuring
    console.log('User ID from token:', userId);
    console.log('Received files from Multer:', req.files); // Log array of files
    console.log('Ticket data from body:', req.body);

    const ticketData = req.body;
    const files = req.files; // Use req.files for array upload

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded." });
    }

    const newTicket = await createTicket(ticketData, files, userId);
    res.status(201).json({
      message: "Ticket created successfully",
      ticket: newTicket,
    });
  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({ message: "Error creating ticket: " + error.message });
  }
};

export const getAllTicketsController = async (req, res) => {
  try {
    const tickets = await getAllTickets();
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching all tickets:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getTicketByIdController = async (req, res) => {
  try {
     const {id} = req.user

     const userId = id
     const ticket = await getTicketById({userId});
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json(ticket);
  } catch (error) {
    console.error('Error fetching ticket by ID:', error);
    res.status(500).json({ message: error.message });
  }
};
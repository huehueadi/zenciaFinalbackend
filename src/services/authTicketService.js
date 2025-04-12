import Ticket from "../models/Ticket.js";

const createTicket = async (ticketData, files, userId) => {
  try {
    const { subject, priority, description } = ticketData;

    // Generate file URLs for each uploaded file
    const fileUrls = files.map(file => `https://zencia-finalbackend.vercel.app/uploads/${file.filename}`);

    const ticket = new Ticket({
      subject,
      priority,
      description,
      attachments: fileUrls, // Store the file URLs in the database
      userId, // Add userId to the ticket
    });

    await ticket.save();
    return ticket;
  } catch (error) {
    console.error('Service error creating ticket:', error);
    throw new Error("Error creating ticket: " + error.message);
  }
};

const getAllTickets = async () => {
  try {
    return await Ticket.find();
  } catch (error) {
    console.error('Service error fetching tickets:', error);
    throw new Error("Error fetching tickets: " + error.message);
  }
};

const getTicketById = async (userId) => {
  try {
    return await Ticket.find(userId);
  } catch (error) {
    console.error('Service error fetching ticket by ID:', error);
    throw new Error("Error fetching ticket: " + error.message);
  }
};

export { createTicket, getAllTickets, getTicketById };

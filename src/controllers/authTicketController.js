import { createTicket, getTicketById, getTickets } from "../services/authTicketService.js";
export const createTicketController = async (req, res) => {
  try {
    const { subject, type, priority, description } = req.body;
    const {id} = req.user
    const newTicket = await createTicket({ subject, type, priority, description, userId:id });
    res.status(201).json({ message: 'Ticket created successfully', ticket: newTicket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getTicketsController = async (req, res) => {
  try {

    const {id} = req.user


    const { status } = req.query;

    const userId = id
    const tickets = await getTickets(status, userId);
    res.status(200).json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Fetch a single ticket by ID
export const getTicketByIdController = async (req, res) => {
  try {
    const ticket = await getTicketById(req.params.id);
    res.status(200).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};

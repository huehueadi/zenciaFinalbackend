// services/ticketService.js

import Ticket from "../models/Ticket.js";

// Create a new ticket
export const createTicket = async (ticketData) => {
  try {
    const { subject, type, priority, description, userId } = ticketData;
    const newTicket = new Ticket({
      userId,
      subject,
      type,
      priority,
      description,
    });

    await newTicket.save();
    return newTicket;
  } catch (error) {
    throw new Error(`Failed to create ticket: ${error.message}`);
  }
};

// Fetch tickets with optional status filter
// export const getTickets = async (status) => {
//   try {
//     const query = status ? { status } : {};
//     const tickets = await Ticket.find(query);
//     return tickets;
//   } catch (error) {
//     throw new Error(`Failed to fetch tickets: ${error.message}`);
//   }
// };

export const getTickets = async (status, userId) => {
  try {
    const query = { userId }; 
    if (status) {
      query.status = status;
    }

    const tickets = await Ticket.find(query);
    return tickets;
  } catch (error) {
    throw new Error(`Failed to fetch tickets: ${error.message}`);
  }
};

// const query = { userId }; // Always filter by userId
//     if (status) {
//       query.status = status; // Add status filter if provided
//     }

// Fetch a single ticket by ID
export const getTicketById = async (ticketId) => {
  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    return ticket;
  } catch (error) {
    throw new Error(`Failed to fetch ticket: ${error.message}`);
  }
};

import express from 'express';
import { createTicketController, getTicketByIdController } from '../controllers/authTicketController.js';
import authenticateJWT from '../middleware/authJwt.authentication.js';
import upload from '../middleware/authMulter.js';

const ticketRouter = express.Router();

ticketRouter.post('/create', authenticateJWT ,upload, createTicketController);

// GET route for retrieving a ticket by ID (protected by JWT)
ticketRouter.get('/get-ticket', authenticateJWT, getTicketByIdController);

export default ticketRouter;

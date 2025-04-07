import express from 'express'
import { createTicketController, getTicketByIdController } from '../controllers/authTicketController.js'
import authenticateJWT from '../middleware/authJwt.authentication.js'

const ticketRouter = express.Router()

ticketRouter.post('/create-ticket', authenticateJWT,createTicketController)

ticketRouter.get('get-ticket', authenticateJWT, getTicketByIdController)

export default ticketRouter
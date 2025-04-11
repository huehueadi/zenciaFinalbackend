// models/Ticket.js
import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  userId:{ type:String, required:true},
  subject: { type: String, required: true },
  priority: { type: String, required: true },
  description: { type: String, required: true },
  attachments: [{ type: String }], 
  status: { type: String, default: "Open" },
  createdAt: { type: Date, default: Date.now },
  lastUpdate: { type: Date, default: Date.now },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;

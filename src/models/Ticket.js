import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true, index: true },
  subject: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['bug', 'feature', 'billing', 'general'], 
    required: true 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['open', 'closed', 'in-progress'], 
    default: 'open' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
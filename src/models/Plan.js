import mongoose from "mongoose";


const planSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      enum: ['Trial', 'Custom', 'Lifetime'], 
    },
    duration: {
      type: String,
      required: false, 
    },
    price: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Plan = mongoose.model('Plan', planSchema);

  export default Plan 
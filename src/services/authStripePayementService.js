import Stripe from 'stripe';
import Payment from '../models/Payment.js';
import Plan from '../models/Plan.js';
// class PaymentServiceStripe {
//   constructor() {
//     this.stripe = Stripe('sk_test_51R7tYiCtcBmDVgRVz7jRIjWfo89tJ6K0w626QE4PmDmMaqOGBuPfdFiPFn18SF21OKEuSTFvlOQNB4pj7eNyeFaL00Bl7nJ2pJ'); 
//   }

//   // async createPaymentIntent(planId) {
//   //   // const plan = SubscriptionPlan.getPlanById(planId);

//   //   const plan = await Plan.findById(planId)
//   //   if (!plan) {
//   //     throw new Error('Invalid subscription plan');
//   //   }

//   //   const amountInCents = plan.price * 100;

//   //   const paymentIntent = await this.stripe.paymentIntents.create({
//   //     amount: amountInCents,
//   //     currency: 'usd',
//   //     automatic_payment_methods: {
//   //       enabled: true,
//   //     },
//   //     metadata: {
//   //       planId: plan.id,
//   //       planName: plan.name,
//   //     },
//   //   });

//   //   return paymentIntent;
//   // }


//   async createPaymentIntent(planId, hardwareId, userId) { // Add userId if needed
//     const plan = await Plan.findById(planId);
//     if (!plan) throw new Error('Invalid subscription plan');
  
//     const amountInCents = plan.price * 100;
//     if (amountInCents < 50) throw new Error('Amount must be at least $0.50 USD');
  
//     const paymentIntent = await this.stripe.paymentIntents.create({
//       amount: amountInCents,
//       currency: 'usd',
//       automatic_payment_methods: { enabled: true },
//       metadata: { planId, planName: plan.name, hardwareId },
//     });
  
//     const payment = new Payment({
//       transactionId: paymentIntent.id,
//       planId: plan._id,
//       hardwareId, // Dedicated field
//       userId, // Optional, from auth
//       amount: amountInCents,
//       paymentStatus: paymentIntent.status,
//       clientSecret: paymentIntent.client_secret,
//       metadata: { planName: plan.name, hardwareId },
//     });
  
//     await payment.save();
  
//     return { clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id };
//   }
// }

// export default new PaymentServiceStripe();


const stripe = new Stripe( 'sk_test_51R7tYiCtcBmDVgRVz7jRIjWfo89tJ6K0w626QE4PmDmMaqOGBuPfdFiPFn18SF21OKEuSTFvlOQNB4pj7eNyeFaL00Bl7nJ2pJ', { apiVersion: '2023-10-16' });
class PaymentService {
  async createPaymentIntent(planId, hardwareId, userId) {
    const plan = await Plan.findById(planId);
    if (!plan) throw new Error('Invalid subscription plan');

    const ishardwareexist = await Payment.findOne({hardwareId})
    if(ishardwareexist)
      throw new Error('License Key already Generated');

    const amountInCents = plan.price * 100;
    if (amountInCents < 50) throw new Error('Amount must be at least $0.50 USD');

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { planId, planName: plan.name, hardwareId, userId },
    });

    const payment = new Payment({
      transactionId: paymentIntent.id,
      planId: plan._id,
      hardwareId,
      userId, // Optional, from auth
      amount: amountInCents,
      paymentStatus: paymentIntent.status,
      clientSecret: paymentIntent.client_secret,
      metadata: { planName: plan.name, hardwareId },
    });

    await payment.save();

    return { clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id };
  }

  async verifyPayment(paymentIntentId) {
    const payment = await Payment.findOne({ transactionId: paymentIntentId });
    if (!payment) throw new Error('Payment not found');

    console.log("payment", payment);
    

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    payment.paymentStatus = paymentIntent.status;

    console.log("intent", paymentIntent);
    
    await payment.save();

    return { success: paymentIntent.status === 'succeeded', transactionId: paymentIntentId };
  }
}

export default new PaymentService();
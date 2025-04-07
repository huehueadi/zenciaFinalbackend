import License from '../models/License.js';
import Payment from '../models/Payment.js';
import Plan from '../models/Plan.js';
import { generateLicense } from '../services/authLicenseService.js';
import authStripePayementService from '../services/authStripePayementService.js';
class SubscriptionController {
    async initiateCheckout(req, res) {
      try {

      const {id} = req.user
      const userId = id;

      const { planId, hardwareId } = req.body;

      console.log("reuest", req.body)

  
      if (!planId || !hardwareId) {
        return res.status(400).json({ message: 'Plan ID and Hardware ID are required' });
      }
  
        const plan = await Plan.findById(planId);
        if (!plan) {
          return res.status(400).json({ message: 'Invalid Plan ID' });
        }

        console.log("plan", plan)

  
        const existingLicense = await License.findOne({ hardware_id: hardwareId, plan_id: planId });
        if (existingLicense) {
          return res.status(200).json({ message: 'License already purchased', license: existingLicense });
        }
  
        const { clientSecret, paymentIntentId } = await authStripePayementService.createPaymentIntent(planId, hardwareId, userId);
        res.json({ clientSecret, paymentIntentId });
      } catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({ message: `Payment initiation failed: ${error.message}` });
      }
    }
  
    async handlePaymentSuccess(req, res) {
      const { paymentIntentId } = req.query;
  
      if (!paymentIntentId) {
        return res.status(400).json({ message: 'Missing paymentIntentId' });
      }
  
      try {
        // Verify payment
        const paymentVerification = await authStripePayementService.verifyPayment(paymentIntentId);
        if (!paymentVerification.success) {
          return res.status(400).json({ message: 'Payment not completed' });
        }
  
        // Fetch payment details from MongoDB
        const payment = await Payment.findOne({ transactionId: paymentIntentId });
        if (!payment) {
          return res.status(404).json({ message: 'Payment record not found' });
        }
  
        // Generate license
        const licenseResult = await generateLicense(
          payment.hardwareId,
          null, 
          null,
          payment.transactionId,
          payment.planId,
          payment.userId
        );
  
        if (!licenseResult.success) {
          return res.status(500).json({ message: licenseResult.message });
        }
  
        res.json({ message: 'Payment successful, license generated', license: licenseResult });
      } catch (error) {
        console.error('Payment success error:', error);
        res.status(500).json({ message: `Error processing payment: ${error.message}` });
      }
    }

     async getAllPayments(req, res) {
      try {
          const { id } = req.user; 
          const payments = await Payment.find({ userId: id }); 
          return res.status(200).json({ message: "Payments fetched successfully", payments });
      } catch (error) {
          console.error(error);
          return res.status(500).json({ message: "An error occurred while fetching payments" });
      }
  }
}
  
  
  export default new SubscriptionController();
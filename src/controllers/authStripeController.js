import SubscriptionPlan from '../models/subscriptionPlan.js';
import authStripePayementService from '../services/authStripePayementService.js';

class PaymentStripe {
   static async createPaymentIntent(req, res) {
    try {
      const { planId } = req.body;
      if (!planId) {
        return res.status(400).json({ error: 'Plan ID is required' });
      }

      const paymentIntent = await authStripePayementService.createPaymentIntent(planId);
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSubscriptionPlans(req, res) {
    const plans = await SubscriptionPlan.getAllPlans();
    res.json(plans);
  }
}

export default PaymentStripe;
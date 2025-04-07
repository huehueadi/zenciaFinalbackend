
class SubscriptionPlan {
    static plans = [
      {
        id: 'trial',
        name: 'Trial',
        description: '15 Days for $1: A trial plan for users to experience the service.',
        amount: 100, // $1 in cents
        duration: '15 days',
      },
      {
        id: 'annual',
        name: 'Annual',
        description: '1 Year for $19: Ideal for long-term users at a discounted rate.',
        amount: 1900, // $19 in cents
        duration: '1 year',
      },
      {
        id: 'lifetime',
        name: 'Lifetime',
        description: 'Lifetime for $49: Permanent access with a one-time payment.',
        amount: 4900, // $49 in cents
        duration: 'lifetime',
      },
    ];
  
    static getAllPlans() {
      return this.plans;
    }
  
    static getPlanById(planId) {
      return this.plans.find(plan => plan.id === planId);
    }
  }
export default SubscriptionPlan;
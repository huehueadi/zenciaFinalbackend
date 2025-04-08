import License from '../models/License.js'; // Adjust path as needed

const getLicenseDetailsPipeline = (userId) => [
    // Match active licenses for the user
    {
      $match: {
        user_id: userId,
        $or: [
          { days_left: { $gt: "0" } },
          { expiration_date: { $gt: new Date().toISOString() } },
        ],
      }, 
    },
  
    // Lookup plan details
    {
      $lookup: {
        from: 'plans',
        let: { planId: { $toObjectId: '$plan_id' } },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$planId'] },
            },
          },
        ],
        as: 'planDetails',
      },
    },
  
    { $unwind: { path: '$planDetails', preserveNullAndEmptyArrays: true } },
  
    // Lookup payment details
    {
      $lookup: {
        from: 'payments',
        localField: 'transactionId',
        foreignField: 'transactionId',
        as: 'paymentDetails',
      },
    },
  
    { $unwind: { path: '$paymentDetails', preserveNullAndEmptyArrays: true } },
  
    // Lookup tickets
    {
      $lookup: {
        from: 'tickets',
        localField: 'user_id',
        foreignField: 'userId',
        as: 'ticketDetails',
      },
    },
  
    { $sort: { 'paymentDetails.createdAt': -1 } },
  
    // Group data
    {
      $group: {
        _id: null,
        activeLicenses: { $sum: 1 },
        planName: { $first: '$planDetails.name' },
        payments: { $push: '$paymentDetails' },
        tickets: { $first: '$ticketDetails' },
      },
    },
  
    // Project final output with amount conversion
    {
      $project: {
        _id: 0,
        activeLicenses: 1,
        currentPlan: { $ifNull: ['$planName', null] },
        supportTickets: {
          $size: {
            $filter: {
              input: '$tickets',
              cond: { $eq: ['$$this.status', 'open'] },
            },
          },
        },
        lastPayment: {
          $let: {
            vars: {
              succeededPayment: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: '$payments',
                      cond: { $eq: ['$$this.paymentStatus', 'succeeded'] },
                    },
                  },
                  0,
                ],
              },
            },
            in: {
              // Convert amount from cents to dollars
              amount: {
                $cond: {
                  if: { $eq: ['$$succeededPayment.amount', null] },
                  then: null,
                  else: { $divide: ['$$succeededPayment.amount', 100] },
                },
              },
              date: '$$succeededPayment.createdAt',
            },
          },
        },
      },
    },
  ];
  
  // Service function remains mostly the same
  export const getLicenseDetails = async (userId) => {
    try {
      const [licenseDetails] = await License.aggregate(getLicenseDetailsPipeline(userId));
  
      if (!licenseDetails) {
        return {
          activeLicenses: 0,
          currentPlan: null,
          supportTickets: 0,
          lastPayment: null,
        };
      }
  
      // If no payments exist, set lastPayment to null
      if (!licenseDetails.lastPayment || !licenseDetails.lastPayment.amount) {
        licenseDetails.lastPayment = null;
      }
  
      console.log('License Details:', JSON.stringify(licenseDetails, null, 2));
      return licenseDetails;
    } catch (error) {
      console.error('Error in getLicenseDetails:', error);
      throw error;
    }
  };
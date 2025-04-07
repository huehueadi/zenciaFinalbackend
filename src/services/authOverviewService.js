import License from '../models/License.js'; // Adjust path as needed

// Aggregation Pipeline to fetch only the requested fields with plan name
const getLicenseDetailsPipeline = (userId) => [
  // Match active licenses for the user
  {
    $match: {
      user_id: userId,
      $or: [
        { days_left: { $gt: "0" } }, // Assuming days_left is stored as a string
        { expiration_date: { $gt: new Date().toISOString() } },
      ],
    },
  },

  // Lookup plan details using plan_id, converting plan_id to ObjectId if needed
  {
    $lookup: {
      from: 'plans', // Ensure this matches your Plan collection name
      let: { planId: { $toObjectId: '$plan_id' } }, // Convert plan_id string to ObjectId
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

  // Unwind planDetails to get the first plan (assuming one primary plan)
  { $unwind: { path: '$planDetails', preserveNullAndEmptyArrays: true } },

  // Lookup payment details using transactionId
  {
    $lookup: {
      from: 'payments',
      localField: 'transactionId',
      foreignField: 'transactionId',
      as: 'paymentDetails',
    },
  },

  // Unwind paymentDetails to work with individual payments
  { $unwind: { path: '$paymentDetails', preserveNullAndEmptyArrays: true } },

  // Lookup tickets for the user
  {
    $lookup: {
      from: 'tickets',
      localField: 'user_id',
      foreignField: 'userId',
      as: 'ticketDetails',
    },
  },

  // Sort payments by createdAt to get the most recent
  { $sort: { 'paymentDetails.createdAt': -1 } },

  // Group to aggregate the required data
  {
    $group: {
      _id: null, // Group all matching licenses together
      activeLicenses: { $sum: 1 }, // Count of active licenses
      planName: { $first: '$planDetails.name' }, // Get the plan name
      payments: { $push: '$paymentDetails' },
      tickets: { $first: '$ticketDetails' },
    },
  },

  // Project the final output with only requested fields
  {
    $project: {
      _id: 0,
      activeLicenses: 1,
      currentPlan: { $ifNull: ['$planName', null] }, // Fallback to null if no plan name
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
            amount: '$$succeededPayment.amount',
            date: '$$succeededPayment.createdAt',
          },
        },
      },
    },
  },
];

// Service function to fetch license details
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

    // Log for debugging
    console.log('License Details:', JSON.stringify(licenseDetails, null, 2));

    return licenseDetails;
  } catch (error) {
    console.error('Error in getLicenseDetails:', error);
    throw error; // Let the controller handle the error response
  }
};
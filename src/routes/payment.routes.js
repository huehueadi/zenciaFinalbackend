import express from 'express'
import { getAllLicensekey } from '../controllers/authGetLicenseController.js'
import authSubscriptionController from '../controllers/authSubscriptionController.js'
import authenticateJWT from '../middleware/authJwt.authentication.js'

const paymentrouter = express.Router()

// paymentrouter.post('/payment-gateway', PaymentStripe.createPaymentIntent)


paymentrouter.post('/payment-gateway',  authenticateJWT ,authSubscriptionController.initiateCheckout)

paymentrouter.get('/payment-success', authenticateJWT, authSubscriptionController.handlePaymentSuccess)

paymentrouter.get('/get-payments', authenticateJWT, authSubscriptionController.getAllPayments)


paymentrouter.get('/get-licenses', authenticateJWT, getAllLicensekey)







export default paymentrouter
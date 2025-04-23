import express from 'express'
import { isDownloaded } from '../controllers/authDownloadController.js'
import { googleOAuthRegister } from '../controllers/authgoogleController.js'
import { getuser, login } from '../controllers/authloginController.js'
import { submitOnboarding } from '../controllers/authOnbaordController.js'
import { register, resendOTP, verifyOTP } from '../controllers/authregisterController.js'
import authenticateJWT from '../middleware/authJwt.authentication.js'
import verifyToken from '../middleware/authjwtVerification.js'
import { trackUserLocation } from '../middleware/trackLocation.js'

const registerrouter = express.Router()

registerrouter.post('/register', register)

registerrouter.post('/login', login)

registerrouter.post('/verfiy', verifyOTP)

registerrouter.post('/resend', resendOTP)

registerrouter.post('/google-auth', googleOAuthRegister)

registerrouter.post('/onboarding', authenticateJWT, submitOnboarding)

registerrouter.get('/user', authenticateJWT, getuser)

registerrouter.get('/verify-user', authenticateJWT, verifyToken)

registerrouter.post('/download', authenticateJWT,  trackUserLocation ,isDownloaded)

export default registerrouter
import express from 'express'
import { generateTrailLicenseController, getallplans } from '../controllers/authTrailLicenseController.js'
import authenticateJWT from '../middleware/authJwt.authentication.js'

const trailrouter = express.Router()

trailrouter.post("/trail-generate", authenticateJWT, generateTrailLicenseController)

trailrouter.get('/get-plans', getallplans)

export default trailrouter    
import express from 'express'
import { generateTrailLicenseController, getallplans, getalltrial } from '../controllers/authTrailLicenseController.js'
import authenticateJWT from '../middleware/authJwt.authentication.js'

const trailrouter = express.Router()

trailrouter.post("/trail-generate", authenticateJWT, generateTrailLicenseController)

trailrouter.get("/trial", authenticateJWT, getalltrial)


trailrouter.get('/get-plans', getallplans)

export default trailrouter    
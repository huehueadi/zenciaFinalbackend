import express from 'express'
import { getAllHardwareByUser, hardwareregister } from '../controllers/authHardwareController.js'
import { licenseController } from '../controllers/authOverviewController.js'
import authenticateJWT from '../middleware/authJwt.authentication.js'

const hardwarerouter = express.Router()

hardwarerouter.post('/register', authenticateJWT ,hardwareregister)

hardwarerouter.get('/hardwares-by-user', authenticateJWT ,getAllHardwareByUser)

hardwarerouter.get('/overview', authenticateJWT ,licenseController)

export default hardwarerouter
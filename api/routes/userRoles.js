import express from 'express'
import { getUserRole } from '../controllers/userRoles'

const router = express.Router()

router.get('/', getUserRole)

export default router

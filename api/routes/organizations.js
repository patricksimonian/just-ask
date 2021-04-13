import express from 'express'

import { organizations } from '../controllers/organizations'

const router = express.Router()

router.get('/', organizations)

export default router

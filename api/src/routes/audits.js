import express from 'express'

import { getAudits } from '../controllers/audits'

const router = express.Router()

router.get('/', getAudits)

export default router

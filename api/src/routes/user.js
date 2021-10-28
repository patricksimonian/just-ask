import express from 'express'

import { getUserPendingInvitations } from '../controllers/user'
  
const router = express.Router()

router.get('/getUserPendingInvitations', getUserPendingInvitations)

export default router
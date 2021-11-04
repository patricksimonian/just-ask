import express from 'express'

import {
    getPendingInvitations,
  } from '../controllers/users'
  
const router = express.Router()

router.get('/pending-invitations', getPendingInvitations)

export default router
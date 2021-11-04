import express from 'express'

import {
    getPendingInvitations,
  } from '../controllers/users'
  
const router = express.Router()

router.get('/getPendingInvitations', getPendingInvitations)

export default router
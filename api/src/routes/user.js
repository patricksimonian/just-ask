import express from 'express'

import {
    getPendingInvitations,
  } from '../controllers/user'
  
const router = express.Router()

router.get('/getPendingInvitations', getPendingInvitations)

export default router
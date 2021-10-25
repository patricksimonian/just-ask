import express from 'express'

import {
  getInvitationRequests,
  createInvitationRequest,
  patchInvitationRequest,
  getUserPendingInvitations,
} from '../controllers/requests'

const router = express.Router()

router.get('/', getInvitationRequests)
router.post('/', createInvitationRequest)
router.patch('/:id', patchInvitationRequest)
router.get('/getUserPendingInvitations', getUserPendingInvitations)
export default router

import express from 'express'

import {
  getInvitationRequests,
  createInvitationRequest,
  patchInvitationRequest,
  getUserPendingRequests,
} from '../controllers/requests'

const router = express.Router()

router.get('/', getInvitationRequests)
router.post('/', createInvitationRequest)
router.patch('/:id', patchInvitationRequest)

router.get('/userPendingRequests', getUserPendingRequests)
export default router

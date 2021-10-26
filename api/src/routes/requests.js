import express from 'express'

import {
  getInvitationRequests,
  createInvitationRequest,
  patchInvitationRequest,
} from '../controllers/requests'

const router = express.Router()

router.get('/', getInvitationRequests)
router.post('/', createInvitationRequest)
router.patch('/:id', patchInvitationRequest)
export default router

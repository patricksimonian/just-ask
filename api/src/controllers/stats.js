import { INVITATION_REQUEST_STATES } from '../constants'
import InvitationRequest from '../db/models/InvitationRequest'

export const getStats = async (req, res) => {
  const successful = await InvitationRequest.count({
    state: INVITATION_REQUEST_STATES.APPROVED,
  })
  const pending = await InvitationRequest.count({
    state: INVITATION_REQUEST_STATES.PENDING,
  })
  const failed = await InvitationRequest.count({
    state: INVITATION_REQUEST_STATES.FAILED,
  })
  const denied = await InvitationRequest.count({
    state: INVITATION_REQUEST_STATES.DENIED,
  })

  res.status(200).json({
    requests: {
      successful,
      denied,
      pending,
      failed,
    },
  })
}

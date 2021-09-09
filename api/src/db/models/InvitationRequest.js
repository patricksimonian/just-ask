import mongoose from 'mongoose'
import { INVITATION_REQUEST_STATES } from '../../constants'

const InvitationRequest = new mongoose.Schema(
  {
    apiVersion: String,
    requester: String,
    recipient: String,
    organization: String,
    reason: String,
    state: {
      type: String,
      enum: [
        INVITATION_REQUEST_STATES.APPROVED,
        INVITATION_REQUEST_STATES.DENIED,
        INVITATION_REQUEST_STATES.PENDING,
        INVITATION_REQUEST_STATES.FAILED,
      ],
    },
    approvedBy: { type: String, default: null },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('InvitationRequest', InvitationRequest)

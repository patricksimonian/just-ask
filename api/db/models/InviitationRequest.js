import mongoose from 'mongoose'
import { INVITATION_REQUEST_STATES } from '../../constants'

const InvitationRequest = new mongoose.Schema(
    {
        apiVersion: String,
        requester: String,
        recipient: String,
        organization: String,
        state: {
            type: String,
            enum: [
                INVITATION_REQUEST_STATES.APPROVED,
                INVITATION_REQUEST_STATES.DENIED,
                INVITATION_REQUEST_STATES.PENDING,
            ],
        },
        approvedBy: String,
    },
    {
        timestamps: true,
    }
)

export default mongoose.Model('InvitationRequest', InvitationRequest)

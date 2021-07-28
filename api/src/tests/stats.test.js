import { INVITATION_REQUEST_STATES } from '../constants'
import { getStats } from '../controllers/stats'
import InvitationRequest from '../db/models/InvitationRequest'

jest.mock('../db/models/InvitationRequest')

describe('Stats Request Controllers', () => {
  describe('GET /stats', () => {
    it('returns stats', async () => {
      const stats = {
        successful: 0,
        denied: 2,
        failed: 4,
        pending: 5,
      }
      InvitationRequest.count.mockImplementation((filter) => {
        switch (filter.state) {
          case INVITATION_REQUEST_STATES.APPROVED:
            return stats.successful
          case INVITATION_REQUEST_STATES.DENIED:
            return stats.denied
          case INVITATION_REQUEST_STATES.FAILED:
            return stats.failed
          case INVITATION_REQUEST_STATES.PENDING:
            return stats.pending
        }
      })
      const req = {}
      const json = jest.fn()
      const res = {
        status: jest.fn().mockImplementation(() => ({ json })),
      }

      await getStats(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(json).toHaveBeenCalledWith({ requests: { ...stats } })
    })
  })
})

import nock from 'nock'
import { INVITATION_REQUEST_STATES, ROLES } from '../constants'
import {
  createInvitationRequest,
  getInvitationRequests,
  patchInvitationRequest,
} from '../controllers/requests'
import InvitationRequest from '../db/models/InvitationRequest'
import accessToken from '../fixtures/accessToken'

import githubPrivateKey from '../fixtures/githubPrivateKey'
import installations from '../fixtures/installations'
import modelsInvitationRequest from '../fixtures/models.InvitationRequest'
import orgInvitation from '../fixtures/orgInvitation'
import userFixture from '../fixtures/user'
import { getConfig, getGithubPrivateKey } from '../utils/config'

jest.mock('../utils/config')
// https://jestjs.io/docs/es6-class-mocks#calling-jestmock-with-the-module-factory-parameter
jest.mock('../db/models/InvitationRequest')
jest.mock('../db/models/Audit')

getGithubPrivateKey.mockReturnValue(githubPrivateKey)

describe('Invitation Request Controllers', () => {
  afterEach(() => {
    nock.cleanAll()
  })
  describe('Creating Invitation Requests', () => {
    it('sends 403 if does role does not have rule requests', async () => {
      const req = {
        auth: {
          role: 'foo',
        },
        param: {
          id: 'bar',
        },
      }
      const res = {
        status: jest.fn().mockImplementation(() => ({ send: jest.fn() })),
      }
      await createInvitationRequest(req, res)
      await createInvitationRequest({ auth: { role: undefined } }, res)
      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.status).toHaveBeenCalledWith(403)
    })

    it('creates pending request if user is requesting for themselves', async () => {
      nock('https://api.github.com')
        .get('/app/installations')
        .reply(200, installations)

      const orgs = installations.filter(
        (installation) => installation.target_type === 'Organization'
      )

      getConfig.mockReturnValueOnce({ orgs: orgs.map((o) => o.account.login) })

      const req = {
        auth: {
          user: 'matt damon',
          role: ROLES.REQUESTER,
        },
        body: {
          user: 'matt damon',
          organizations: orgs.map((o) => o.account.login),
        },
      }

      const res = {
        status: jest.fn().mockImplementation(() => ({
          send: jest.fn(),
        })),
      }

      await createInvitationRequest(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
    })

    it('sends 400 user is requesting for themselves and orgs do not match installations', async () => {
      nock('https://api.github.com')
        .get('/app/installations')
        .reply(200, installations)

      const req = {
        auth: {
          user: 'matt damon',
          role: ROLES.REQUESTER,
        },
        body: {
          user: 'matt damon',
          organizations: ['invalid org'],
        },
      }

      const res = {
        status: jest.fn().mockImplementation(() => ({
          send: jest.fn(),
        })),
      }

      await createInvitationRequest(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('sends 400 if user already has a pending request for themself', async () => {
      nock('https://api.github.com')
        .get('/app/installations')
        .reply(200, installations)

      const orgs = installations.filter(
        (installation) => installation.target_type === 'Organization'
      )

      getConfig.mockReturnValueOnce({ orgs: orgs.map((o) => o.account.login) })
      const req = {
        auth: {
          user: 'matt damon',
          role: ROLES.REQUESTER,
        },
        body: {
          user: 'matt damon',
          organizations: orgs.map((o) => o.account.login),
        },
      }

      InvitationRequest.exists.mockReturnValueOnce(
        Promise.resolve({ id: 'foo' })
      )

      const res = {
        status: jest.fn().mockImplementation(() => ({
          send: jest.fn(),
        })),
      }

      await createInvitationRequest(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('sends 403 if does role does not have rule invitations and request is for someone else', async () => {
      nock('https://api.github.com')
        .get('/app/installations')
        .reply(200, installations)

      const orgs = installations.filter(
        (installation) => installation.target_type === 'Organization'
      )

      getConfig.mockReturnValueOnce({ orgs: orgs.map((o) => o.account.login) })
      const req = {
        auth: {
          user: 'matt damon',
          role: ROLES.REQUESTER,
        },
        body: {
          user: 'shmat saymon',
          organizations: orgs.map((o) => o.account.login),
        },
      }
      const res = {
        status: jest.fn().mockImplementation(() => ({
          send: jest.fn(),
        })),
      }

      await createInvitationRequest(req, res)

      expect(res.status).toHaveBeenCalledWith(403)
    })

    it('sends 200 if request is for someone else', async () => {
      const recipient = 'shmatsaymon'
      nock('https://api.github.com')
        .get('/app/installations')
        .reply(200, installations)
        .post('/app/installations/15321559/access_tokens')
        .reply(201, accessToken)
        .post(/orgs\/[a-zA-Z-]+\/invitations/)
        .reply(201, orgInvitation)
        .get(`/users/${recipient}`)
        .reply(200, userFixture)

      const orgs = installations.filter(
        (installation) => installation.target_type === 'Organization'
      )
      getConfig.mockReset()
      getConfig.mockReturnValue({
        orgs: orgs.map((o) => o.account.login),
        primaryOrg: orgs[0].account.login,
      })

      const req = {
        auth: {
          user: 'mattdamon',
          role: ROLES.COLLABORATOR,
        },
        body: {
          user: recipient,
          organizations: [orgs[0].account.login], // opting for one org here to not need to multiple nock replies
        },
      }
      const res = {
        status: jest.fn().mockImplementation(() => ({
          send: jest.fn(),
        })),
      }

      await createInvitationRequest(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
    })
  })

  describe('Get Invitation Requests', () => {
    it('sends 403 if does role does not have rule approvals', async () => {
      const req = {
        auth: {
          role: 'foo',
        },
        param: {
          id: 'bar',
        },
      }
      const res = {
        status: jest.fn().mockImplementation(() => ({ send: jest.fn() })),
      }
      await getInvitationRequests(req, res)
      await getInvitationRequests({ auth: { role: undefined } }, res)
      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.status).toHaveBeenCalledWith(403)
    })

    it('sends 400 if query param state is invalid or does not exist', async () => {
      const req = {
        auth: {
          user: 'matt damon',
          role: ROLES.APPROVER,
        },
        query: {
          state: 'INVALID',
        },
      }

      const res = {
        status: jest.fn().mockImplementation(() => ({
          send: jest.fn(),
        })),
      }

      await getInvitationRequests(req, res)
      await getInvitationRequests(
        {
          auth: {
            user: 'matt damon',
            role: ROLES.APPROVER,
          },
          query: {},
        },
        res
      )

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('returns pending requests', async () => {
      const req = {
        auth: {
          user: 'matt damon',
          role: ROLES.APPROVER,
        },
        query: {
          state: INVITATION_REQUEST_STATES.PENDING,
        },
      }

      const res = {
        status: jest.fn().mockImplementation(() => ({
          send: jest.fn(),
        })),
      }

      InvitationRequest.find.mockImplementation(() => ({
        exec: jest
          .fn()
          .mockReturnValue(Promise.resolve([modelsInvitationRequest])),
      }))

      await getInvitationRequests(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
    })
  })

  describe('Patch Invitation Requests', () => {
    it('sends 403 if does role does not have rule approvals', async () => {
      const req = {
        auth: {
          role: 'foo',
        },
        param: {
          id: 'bar',
        },
      }
      const res = {
        status: jest.fn().mockImplementation(() => ({ send: jest.fn() })),
      }
      await patchInvitationRequest(req, res)
      await patchInvitationRequest(
        { auth: { role: undefined }, param: { id: 'baz' } },
        res
      )
      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.status).toHaveBeenCalledWith(403)
    })

    it('sends 400 if req.body.state is invalid or does not exist', async () => {
      const req = {
        auth: {
          user: 'matt damon',
          role: ROLES.APPROVER,
        },
        param: {
          id: 'baz',
        },
        body: {
          state: 'INVALID',
        },
      }

      const res = {
        status: jest.fn().mockImplementation(() => ({
          send: jest.fn(),
        })),
      }

      await patchInvitationRequest(req, res)
      await patchInvitationRequest(
        {
          auth: {
            user: 'matt damon',
            role: ROLES.APPROVER,
          },
          param: {
            id: 'baz',
          },
          body: {},
        },
        res
      )

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('returns 400 if patched request is not in pending state or cannot be found', async () => {
      const req = {
        auth: {
          user: 'matt damon',
          role: ROLES.APPROVER,
        },
        param: {
          id: 'foo',
        },
        body: {
          state: INVITATION_REQUEST_STATES.DENIED,
        },
      }

      const res = {
        status: jest.fn().mockImplementation(() => ({
          json: jest.fn(),
          send: jest.fn(),
        })),
      }

      InvitationRequest.updateOne.mockImplementation(() => ({
        exec: jest.fn().mockReturnValue(
          Promise.reject({
            ...modelsInvitationRequest,
            state: INVITATION_REQUEST_STATES.DENIED,
          })
        ),
      }))

      await patchInvitationRequest(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('returns 200 if patched request is succesful and state set to denied', async () => {
      const req = {
        auth: {
          user: 'matt damon',
          role: ROLES.APPROVER,
        },
        param: {
          id: 'foo',
        },
        body: {
          state: INVITATION_REQUEST_STATES.DENIED,
        },
      }

      const res = {
        status: jest.fn().mockImplementation(() => ({
          json: jest.fn(),
        })),
      }

      InvitationRequest.updateOne.mockImplementation(() => ({
        exec: jest.fn().mockReturnValue(
          Promise.resolve({
            ...modelsInvitationRequest,
            state: INVITATION_REQUEST_STATES.DENIED,
          })
        ),
      }))

      await patchInvitationRequest(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
    })
  })
})

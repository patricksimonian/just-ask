import nock from 'nock'
import { ROLES } from '../constants'
import { createInvitationRequest } from '../controllers/requests'
import InvitationRequest from '../db/models/InvitationRequest'

import githubPrivateKey from '../fixtures/githubPrivateKey'
import installations from '../fixtures/installations'
import { getConfig, getGithubPrivateKey } from '../utils/config'

jest.mock('../utils/config')
// https://jestjs.io/docs/es6-class-mocks#calling-jestmock-with-the-module-factory-parameter
jest.mock('../db/models/InvitationRequest')
jest.mock('../db/models/Audit')

getGithubPrivateKey.mockReturnValue(githubPrivateKey)

describe('Invitation Request Controllers', () => {
  describe('Creating Invitation Requests', () => {
    it('sends 403 if does role does not have rule', async () => {
      const req = {
        auth: {
          role: 'foo',
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

      expect(res.status).toHaveBeenCalledWith(200)
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

    it.skip('sends 200 if user is already invited to org', () => {})

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
  })
})

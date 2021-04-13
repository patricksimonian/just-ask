import { getUserFromToken, withRole } from '../middlewares'
import nock from 'nock'
import { ROLES } from '../constants'
import githubPrivateKey from '../fixtures/githubPrivateKey'
import installations from '../fixtures/installations'
import accessToken from '../fixtures/accessToken'
import orgMembership from '../fixtures/orgMembership'
import roleMapping from '../fixtures/roleMapping'
import { getConfig, getGithubPrivateKey, getRoleMapping } from '../utils/config'
import orgTeamMembership from '../fixtures/orgTeamMembership'

jest.mock('../utils/config.js')

const orgs = installations.filter(
  (installation) => installation.target_type === 'Organization'
)

getGithubPrivateKey.mockReturnValue(githubPrivateKey)

describe('Express Custom Middlewares', () => {
  describe('withRole', () => {
    it('returns a function', () => {
      expect(withRole('foo')).toBeInstanceOf(Function)
    })

    it('sets status to 400 if token does not exist', () => {
      const req = {}
      const res = { status: jest.fn() }
      withRole('foo')(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
    })
    it('sets status to 400 if role does not exist', () => {
      const req = { token: 'foo' }
      const res = { status: jest.fn() }
      withRole('foo')(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('sets status to 401 if role does not match', () => {
      const req = {
        token: 'foo',
        auth: {
          role: 'baz',
        },
      }
      const res = { status: jest.fn() }
      withRole('foo')(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
    })
  })
  describe('getUserFromToken', () => {
    it('calls status(401) if there is no token', () => {
      const res = {
        status: jest.fn(() => ({ send: jest.fn() })),
      }
      const req = {
        token: null,
      }
      getUserFromToken(req, res, jest.fn())
      expect(res.status).toHaveBeenCalledWith(401)
    })

    it('returns the user as approve if they are one', async () => {
      getRoleMapping.mockReturnValue(roleMapping)
      getConfig.mockReturnValueOnce({ orgs: orgs.map((o) => o.account.login) })
      const res = {
        status: jest.fn(() => ({ send: jest.fn() })),
      }
      const req = {
        token: 'foo',
      }
      nock('https://api.github.com')
        .get('/user')
        .reply(200, orgMembership.user)
        .post('/app/installations/15321559/access_tokens')
        .reply(201, accessToken)
        .get('/app/installations')
        .reply(200, installations)
        .get(
          `/orgs/${orgs[0].account.login}/memberships/${orgMembership.user.login}`
        )
        .reply(200, orgMembership)
        .get(`/orgs/${orgs[0].account.login}/teams/team`)
        .reply(200, orgTeamMembership)

      await getUserFromToken(req, res, jest.fn())
      expect(req.auth.role).toBe(ROLES.APPROVER)
      expect(req.auth.user).toBe(orgMembership.user.login)
    })
  })
})

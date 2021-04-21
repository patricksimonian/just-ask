import nock from 'nock'
import { getUserRole } from '../controllers/userRoles'
import githubPrivateKey from '../fixtures/githubPrivateKey'
import { getGithubPrivateKey } from '../utils/config'

jest.mock('../utils/config')
// https://jestjs.io/docs/es6-class-mocks#calling-jestmock-with-the-module-factory-parameter
jest.mock('../db/models/InvitationRequest')
jest.mock('../db/models/Audit')

getGithubPrivateKey.mockReturnValue(githubPrivateKey)

describe('User Role Request Controllers', () => {
  afterEach(() => {
    nock.cleanAll()
  })
  describe('User Role Requests', () => {
    it('returns the role', async () => {
      const req = {
        auth: {
          role: 'foo',
        },
      }
      const json = jest.fn()
      const res = {
        status: jest.fn().mockImplementation(() => ({ json })),
      }
      await getUserRole(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(json).toHaveBeenCalledWith({ role: 'foo' })
    })
  })
})

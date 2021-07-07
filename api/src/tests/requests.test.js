import nock from 'nock'
import { ROLES } from '../constants'
import { getAudits } from '../controllers/audits'
import { getUserRole } from '../controllers/userRoles'
import Audit from '../db/models/Audit'
import audits from '../fixtures/audits'
import githubPrivateKey from '../fixtures/githubPrivateKey'
import { getGithubPrivateKey } from '../utils/config'

jest.mock('../utils/config')
// https://jestjs.io/docs/es6-class-mocks#calling-jestmock-with-the-module-factory-parameter
jest.mock('../db/models/InvitationRequest')
jest.mock('../db/models/Audit')

getGithubPrivateKey.mockReturnValue(githubPrivateKey)

describe('Audits Request Controllers', () => {
  describe('GET /audits', () => {
    it('returns audits', async () => {
      Audit.find.mockReturnValue({ sort: () => Promise.resolve(audits) })
      Audit.count.mockReturnValue(Promise.resolve(audits.length))
      const req = {
        auth: {
          role: ROLES.AUDITOR,
        },
        query: {},
      }
      const json = jest.fn()
      const res = {
        status: jest.fn().mockImplementation(() => ({ json })),
      }

      await getAudits(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('returns 403 if not authorized', async () => {
      const req = {
        auth: {
          role: ROLES.COLLABORATOR,
        },
        query: {},
      }
      const json = jest.fn()
      const res = {
        status: jest.fn().mockImplementation(() => ({ json })),
      }

      await getAudits(req, res)
      expect(res.status).toHaveBeenCalledWith(403)
    })

    it('returns 400 if incorrect page or limit params sent', async () => {
      const req = {
        auth: {
          role: ROLES.AUDITOR,
        },
        query: {
          page: 'foo',
        },
      }
      const json = jest.fn()
      const res = {
        status: jest.fn().mockImplementation(() => ({ json })),
      }

      await getAudits(req, res)
      await getAudits({ ...req, query: { limit: 'foo' } }, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.status).toHaveBeenCalledWith(400)
    })
  })
})

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

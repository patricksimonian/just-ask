import init, { getOrgInstallations } from '../utils/init'
import installations from '../fixtures/installations'
import nock from 'nock'

import { getConfig, getGithubPrivateKey } from '../utils/config'
import log from 'log'
import githubPrivateKey from '../fixtures/githubPrivateKey'

jest.mock('../utils/config.js')
jest.mock('log', () => ({
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  notice: jest.fn(),
}))

getGithubPrivateKey.mockReturnValue(githubPrivateKey)

describe('init', () => {
  it('initializes without failure', async () => {
    const orgs = installations.filter(
      (installation) => installation.target_type === 'Organization'
    )

    getConfig.mockReturnValueOnce({ orgs: orgs.map((o) => o.account.login) })
    nock('https://api.github.com')
      .get('/app/installations')
      .reply(200, installations)
    await expect(init()).resolves.toBe(undefined)
  })
})

describe('Octokit initialization', () => {
  afterEach(() => {
    nock.cleanAll()
  })
  beforeEach(() => {
    nock.disableNetConnect()
  })

  describe('getOrgInstallations', () => {
    it('Throws if config.json is undefined or orgs are misconfigured', async () => {
      nock('https://api.github.com')
        .get('/app/installations')
        .reply(200, installations)
      getConfig.mockReturnValueOnce('fs')
      getConfig.mockReturnValueOnce(undefined)
      getConfig.mockReturnValueOnce({ orgs: String })
      getConfig.mockReturnValueOnce({ orgs: [1, Boolean, 'hello world'] })
      getConfig.mockReturnValueOnce({ orgs: ['hello world'] })
      await expect(getOrgInstallations()).rejects.toThrow()
      await expect(getOrgInstallations()).rejects.toThrow()
      await expect(getOrgInstallations()).rejects.toThrow()
      await expect(getOrgInstallations()).rejects.toThrow()
      await expect(getOrgInstallations()).resolves.toBeTruthy()
    })

    it('Throws if config.json orgs is empty', async () => {
      nock('https://api.github.com')
        .get('/app/installations')
        .reply(200, installations)
      getConfig.mockReturnValueOnce({ orgs: [] })
      await expect(getOrgInstallations(installations)).rejects.toThrow()
    })

    it('logs if App has no installations', async () => {
      nock('https://api.github.com').get('/app/installations').reply(200, [])
      getConfig.mockReturnValue({ orgs: ['hello world'] })
      await getOrgInstallations()
      expect(log.notice).toHaveBeenCalledWith(
        'This github app has no public org installations yet'
      )
    })

    it("logs if App has installations but they don't match configured orgs", async () => {
      nock('https://api.github.com')
        .get('/app/installations')
        .reply(200, installations)
      getConfig.mockReturnValueOnce({ orgs: [Math.random() * 100 + ''] })
      await getOrgInstallations()
      expect(log.notice).toHaveBeenCalledWith(
        'This github app has no public org installations yet'
      )
    })

    it('returns only org installations', async () => {
      nock('https://api.github.com')
        .get('/app/installations')
        .reply(200, installations)

      const orgs = installations.filter(
        (installation) => installation.target_type === 'Organization'
      )

      getConfig.mockReturnValueOnce({ orgs: orgs.map((o) => o.account.login) })
      await expect(getOrgInstallations()).resolves.toEqual(orgs)
    })

    it('ignores case for orgs', async () => {
      const casedInstallation = installations.map((i) => ({
        ...i,
        account: { ...i.account, login: i.account.login.toUpperCase() },
      }))
      nock('https://api.github.com')
        .get('/app/installations')
        .reply(200, casedInstallation)

      const orgs = installations.filter(
        (installation) => installation.target_type === 'Organization'
      )

      getConfig.mockReturnValueOnce({ orgs: orgs.map((o) => o.account.login) })
      await expect(getOrgInstallations()).resolves.toEqual(orgs)
    })
  })
})

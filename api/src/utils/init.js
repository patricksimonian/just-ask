import { createAppAuth } from '@octokit/auth'
import { request } from '@octokit/request'
import { every, intersectionBy, isArray, isObject, isString } from 'lodash'
import { getConfig, getGithubPrivateKey } from './config'
import log from 'log'

// cached value
const installationApps = {
  initialized: null,
  apps: {},
  nonInstallatedApp: null,
}

/**
 * getNonInstallationApp
 * @returns a non installed github app
 */
export const getNonInstallationApp = () => {
  log.debug('getNonInstallationApp')
  // caches a non installed app
  if (!installationApps.nonInstallatedApp) {
    const auth = createAppAuth({
      appId: process.env.APP_ID,
      privateKey: getGithubPrivateKey(),
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    })

    installationApps.nonInstallatedApp = request.defaults({
      request: {
        hook: auth.hook,
      },
      mediaType: {
        previews: ['machine-man'],
      },
    })
  }
  return installationApps.nonInstallatedApp
}

const newAuthorizedApp = (installationId) => {
  const app = createAppAuth({
    appId: process.env.APP_ID,
    privateKey: getGithubPrivateKey(),
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    installationId,
  })

  return {
    initialized: Date.now(),
    app,
    id: installationId,
    authenticatedRequest: request.defaults({
      request: {
        hook: app.hook,
      },
      mediaType: {
        previews: ['machine-man'],
      },
    }),
  }
}

export const getInstallations = async () => {
  log.debug('getInstallations')

  const nonInstallationRequest = getNonInstallationApp()

  const response = await nonInstallationRequest('GET /app/installations')

  return response.data
}

export const getOrgInstallations = async () => {
  log.debug('getOrgInstallations')
  const config = getConfig()

  if (
    !config ||
    !isObject(config) ||
    !isArray(config.orgs) ||
    !every(config.orgs, isString) ||
    config.orgs.length === 0
  ) {
    throw new Error(
      'Configuration is invalid. config.orgs is invalid or misconfigured'
    )
  }
  const installations = await getInstallations()
  log.debug(
    `This github app has been installed on ${installations.map(
      (i) => i.account.login
    )}`
  )
  const matchedInstallations = intersectionBy(
    installations,
    config.orgs.map((org) => ({ account: { login: org } })),
    'account.login'
  ).filter((installation) => installation.target_type === 'Organization')
  if (matchedInstallations.length === 0) {
    log.notice(`This github app has no public org installations yet`)
  }

  return matchedInstallations
}

/**
 * a new authenticated app must be created for every installation in order to invite users
 */
export const getAuthenticatedApps = async () => {
  log.debug('getAuthenticatedApps')
  if (!installationApps.initialized) {
    log.notice('Initializing Authenticated Apps')
    installationApps.initialized = Date.now()

    const installations = await getOrgInstallations()
    installations.forEach((installation) => {
      const name = installation.account.login.toLowerCase()
      if (!installationApps.apps[name]) {
        log.info(
          `newAuthorizedApp created for ${name} installation: ${installation.id}`
        )
        installationApps.apps[name] = newAuthorizedApp(installation.id)
      }
    })
  } else {
    log.debug(
      `Installation Apps returned: ${Object.keys(installationApps.apps)}`
    )
    log.notice(
      `Authenticated Apps were cached, reusing the ones initialized on ${installationApps.initialized}`
    )
  }

  return installationApps
}

/**
 * initializes and validates SSO config as well as github applications
 * all errors bubble to top to quit process
 */
export const init = async () => {
  log.info('Checking Authenticated Apps')
  await getAuthenticatedApps()
}

export default init

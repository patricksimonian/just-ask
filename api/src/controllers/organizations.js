import log from 'log'
import { AUDIT_ACTIONS, RULES } from '../constants'
import { createAudit } from '../utils/audit'
import { getAuthenticatedApps, getInstallations } from '../utils/init'
import { hasRule } from '../utils/roles'

export const organizations = async (req, res) => {
  // gets available orgs to make requests too

  if (!hasRule(req.auth.role, RULES.organizations)) {
    log.warn(
      `user ${req.auth.user} does not have sufficient priviledge for ${AUDIT_ACTIONS.api.organizations.list}`
    )

    await createAudit({
      apiVersion: 'v1',
      action: AUDIT_ACTIONS.api.requests.list,
      data: JSON.stringify({
        message: `user does not have rule ${RULES.organizations}`,
        user: req.auth.user,
        payload: req.body,
        type: 'error',
      }),
    })

    res.status(403).send({
      message: 'user does not have permission to list organizations',
    })
    return
  }

  const authenticatedApps = await getAuthenticatedApps()
  const appIds = Object.keys(authenticatedApps.apps).map(
    (app) => authenticatedApps.apps[app].id
  )

  const installations = await getInstallations()
  // only return installstions that have been configured in the app
  const configuredInstallations = installations.filter(
    (installation) => appIds.findIndex((id) => id === installation.id) > -1
  )

  res.json(
    configuredInstallations.map((installation) => ({
      id: installation.account.id,
      name: installation.account.login,
      image: installation.account.avatar_url,
    }))
  )
}

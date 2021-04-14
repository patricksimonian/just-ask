import { getConfig } from './config'
import { getAuthenticatedApps } from './init'

export const inviteUserToOrgs = async (userId, orgs) => {
  const installations = await getAuthenticatedApps()
  const promises = orgs.map((org) => {
    const app = installations.apps[org]
    return app.authenticatedRequest('POST /orgs/{org}/invitations', {
      org,
      invitee_id: userId,
    })
  })
  await Promise.all(promises)
}

export const getUserByName = async (username) => {
  const installations = await getAuthenticatedApps()
  const config = getConfig()
  const response = await installations.apps[
    config.primaryOrg
  ].authenticatedRequest('GET /users/{username}', {
    username,
  })
  return response.data
}

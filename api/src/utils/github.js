import log from 'log'
import { INVITATION_REQUEST_STATES } from '../constants'
import InvitationRequest from '../db/models/InvitationRequest'
import { getConfig } from './config'
import { getAuthenticatedApps } from './init'

export const inviteUserToOrg = async (userId, org) => {
  const installations = await getAuthenticatedApps()
  const app = installations.apps[org.toLowerCase()]
  return app.authenticatedRequest('POST /orgs/{org}/invitations', {
    org,
    invitee_id: userId,
  })
}

export const inviteUserToOrgs = async (userId, orgs, recipient, requester) => {
  log.debug(`inviteUserToOrg ${userId} ${orgs}`)

  return orgs.map(async (org) => {
    try {
      log.info(`User ${userId} is being invited to ${org}`)
      await inviteUserToOrg(userId, org)
      log.info(`User ${userId} is to ${org}`)
      await InvitationRequest.create({
        organization: org.toLowerCase(),
        recipient,
        requester,
        apiVersion: 'v1',
        state: INVITATION_REQUEST_STATES.APPROVED,
      })
    } catch (e) {
      if (e.status === 422) {
        log.info(`User ${userId} is already in org ${org}. Skipping.`)
        await InvitationRequest.create({
          organization: org.toLowerCase(),
          recipient,
          requester,
          apiVersion: 'v1',
          state: INVITATION_REQUEST_STATES.APPROVED,
        })
      } else {
        log.error(`Could not invite ${userId} to org ${org}`)
        log.debug(JSON.stringify(e))
        await InvitationRequest.create({
          organization: org.toLowerCase(),
          recipient,
          requester,
          apiVersion: 'v1',
          state: INVITATION_REQUEST_STATES.FAILED,
        })
        throw e
      }
    }
  })
}

export const getUserByName = async (username) => {
  log.debug(`getUserByName ${username}`)
  const installations = await getAuthenticatedApps()
  const config = getConfig()

  const response = await installations.apps[
    config.primaryOrg
  ].authenticatedRequest('GET /users/{username}', {
    username,
  })
  return response.data
}

export const getRequestStatuses = async (requests) => {
  log.error(`getRequestStatuses`)
  // let pendingRequests = [];
  log.error(`requests is of type ${typeof requests}`)
  for (const key in requests) {
    if (requests[key]) {
      log.error(
        `recipient: ${requests[key]['recipient']}, org: ${requests[key]['organization']}`
      )
    }
  }

  return null
}

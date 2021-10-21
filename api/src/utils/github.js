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
  console.log(config, installations)
  const response = await installations.apps[
    config.primaryOrg.toLowerCase()
  ].authenticatedRequest('GET /users/{username}', {
    username,
  })
  return response.data
}

export const getRequestStatuses = async (requests) => {
  log.info(`getRequestStatuses`)
  let pendingUserRequests = []
  let orgsWithUserPendingRequests = []
  const installations = await getAuthenticatedApps()

  //dictionary of requests made by user with org as key, recipients as value(s)
  // get each org once and check for pending requests
  for (const key in requests) {
    if (
      requests[key] &&
      requests[key]['organization'] &&
      orgsWithUserPendingRequests.indexOf(requests[key]['organization']) < 0
    ) {
      orgsWithUserPendingRequests.push(requests[key]['organization'])
    }
  }

  for (const org of orgsWithUserPendingRequests) {
    log.info(`org being searched ${org}`)
    const orgPendingRequests = await installations.apps[
      org.toLowerCase()
    ].authenticatedRequest('GET /orgs/{org}/invitations', {
      org,
    })

    for (const key in orgPendingRequests.data) {
      // was this pending request made by the current user?
      for (const k in requests) {
        if (
          requests[k]['organization'].toLowerCase() === org &&
          requests[k]['recipient'] === orgPendingRequests.data[key]['login']
        ) {
          log.info(
            `Found pending request made by current user. Recipient: ${requests[k]['recipient']}, for org: ${org}`
          )
          pendingUserRequests.push(orgPendingRequests.data[key])
        }
      }
    }
    log.debug(`response ${JSON.stringify(orgPendingRequests.data)}`)
  }

  return pendingUserRequests
}

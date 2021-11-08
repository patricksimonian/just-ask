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
    config.primaryOrg.toLowerCase()
  ].authenticatedRequest('GET /users/{username}', {
    username,
  })
  return response.data
}

export const getRequestStatuses = async (requests) => {
  log.info(`getRequestStatuses`)
  let pendingUserRequests = []
  const installations = await getAuthenticatedApps()

  const config = getConfig()

  for (const org of config.orgs) {
    log.debug(`org being searched ${org}`)
    const orgPendingRequests = await installations.apps[
      org.toLowerCase()
    ].authenticatedRequest('GET /orgs/{org}/invitations', {
      org,
    })
    pendingUserRequests = pendingUserRequests.concat(filterOrgRequestsByUser(requests, orgPendingRequests, org))
  }

  return pendingUserRequests
}

const filterOrgRequestsByUser = (requests, orgPendingRequests, org) => {
  const recipients = requests.map((requestInDB) => {
    return { 
      name: requestInDB.recipient,
      organization: requestInDB.organization}
  })
  let pendingRequests = []

  for(const orgRequest of orgPendingRequests.data){
    if(recipients.filter(e  => e.name === orgRequest.login && e.organization.toLowerCase() === org.toLowerCase()).length  > 0){
      pendingRequests.push(orgRequest)
    }
  }

  return pendingRequests
}

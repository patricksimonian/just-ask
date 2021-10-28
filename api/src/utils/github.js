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
  const installations = await getAuthenticatedApps()

  const config = getConfig()

  for (const org of config.orgs) {
    log.debug(`org being searched ${org}`)
    const orgPendingRequests = await installations.apps[
      org.toLowerCase()
    ].authenticatedRequest('GET /orgs/{org}/invitations', {
      org,
    })
    log.info(Object.values(orgPendingRequests))
    pendingUserRequests = pendingUserRequests.concat(Object.values(orgPendingRequests.data).filter
    (match => requests.map((requestInDB) => {
      requestInDB.recipient === match.login
    })))
    //pendingUserRequests += filterResult
    // orgPendingRequests.data.map((pendingRequest) => {
    //   // make sure the user made this request before we add it to  the information returned
    //   // Patrick, I wonder if you have any thoughts about readability here. 
    //   if(requests.map((requestInDB) => {requestInDB.recipient === pendingRequest.login && 
    //     requestInDB.organization.toLowerCase() === org.toLowerCase()})){
    //     pendingUserRequests.push(pendingRequest)
    //   }
    // })
  }
  

  return pendingUserRequests
}

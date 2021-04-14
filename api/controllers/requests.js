import { AUDIT_ACTIONS, INVITATION_REQUEST_STATES, RULES } from '../constants'
import { hasRule } from '../utils/roles'
import InvitationRequest from '../db/models/InvitationRequest'
import { difference } from 'lodash'
import { getAuthenticatedApps } from '../utils/init'
import log from 'log'
import { createAudit } from '../utils/audit'
import { inviteUserToOrgs } from '../utils/invitations'

/**
 * GET /requests
 * this request should fail if state query param does not exist
 * @param {Express Request} req
 * @param {Express Response} res
 * @returns undefined
 */
export const getInvitationRequests = async (req, res) => {
  log.info('getInvitationRequests')

  if (!hasRule(req.auth.role, RULES.approvals)) {
    log.warn(
      `user ${req.auth.user} does not have sufficient priviledge for ${AUDIT_ACTIONS.api.requests.get}`
    )

    await createAudit({
      apiVersion: 'v1',
      action: AUDIT_ACTIONS.api.requests.list,
      data: JSON.stringify({
        message: `user does not have rule ${RULES.approvals}`,
        user: req.auth.user,
        payload: req.body,
        type: 'error',
      }),
    })

    res.status(403).send({
      message: 'user does not have permission to make requests',
    })
    return
  }
  const stateParamValid = Object.keys(INVITATION_REQUEST_STATES).includes(
    req.query.state
  )

  if (!stateParamValid || !req.query.state) {
    log.warn(
      `user ${req.auth.user} requests with state=${req.query.state} is invalid`
    )
    res.status(400).send({
      message: 'unable to get requests when state param is invalid',
    })
    return
  }

  try {
    const requests = await InvitationRequest.find({
      state: req.query.state,
    }).exec()

    log.info(
      `user ${req.auth.user} found requests with state=${req.query.state}`
    )

    res.status(200).send(requests)
    return
  } catch (e) {
    log.error(`unable to find requests`)

    res.status(400).send({
      message: `Unable to get invitation requests with state ${req.query.state}`,
    })
  }
}
/**
 * POST /requests
 * @param {Express Request} req
 * @param {Express Response} res
 * @returns undefined
 */
export const createInvitationRequest = async (req, res) => {
  log.info('createInvitationRequest')
  // get role and check rule
  if (!hasRule(req.auth.role, RULES.requests)) {
    log.warn(
      `user ${req.auth.user} does not have sufficient priviledge for ${AUDIT_ACTIONS.api.requests.create}`
    )

    await createAudit({
      apiVersion: 'v1',
      action: AUDIT_ACTIONS.api.requests.create,
      data: JSON.stringify({
        message: `user does not have rule ${RULES.requests}`,
        user: req.auth.user,
        payload: req.body,
        type: 'error',
      }),
    })

    res.status(403).send({
      message: 'user does not have permission to make requests',
    })
    return
  }

  const authApps = await getAuthenticatedApps()
  // is request for self
  const { user: recipient, organizations } = req.body
  const { user: requester } = req.auth

  const requestingForSelf = recipient.toLowerCase() === requester.toLowerCase()
  const installations = Object.keys(authApps.apps)
  // if user is requesting invites to orgs that have not been installed
  const diff = difference(organizations, installations)
  if (diff.length > 0) {
    log.warn(
      `user ${req.auth.user} request is for orgs that are not verified installations`
    )
    res.status(400).send({
      message: 'organizations do not match installations for the github app',
    })
    return
  }

  const requests = organizations.map((organization) => ({
    organization,
    recipient,
    requester,
    apiVersion: 'v1',
    state: INVITATION_REQUEST_STATES.PENDING,
  }))

  // when requester is requesting for themselves then just create a pending request
  if (requestingForSelf) {
    log.info(`user ${req.auth.user} is creating request on own behalf`)
    const pendingRequest = await InvitationRequest.exists({
      recipient,
      requester,
      state: INVITATION_REQUEST_STATES.PENDING,
    })

    if (pendingRequest) {
      log.info(`user ${req.auth.user} is already has request for own behalf`)
      res
        .status(400)
        .send({ message: 'Pending request for yourself already exists' })
      return
    }
    // check if there is a difference between requested orgs and current installations

    try {
      await InvitationRequest.create(requests)

      log.info(`user ${req.auth.user} pending request created`)

      res.status(201).send({
        message: `${requests.length} pending invitation${
          requests.length > 1 ? 's' : ''
        }created`,
      })
    } catch (e) {
      log.warn(`user ${req.auth.user} request failed`)
      res.status(400).send({
        message: 'Unable to create invitation',
      })
    }
    return
  }

  // check if request can be auto approved
  if (!hasRule(req.auth.role, RULES.invitations)) {
    log.warn(
      `user ${req.auth.user} does not have sufficient priviledge for ${AUDIT_ACTIONS.api.requests.create}`
    )

    await createAudit({
      apiVersion: 'v1',
      action: AUDIT_ACTIONS.api.requests.create,
      data: JSON.stringify({
        message: `user does not have rule ${RULES.requests}`,
        user: req.auth.user,
        payload: req.body,
        type: 'error',
      }),
    })
    res.status(403).send({
      message: 'user does not have permission to make requests',
    })
    return
  }

  try {
    await inviteUserToOrgs(req.auth.userId, organizations)

    await InvitationRequest.create(
      requests.map((r) => ({ ...r, state: INVITATION_REQUEST_STATES.APPROVED }))
    )

    log.info(`user ${req.auth.user} approved request created for ${recipient}`)
    // this is where we could create the invitations for recipient

    res.status(201).send({
      message: `${requests.length} approved invitation${
        requests.length > 1 ? 's' : ''
      }created`,
    })
  } catch (e) {
    console.log(e)
    log.warn(`user ${req.auth.user} request failed`)
    res.status(400).send({
      message: 'Unable to create invitation',
    })
  }
}

import { AUDIT_ACTIONS, INVITATION_REQUEST_STATES, RULES } from '../constants'
import { hasRule } from '../utils/roles'
import InvitationRequest from '../db/models/InvitationRequest'
import { difference } from 'lodash'
import { getAuthenticatedApps } from '../utils/init'
import log from 'log'
import { createAudit } from '../utils/audit'

import {
    getRequestStatuses,
  } from '../utils/github'

  export const getPendingInvitations = async (req, res) => {
    log.info('getPendingInvitations')
  
    await createAudit({
      apiVersion: 'v1',
      action: AUDIT_ACTIONS.api.user.getPendingInvitations,
      data: JSON.stringify({
        message: `user attempting to view pending requests`,
        user: req.auth.user,
        payload: req.body,
        type: 'info',
      }),
    })
  
    try {
      const requests = await InvitationRequest.find({
        requester: req.auth.user,
        state: {$ne: 'APPROVED'}
      }).exec()
      log.error(requests)
      //  we have the requests made by the user (on other peoples'  behalf), now use github api to see the real status of those requests
      const requestStatuses = await getRequestStatuses(requests)
      log.info(requestStatuses)
      res.status(200).json(requestStatuses)
  
    } catch (e) {
      log.warn(`user ${req.auth.user} request failed`)
      log.debug(e)
      res.status(500).send({
        message: "Unable to  fetch user's pending requests",
      })
    }
  }
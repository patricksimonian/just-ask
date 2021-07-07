import { AUDIT_ACTIONS, RULES } from '../constants'
import { hasRule } from '../utils/roles'
import { parseInt } from 'lodash'
import log from 'log'
import Audit from '../db/models/Audit'

/**
 * GET /requests
 * this request should fail if state query param does not exist
 * @param {Express Request} req
 * @param {Express Response} res
 * @returns undefined
 */
export const getAudits = async (req, res) => {
  log.info('getAudits')
  const { page, limit } = req.query

  const MAX_LIMIT = 100
  const actualPage = page ? page : 1
  const pageLimit = limit && limit < MAX_LIMIT ? limit : MAX_LIMIT

  if (isNaN(parseInt(actualPage)) || isNaN(parseInt(pageLimit))) {
    res.status(400).json({ message: 'invalid page parameters' })
    return
  }

  if (!hasRule(req.auth.role, RULES.view_audits)) {
    log.warn(
      `user ${req.auth.user} does not have sufficient priviledge for ${AUDIT_ACTIONS.api.audits.list}`
    )

    res.status(403).json({
      message: 'user does not have permission to list audits',
    })
    return
  }

  let skip = Math.floor(actualPage * pageLimit)
  skip = skip > pageLimit ? skip : 0
  const audits = await Audit.find(
    {},
    {},
    { limit: Math.floor(pageLimit), skip }
  )
  const count = await Audit.count()

  res.status(200).json({
    message: 'found',
    data: audits.map((a) => ({
      id: a._id,
      data: JSON.parse(a.data),
      createdAt: a.createdAt,
    })),
    count,
  })
}

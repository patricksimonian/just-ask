import Audit from '../db/models/Audit'
import log from 'log'

export const createAudit = async (data) => {
  try {
    await Audit.create(data)
  } catch (e) {
    log.error('Unable to create Audit log!')
  }
}

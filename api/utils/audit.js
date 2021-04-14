import Audit from '../db/models/Audit'
import log from 'log'
export const createAudit = (data) => {
  return new Promise((resolve, reject) => {
    Audit.create(data, (err, result) => {
      if (err) {
        log.error('Unable to create Audit log!')
        reject(err)
      }

      resolve(result)
    })
  })
}

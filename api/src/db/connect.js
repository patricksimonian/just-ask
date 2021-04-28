import mongoose from 'mongoose'
import log from 'log'

export default () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(process.env.MONGO_URL)
    const db = mongoose.connection
    db.on('error', () => {
      log.error('Unable to connect to database!')
      reject()
    })
    db.once('open', function () {
      log.info('Database Connected')
      resolve()
    })
  })
}

import 'dotenv/config'
import express from 'express'
import logNode from 'log-node'
import log from 'log'
import axios from 'axios'
import cors from 'cors'
import expressBearerToken from 'express-bearer-token'
import init from './utils/init.js'
import connect from './db/connect.js'
import orgRouters from './routes/organizations'
import userRoleRouters from './routes/userRoles'
import requestRouters from './routes/requests'
import { getUserFromToken } from './middlewares/index.js'

async function initailize() {
  logNode()

  await connect()
  try {
    await init()
  } catch (e) {
    console.error(e)
    log.error('Failed to initialize, exiting')
    process.exit(1)
  }

  const app = express()

  // middlewares
  app.use(express.json())
  app.use(cors({ origin: process.env.WEB_URL }))
  app.get('/server-health', (req, res) =>
    res.send(process.env.SERVER_HEALTHY_MESSAGE || 'ok')
  )

  app.post('/auth', async (req, res) => {
    if (!req.body.code) {
      res.status(400).send('auth requires code')
    }
    try {
      const response = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code: req.body.code,
        },
        {
          headers: {
            accept: 'application/json',
          },
        }
      )
      res.status(201).send(response.data)
    } catch (e) {
      log.error('unable to authenticate user')

      res.status(400).send({
        message: 'Unable to authenticate user using web application oauth flow',
      })
    }
  })

  app.use(expressBearerToken())
  app.use(getUserFromToken)
  // just verifies github token is still working
  app.get('/verify', (req, res) => {
    res.status(200).json({ message: 'ok' })
  })

  app.use('/roles', userRoleRouters)
  app.use('/organizations', orgRouters)
  app.use('/requests', requestRouters)

  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
  })
}

initailize()

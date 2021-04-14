import 'dotenv/config'
import express from 'express'
import logNode from 'log-node'
import log from 'log'
import axios from 'axios'
import expressBearerToken from 'express-bearer-token'
import init from './utils/init.js'
import connect from './db/connect.js'
import orgRouters from './routes/organizations'
import requestRouters from './routes/requests'
import { getUserFromToken } from './middlewares/index.js'

async function initailize() {
  logNode()

  await connect()
  await init()

  const app = express()

  // middlewares
  app.use(express.json())

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

  app.use('/organizations', orgRouters)
  app.use('/requests', requestRouters)

  app.listen(process.env.PORT || 3000, () => {
    console.log('Listening')
  })
}

initailize()

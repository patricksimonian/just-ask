import 'dotenv/config'
import express from 'express'
import logNode from 'log-node'
import axios from 'axios'
import init, { getAuthenticatedApps } from './utils/init.js'
import connect from './db/connect.js'
import orgRouters from './routes/organizations'
import { getUserFromBearerToken } from './utils/roles.js'

async function initailize() {
  logNode()

  await connect()
  await init()

  const app = express()

  // middlewares
  app.use(express.json())

  app.get('/', async (req, res) => {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: req.query.code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    )
    console.log(response.data)
    const user = await getUserFromBearerToken(response.data.access_token)
    console.log(user)
    res.send(response.data)
  })
  app.get('/server-health', (req, res) =>
    res.send(process.env.SERVER_HEALTHY_MESSAGE || 'ok')
  )

  app.use('/organizations', orgRouters)

  app.listen(process.env.PORT || 3000, () => {
    console.log('Listining')
  })
}

initailize()

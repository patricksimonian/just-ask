const { createAppAuth } = require('@octokit/auth')
import { request } from '@octokit/request'
import { readFileSync } from 'fs'
import path from 'path'

const file = readFileSync(
  path.join(__dirname, '../config/github-private-key.pem')
)

const auth = createAppAuth({
  appId: 104778,
  privateKey: file.toString(),
  clientId: 'Iv1.65fa64309c0ff4b6',
  clientSecret: '8b92a62398af6f9aff5c2151547b2bb54bd14664',
})

export const requestWithAuth = request.defaults({
  request: {
    hook: auth.hook,
  },
  mediaType: {
    previews: ['machine-man'],
  },
})

export const getUser = async (username) => {
  return await requestWithAuth('GET /users/{username}', {
    username,
  })
}

export const inviteUserToOrg = async (username) => {
  const { data } = await getUser(username)

  return await requestWithAuth('POST /orgs/{org}/invitations', {
    org: 'patrick-org-test',
    invitee_id: data.id,
  })
}

requestWithAuth('GET /app/installations').then(console.log)

import log from 'log'
import { ROLES, ROLE_PRESCEDENT } from '../constants'
import { doesUserHaveRole, getUserFromBearerToken } from '../utils/roles'

export const logMiddleware = (req, res, next) => {
  log.info(`${req.method} ${req.originalUrl}`)

  next()
}
/**
 * sets user and role in req.auth
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getUserFromToken = async (req, res, next) => {
  const getRoles = async (user) => {
    let roles = []
    for (let role of ROLE_PRESCEDENT) {
      if (await doesUserHaveRole(role, user)) {
        roles = roles.concat(role)
      }
    }

    return roles
  }

  if (!req.token) {
    res.status(401).send()
  } else {
    try {
      const user = await getUserFromBearerToken(req.token)

      const roles = await getRoles(user.login)

      req.auth = {
        user: user.login,
        id: user.id,
        role: roles[0] || null, // backwards compatability
        roles,
      }
      next()
    } catch (e) {
      log.error(e)
      // token must have expired
      res.status(401).send('Token expired')
    }
  }
}

/**
 * a closure to return middlewares gated by role
 * @param {String} role
 * @returns
 */
export const withRole = (role) => (req, res, next) => {
  if (!req.token) {
    res.status(400)
  } else if (!req.auth) {
    res.status(400)
  } else if (role !== req.auth.role) {
    res.status(401)
  } else {
    next()
  }
}

export const roleProtectedMiddlewares = Object.keys(ROLES).reduce(
  (middlewares, role) => {
    middlewares[role] = withRole(role)
    return middlewares
  },
  {}
)

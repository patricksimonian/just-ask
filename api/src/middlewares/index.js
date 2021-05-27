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
  const getRole = async (user) => {
    for (let role of ROLE_PRESCEDENT) {
      if (await doesUserHaveRole(role, user)) return role
    }

    return null
  }

  if (!req.token) {
    res.status(401).send()
  } else {
    try {
      const user = await getUserFromBearerToken(req.token)

      const role = await getRole(user.login)

      req.auth = {
        user: user.login,
        id: user.id,
        role,
      }
      next()
    } catch (e) {
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

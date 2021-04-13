import { ROLES, ROLE_PRESCEDENT } from '../constants'
import { doesUserHaveRole, getUserFromBearerToken } from '../utils/roles'

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
    const user = await getUserFromBearerToken(req.token)
    const role = await getRole(user)

    req.auth = {
      user,
      role,
    }
    next()
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

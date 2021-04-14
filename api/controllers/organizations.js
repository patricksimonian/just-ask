import { AUDIT_ACTIONS } from '../constants'
import { createAudit } from '../utils/audit'
import { getInstallations } from '../utils/init'

export const organizations = async (req, res) => {
  // gets available orgs to make requests too
  await createAudit({
    apiVersion: 'v1',
    action: AUDIT_ACTIONS.api.organizations.list,
    data: JSON.stringify({
      message: `user attempting to get organizations`,
      user: req.auth.user,
      type: 'info',
    }),
  })

  const installations = await getInstallations()

  res.json(
    installations.map((installation) => ({
      id: installation.account.id,
      name: installation.account.login,
      image: installation.account.avatar_url,
    }))
  )
}

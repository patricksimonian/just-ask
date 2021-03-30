import { getInstallations } from "../utils/init"

export const organizations = async (req, res) => {
  // gets available orgs to make requests too
  const installations = await getInstallations();

  res.json(installations.map(installation => ({
    id: installation.account.id,
    name: installation.account.login,
    image: installation.account.avatar_url
  })));
}
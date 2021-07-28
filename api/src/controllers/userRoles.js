export const getUserRole = (req, res) =>
  res.status(200).json({ role: req.auth.role, roles: req.auth.roles })

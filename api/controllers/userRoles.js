export const getUserRole = (req, res) =>
  res.status(200).json({ role: req.auth.role })

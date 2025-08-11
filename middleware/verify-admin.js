const verifyAdmin = (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ err: 'Admin access required.' })
    }
    next()
  } catch (err) {
    res.status(403).json({ err: 'Admin verification failed.' })
  }
}

module.exports = verifyAdmin

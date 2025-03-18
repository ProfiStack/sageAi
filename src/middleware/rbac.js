const authorizeRole = (role) => (req, res, next) => {
  if (req.user.role === 'SUPER_ADMIN') {
     next();
     return
  }
  if (req.user.role !== role) {
    return res.status(403).json({ message: 'Access Forbidden' });
  }
  next();
};

module.exports = authorizeRole;

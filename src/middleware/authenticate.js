const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticateToken = async (req, res, next) => {
  console.log(req.header('authorization'));
  const token = req.header('Authorization')?.split(' ')[1];
  console.log(token);
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);
    next();
  } catch (err) {
    res.status(403).json({ message: 'Please signup or login' });
  }
};

module.exports = authenticateToken;

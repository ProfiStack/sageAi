const express = require('express');
const authRoutes = require('./auth');
const router = express.Router();

module.exports = () => {
  router.get('/test', (req,res) => {
    return res.json({ message: 'Postgres. Welcome :)' });
  });
  router.use('/auth', authRoutes);
  return router;
};

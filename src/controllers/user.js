const { User } = require('../models');

module.exports = {
  list: async (req, res) => {
    const users = await User.findAll({});
    return res.json({ users });
  },

  get: async (req, res) => {
    return res.json({ user: req.context.user.toJSON() });
  },
};

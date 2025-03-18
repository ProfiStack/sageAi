const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { STARTUP, INVESTOR } = require('../constants/constants');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  register: async (req, res) => {
    const { fullName, email, password, role } = req.body;
    if(role !== STARTUP && role !== INVESTOR) {
      return res.json({message: 'Please select proper role to signup'});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await User.create({ id: uuidv4(), fullName, email, password: hashedPassword, role });
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
      const userPlain = user.get({ plain: true });
      delete userPlain.password;
      res.status(201).json({ message: 'Welcome to naimaat...', user: userPlain, token });
    } catch (error) {
      res.status(400).json({ message: 'Registration error', error });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
  
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const validPassword = await bcrypt.compareSync(password, user.password);
      if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });
  
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
      const userPlain = user.get({ plain: true });
      delete userPlain.password;
      res.json({ user: userPlain, token, message: 'Welcome to naimaat...' });
    } catch (error) {
      res.status(400).json({ message: 'Login error', error });
    }
  }
}

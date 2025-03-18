const router = require('express').Router();
const { auth } = require('../controllers');
router.post('/login', auth.login);
router.post('/signup', auth.register);

module.exports = router;

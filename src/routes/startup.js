// const express = require('express');
// const { startup } = require('../controllers');
// const authenticateToken = require('../middleware/authenticate');
// const authorizeRole = require('../middleware/rbac');
// const { uploadMultiple } = require('../modules/s3');
// const router = express.Router();

// router.post('/', authenticateToken, uploadMultiple, authorizeRole('USER'), startup.createStartup);
// router.get('/', startup.getStartups);
// router.get('/:id', startup.getStartup);
// module.exports = router;

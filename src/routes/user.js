const router = require('express').Router();
const { user } = require('../controllers');

/**
 * A helper function to create an authorization middleware specific
 * to roles. This prevents repetition of the entity argument.
 *
 * @param action
 * @returns {*}
 */

router.get('/', user.list);
router.get('/:id', user.get);

module.exports = router;

const router = require('express').Router();
const authentication = require('../middlewares/authentication');
const UserController = require('../controllers/userController');
const EventController = require('../controllers/eventController');

router.post('/users/register', UserController.register)
router.post('/users/login', UserController.login)

module.exports = router;
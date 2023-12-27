const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users_controller');

router.get('/profile'. userController.profile);

module.exports = router;
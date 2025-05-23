const express = require('express');
const userController = require('../Controller/UserController');
const { protect } = require('../Middleware/Auth');

const router = express.Router();

router.post("/register", userController.register);
router.post('/login', userController.login);
router.get('/profile', protect, userController.getProfile);

module.exports = router;

const express = require('express');
const authController = require('../controllers/auth.controller')

const authRoutes = express.Router();


authRoutes.post('/register', authController.registerController)

authRoutes.post('/login', authController.loginController)

authRoutes.post('/logout',authController.userLogoutController)


module.exports = authRoutes;
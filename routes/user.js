const express = require('express');
const Router = express.Router();
const userController = require('../controller/userController')
const authController = require('../controller/authController');
const { Route } = require('express');


Router.post('/login',authController.login)
Router.post('/logout',authController.logout)
Router.post('/signup',authController.signup)

Router.route('/')
    .get(authController.protect, userController.getAllUsers)
    .post(userController.createUser)

Router.get('/getMyDonations',authController.protect, userController.getMyDonations)

Router.get('/me', authController.protect,userController.me)

Router.route('/:id')
    .get(authController.protect ,authController.restrictTo('admin'), userController.getUser)
    .delete(authController.protect ,authController.restrictTo('admin'),userController.deleteUser)


module.exports = Router
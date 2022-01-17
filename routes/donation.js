const express = require('express');
const Router = express.Router();
const authController = require('../controller/authController')
const donationController = require('../controller/donationController')

Router.route('/')
    .get( authController.protect,authController.restrictTo('admin'), donationController.getAllDonations)
    .post(authController.protect , donationController.createDonation)

// Router.get('/getDonationByName/:id')



module.exports = Router;
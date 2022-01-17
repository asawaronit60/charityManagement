const express = require('express');
const Router = express.Router();
const causeController = require('../controller/causeController')
const authController  = require('../controller/authController')


Router.route('/')
    .get(causeController.getAllCauses)
    .post(causeController.createCause)
    .delete(causeController.deleteAllCauses)

Router.get('/getCauseDetails',causeController.getCauseDetails)
Router.get('/topCauses',causeController.getTop3)

Router.route('/:id')
    .get(causeController.getCause)
    .delete(causeController.deleteCause)

module.exports = Router
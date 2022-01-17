const express = require('express');
const Router = express.Router();
const contactController = require('../controller/contactController')

Router.route('/')
    .get(contactController.getAllcontact)
    .post(contactController.createContact)

module.exports = Router
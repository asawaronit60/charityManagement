const express = require('express');
const Router = express.Router();
const authController = require('../controller/authController')
const viewController = require('../controller/viewController');


Router.get('/',authController.isAdmin,viewController.getHome)
Router.get('/about',viewController.getAbout)
Router.get('/admin', viewController.getAdmin)
Router.get('/contact',viewController.getContact)
Router.get('/login',viewController.getLogin)
Router.get('/blog',viewController.getBlogs)
Router.get('/cause',viewController.getCause)
Router.get('/createCause',viewController.createCause)
Router.get('/createBlog',viewController.createBlog)
Router.get('/signup',viewController.signup)
Router.get('/causeDetail/:id',viewController.getCauseDetails)

module.exports = Router
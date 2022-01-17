const express = require('express');
const Router = express.Router();
const blogController = require('../controller/blogController')
const authController = require('../controller/authController')

Router.route('/')
    .get(blogController.getAllBlogs)
    .post(blogController.createBlog)


Router.route('/:id')
    .delete(blogController.deleteBlog)
module.exports = Router

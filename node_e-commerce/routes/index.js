const express = require('express');
const router = express.Router();

let productController = require('./product/controllers/productController');
let paginate = require('../routes/product/utils/pagination');

/* GET home page. */
router.get('/', productController.getPageIfUserLoggedIn)
router.get('/page/:page', paginate)

module.exports = router;

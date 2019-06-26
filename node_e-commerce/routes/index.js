const express = require('express');
const router = express.Router();

let productController = require('./product/controllers/productController');

/* GET home page. */
router.get('/', function(req, res, next) {
  
  productController.getAllProducts({})
    .then(products => {
      res.render('index', {
        products: products
      })
    })
    .catch(error => {
      res.status(error.status).json(error)
    })
});

module.exports = router;

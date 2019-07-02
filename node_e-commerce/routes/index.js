const express = require('express');
const router = express.Router();

let productController = require('./product/controllers/productController');
let paginate = require('../routes/product/utils/pagination');

/* GET home page. */
router.get('/', productController.getPageIfUserLoggedIn)
router.get('/page/:page', paginate)

router.get('/test', function(req, res) {
    res.render('test')
})

router.post('/testJQuery', function(req, res) {
    console.log(req.body);
    
    res.send({result: "success"})

    // let errors = {};
    // errors.status = 500;
    // errors.message = "error message";

    // res.status(errors.status).json(errors)
})

module.exports = router;

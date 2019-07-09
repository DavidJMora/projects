const express = require('express');
const router = express.Router();

let productController = require('./controllers/productController');

let Product = require('./models/Product');

Product.createMapping(function(error, mapping) {
    if(error) {
        console.log('Error creating mapping');
        console.log(mapping);
    } else {
        console.log('Mapping created');
        console.log(mapping);
        
    }
})

let stream = Product.synchronize();
let count = 0;

stream.on('data', function() {
    count++
})

stream.on('close', function() {
    console.log(`indexed ${count} documents`);
})

stream.on('error', function(error) {
    console.log(error);
})

router.get('/', function(req, res) {
    res.send('product page')
})

router.post('/search', function(req, res) {
    res.redirect('/api/product/search?search=' + req.body.search)
})

router.get('/search', productController.productByQuery)



router.get('/getproductbycategoryid/:id', function(req, res) {
    productController.getProductByCategoryID(req.params.id)
        .then(products => {
            res.render('product/products', {
                products: products
            })
        })
        .catch(error => {
            res.status(error.status).json(error)
        })
})

router.post('/search', function(req, res) {
    res.redirect('product/search')
})

router.post('/instant-search', productController.instantSearch)

router.get('/:id', function(req, res) {
    
    productController.getProductById(req.params.id)
        .then(product => {            
            res.render('product/product', {
                product: product
            })
        })
        .catch(error => {
            res.status(error.status).json(error)
        })
})

module.exports = router
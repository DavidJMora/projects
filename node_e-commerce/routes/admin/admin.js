const express = require('express');
const router = express.Router();

let categoryController = require('./controllers/categoryController');
let createProductController = require('./controllers/createProductController');
let categoryValiation = require('./utils/categoryValidation');

router.get('/', function(req, res) {
    res.send('please')
})

router.get('/add-category', function(req, res) {
    res.render('product/add-category', {errors: req.flash('addCategoryError'),
success: req.flash("addCategorySuccess")})
})

router.post('/add-category', categoryValiation, function(req, res) {
    categoryController.newCategory(req.body)
    .then(category => {    
        
        req.flash('addCategorySuccess', `Added ${category.name}`);

        res.redirect('/api/admin/add-category')
    })
    .catch(error => {
        req.flash('addCategoryError', error.message)

        res.redirect('/api/admin/add-category')
    })
})

router.get('/get-all-categories', categoryController.getAllCategories);

router.get('/create-fake-product/:categoryName/:categoryID', createProductController.createProductByCategoryID)

module.exports = router;
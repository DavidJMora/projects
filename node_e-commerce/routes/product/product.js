const express = require('express');
const router = express.Router();

let Category = require('./models/Category');

router.get('/', function(req, res) {
    res.send('product page')
})

router.get('/admin/addcategory', function(req, res) {
    res.render('product/addcategory', {errors: req.flash('addCategoryError'),
success: req.flash("addCategorySuccess")})
})

router.post('/admin/addcategory', function(req, res) {
    let newCategory = new Category();

    newCategory.name = req.body.category;
    newCategory.save()
        .then(category => {
            req.flash('addCategorySuccess', 'Success!!!!');

            res.redirect('/api/admin/addcategory')
        })
        .catch(error => {
            req.flash('addCategoryError', error)

            res.redirect('/api/admin/addcategory')
        })

})

module.exports = router
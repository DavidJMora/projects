let express = require('express');
let router = express.Router();

let cartController = require('./controllers/cartController');

router.get('/', cartController.getUserShoppingCart);

router.post('/product', cartController.addProductToCart);

router.delete('/remove', function(req, res) {
    res.send('remove')
})

module.exports = router 
let express = require('express');
let router = express.Router();

let stripe = require('stripe')('sk_test_QuKElojw0xEwksL1XbOzX55N00TjCttn5s');
let async = require('async');
let Cart = require('./models/Cart');
let User = require('../users/models/User');

let cartController = require('./controllers/cartController');

router.get('/', cartController.getUserShoppingCart);

router.post('/product', cartController.addProductToCart);

router.delete('/remove', cartController.removeProduct);

router.post('/payment', function(req, res, next) {
    let stripeToken = req.body.stripeToken;
    let currentCharges = req.body.stripeMoney * 100;
    console.log(currentCharges);
    

    stripe.customers
        .create({
            source: stripeToken
        })
        .then(customer => {
            let results = stripe.charges.create({
                amount: currentCharges,
                currency: 'usd',
                customer: customer.id
            })

            return results
        })
        .then(results => {
            async.waterfall([
                (callback) => {
                    Cart.findOne({owner: req.user._id}, (error, cart) => {
                        callback(error, cart)
                    })
                }, (cart, callback) => {
                    User.findOne({_id: req.user._id}, (error, user) => {
                        if(user) {
                            for(let i = 0; i < cart.items.length; i++) {
                                user.history.push({
                                    item: cart.items[i].item,
                                    paid: cart.items[i].price
                                })
                            }

                            user.save((error, user) => {
                                if(error) {
                                    return next(error)
                                } else {
                                    callback(error, user)
                                }
                            })
                        }
                    })
                }, 
                (user) => {
                    Cart.update({
                        owner: req.user._id
                    }, {
                        $set: {
                            items: [],
                            total: 0
                        }
                    }, (error, updated) => {
                        if(updated) {
                            res.render('cart/thanks')
                        }
                    })
                }
            ])
        })
        .catch((error => {
            let errors = {};

            errors.status = 500;
            errors.messge = error;

            res.json(errors)
        }))
})

module.exports = router 
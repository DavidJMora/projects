const express = require('express');
const router = express.Router();
const passport = require('passport');


let userController = require('../users/controllers/userController');
let cartController = require('../cart/controllers/cartController');
let signupValidation = require('./utils/signupValidation');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', signupValidation, function(req, res, next) {
  if(req.isAuthenticated()) {
    return res.redirect('/')
  }

  res.render('auth/signup', {errors: req.flash('errors'), error_msg: null})
})

router.post('/signup', signupValidation, userController.signup, cartController.createUserCart)

router.get('/logout', function(req, res) {
  req.logout()
    
  res.redirect('/')
    
})

router.get('/signin', function(req, res) {
  if(req.isAuthenticated()) {
    res.redirect('/');
  }
  res.render('auth/signin', {errors: req.flash('loginMessage')})
  })

router.post('/signin', passport.authenticate('local-login', {
  successRedirect: "/",
  failureRedirect: '/api/users/signin',
  failureFlash: true
}))

router.get('/edit-profile', function(req, res) {
  if(!req.isAuthenticated()) {
    return res.redirect('/api/users/signin')
  }

  res.render('account/profile', {errors: req.flash('errors'), success: req.flash('success')})
})

router.put('/edit-profile', function(req, res) {
  userController.updateUser(req.body, req.user.id)
    .then(user => {
      req.flash('success', "Successfully updated profile")

      res.redirect('/api/users/edit-profile')
    })
    .catch(error => {
      req.flash('errors', error);

      res.redirect('/api/users/edit-profile')
    })
})




module.exports = router;

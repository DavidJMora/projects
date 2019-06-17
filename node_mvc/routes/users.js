const express = require('express');
const router = express.Router();
const isLoggedIn = require('../utils/isLoggedIn');
const authChecker = require('../utils/authChecker')
const bcrypt = require('bcryptjs')

let User = require("../models/User")

let signupController = require("../controllers/signupController");
let userController = require('../controllers/userController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  userController.findAllUsers({}, (err, users) => {
    if(err) {
      res.status(400).json({
        confirmation: "failure",
        message: err
      })
    } else {
      res.json({
        confirmation: 'success',
        payload: users
      })
    }
  })
});

router.put('/updateuserbyid/:id', function(req, res) {
  User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(error, updatedUser) {
    if(error) {
      res.status(400).json({
        confirmation: "failure",
        message: error
      })
    } else {
      res.json({
        confirmation: "success",
        payload: updatedUser
      })
    }
  })
})

router.delete('/deleteuserbyid/:id', function(req, res) {
  User.findByIdAndDelete(req.params.id, req.body, function(error, deletedUser) {
    if(error) {
      res.status(400).json({
        confirmation: "failure",
        message: error
      })
    } else {
      res.json({
        confirmation: "success",
        payload: deletedUser
      })
    }
  })
})

router.get('/register', function(req, res, next) {
  res.render('register', {'error_msg': false})
})

router.post('/register', authChecker, signupController.checkExistingEmail, signupController.checkUsername, signupController.createUser)

router.get('/login', function(req, res, next) {
  res.render('login', {error_msg: false, success_msg: false} )
})

router.post('/login', function(req, res) {
  User.findOne({email: req.body.email}, function(error, user) {
    if(error) {
      res.render('login', {error_msg: true, errors: [{message: "Email or Password does not match."}]})
    }
    if(user) {
      bcrypt.compare(req.body.password, user.password, function(error, result) {
        if(error) {
          res.render('login', {error_msg: true, errors: [{message:'Email or Password does not match'}]})
        } else {
          if(result) {
            res.render('login', {error_msg: false, success_msg: "You are logged in"})
          } else {
            res.render('login', {error_msg: true, success_msg: false, errors: [{message: 'Email or Password does not match'}]})
          }
        } 
      })
    } else {
      res.render('login', {error_msg: true, success_msg: false, errors: [{message:'Email or Password does not match'}]})
    }
  })
})

module.exports = router;

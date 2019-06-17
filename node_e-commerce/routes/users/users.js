const express = require('express');
const router = express.Router();


let userController = require('../users/controllers/userController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', function(req, res, next) {
  res.render('auth/signup', {errors: req.flash('errors')})
})

router.post('/signup', function(req, res, next) {
  userController.signup(req.body)
    .then(user => {
      res.redirect('/')
    })
    .catch(error => {
      console.log(error);
      // create flash message
      req.flash('errors', error.message)

      return res.redirect(301, '/api/users/signup')
    })
})

router.get('/test', function(req, res) {
  res.send('test worked')
})
module.exports = router;

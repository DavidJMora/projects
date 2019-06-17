const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = {
    checkExistingEmail: (req, res, next) => {
        User.findOne({email: req.body.email}, function(error, user) {
            if(error) {
                res.status(400).json({
                    confirmation: "failure",
                    message: error
                })
            }

            // if(user) {
            //     res.status(409).json({
            //         //Conflict response status code indicates a request conflict with current state of the server
            //         confirmation: "failure",
            //         message: 'Email already taken.'
            //     })
            // } 
            if(user){
                res.render('register', {error_msg: true, errors: [{message: "Email already taken"}]})
            } else {
                next()

                return
            }
        })
    },
    checkUsername: (req, res, next) => {
        User.findOne({username: req.body.username}, function(error, user) {
            if(error) {
                res.status(400).json({
                    confirmation: "failure",
                    message: error
                })
            }

            // if(user) {
            //     res.status(409).json({
            //         //Conflict response status code indicates a request conflict with current state of the server
            //         confirmation: "failure",
            //         message: 'Username already taken'
            //     })
            // } 
            if(user) {
                res.render('register', {error_msg: true, errors: [{message: "Username already taken"}]})
            } else {
                next()

                return

            }
        })
    },
    createUser: (req, res) => {
        bcrypt.genSalt(10, function(error, salt) {
            if(error) {
                res.status(400).json({
                    confirmation: 'failure',
                    message: error
                })
            }

            bcrypt.hash(req.body.password, salt, function(error, hash) {
                if(error) {
                    res.status(400).json({
                        confirmation: 'Failure',
                        message: error
                    })
                } else {
                    let newUser = new User({
                        first_name: req.body.firstName,
                        last_name: req.body.lastName,
                        username: req.body.username,
                        email: req.body.email,
                        password: hash
                    })

                    newUser.save(function(error, user) {
                        if(error) {
                            res.status(400).json({
                                confirmation: 'failure',
                                message: error
                            })
                        } else {
                            res.json({
                                confirmation: "success",
                                payload: user
                            })
                        }
                    })
                }
            })
        })
    }
}
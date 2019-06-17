const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = {
    signup: function(params) {
        return new Promise((resolve, reject) => {
            User.findOne({email: params.email})
                .then(user => {
                    if(user) {
                        let errors = {}
                        errors.message = "Email exists";
                        errors.status = 400;

                        reject(errors)
                    } else {
                        const newUser = new User;

                        newUser.profile.name = params.name;
                        newUser.password = params.password;
                        newUser.email = params.email;

                        

                        bcrypt.genSalt(10, (error, salt) => {
                            if(salt) {
                                bcrypt.hash(newUser.password, salt, (error, hash) => {
                                    if(error) {
                                        reject(error)
                                    } else {
                                        newUser.password = hash;

                                        newUser.save()
                                            .then(user => resolve(user))
                                            .catch(error => reject(error))
                                    }
                                })
                            }
                        })
                    }
                })
        })
    }
}
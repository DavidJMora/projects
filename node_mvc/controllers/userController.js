const User = require('../models/User');

module.exports = {
    findAllUsers: (params, callback) => {
        User.find(params, (error, users) => {
            if(error) {
                callback(error, null)
            } else {
                callback(null, users)
            }
        })
    }
}
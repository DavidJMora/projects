const mongoose = require('mongoose');
const moment = require('moment');

let UserSchema = new mongoose.Schema({
    first_name: {type: String, default: ''},
    last_name: {type: String, default: ''},
    username: {type: String, default: ''},
    email: {type: String, default: ''},
    password: {type: String, default: ''},
    timestamp: {type: String, default: () => moment().format("dddd, MMMM Do YYYY, kk:mm:ss")},
})

module.exports = mongoose.model('user', UserSchema)
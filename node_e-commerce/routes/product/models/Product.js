let mongoose = require('mongoose')

let ProductSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    name: { type: String, default: '' },
    price: { type: String, default: '' },
    image: { type: String, default: '' }
})

module.exports = mongoose.model('product', ProductSchema) 
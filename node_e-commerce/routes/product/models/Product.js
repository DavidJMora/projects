let mongoosastic = require('mongoosastic');
let mongoose = require('mongoose');

let ProductSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        es_type: "nested",
        es_include_in_parent: true
    },
    name: { type: String, es_type: "text", default: '' },
    price: { type: Number, es_type: "long", default: 0 },
    image: { type: String, es_type: "text", default: '' }
})

ProductSchema.plugin(mongoosastic, {
    hosts: [
        process.env.ELASTIC_SEARCH_URI
        // /**"localhost:9200"*/ "https://4twn296mg8:psui0pazgu@apricot-232435678.us-east-1.bonsaisearch.net:443"
    ],
    populate: [
        {
            path: "category"
        }
    ]
})

module.exports = mongoose.model('product', ProductSchema) 
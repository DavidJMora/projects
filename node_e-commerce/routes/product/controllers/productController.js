let Product = require('../models/Product')
let paginate = require('../utils/pagination');

module.exports = {
    getAllProducts: (params) => {

        return new Promise((resolve, reject) => {
            Product.find(params)
                .then(products => {
                    resolve(products)
                })
                .catch(error => {
                    let errors = {};

                    errors.status = 500;
                    errors.message = error;

                    reject(errors)
                })
        })
    },
    getProductById: (id) => {
        return new Promise((resolve, reject) => {
            Product.findById(id)
                .then(product => {
                    resolve(product)
                })
                .catch(error => {
                    let errors = {};

                    errors.status = 500;
                    errors.message = error;

                    reject(errors)
                })
        })
    },
    getProductByCategoryID: (id) => {
        return new Promise((resolve, reject) => {
            Product.find({category: id})
                .populate('category')
                .exec()
                .then(products => {
                    resolve(products)
                })
                .catch(error => {
                    let errors = {};

                    errors.status = 500;
                    errors.message = error;

                    reject(errors)
                })
        })
    },
    getPageIfUserLoggedIn: (req, res, next) => {
        if(req.user) {
            paginate(req, res, next)
        } else {
            res.render('index')
        }
    }, 
    productByQuery: (req, res) => {
        if(req.query.search) {
            Product.search({
                query_string: {
                    query: req.query.search
                }
            }, (error, results) => {
                if(error) {
                    let errors = {};

                    errors.status = 500;
                    errors.message = error;

                    res.status(errors.status).json(errors)
                } else {
                    let data = results.hits.hits;
                    
                    res.render('search/search-results', {
                        results: data,
                        query: req.query.search,
                    })
                }
            })
        }
    }
}
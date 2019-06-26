let Product = require('../models/Product')

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
    getProductById: (params) => {
        return new Promise((resolve, reject) => {
            
        })
    }
}
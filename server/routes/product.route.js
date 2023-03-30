var router = require('express').Router();

const product = require('../controllers/product.controller');

//router logic for all the products
router.route('/products')
    .get(product.getAllProducts)
    .post(product.addProduct)

router.route('/products/search')
    .post(product.searchProducts)

//router logic for single product
router.route('/product/:productId')
    .get(product.getProductById)
    .put(product.updateProduct)

module.exports = router;
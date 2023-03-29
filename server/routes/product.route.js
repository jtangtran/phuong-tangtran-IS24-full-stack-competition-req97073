var router = require('express').Router();

const product = require('../controllers/product.controller');

router.route('/products')
    .get(product.getAllProducts)

//router logic for single product
router.route('/product/:productId')
    .get(product.getProductById)
    // .delete()

module.exports = router;
var fakerator = require("fakerator")('en-CA');
const moment = require('moment');

var products = [];

//generates mock data for the products array
const generateProductData = async() => {
    try {
        return {
            productId: fakerator.misc.uuid(),
            productName: fakerator.address.streetName(),
            productOwnerName: `${fakerator.names.firstName()} ${fakerator.names.lastName()}`,
            Developers: fakerator.times(fakerator.names.name, fakerator.random.number(1,5)),
            scrumMasterName: `${fakerator.names.firstName()} ${fakerator.names.lastName()}`,
            startDate: moment(fakerator.date.past()).format('YYYY/MM/DD'),
            methodology: fakerator.random.arrayElement(['Waterfall', 'Spiral', 'Rapid Application Development', 'Rational Unified Process', 'Agile']),
        };
    } catch (e) {
        console.error(e);
    }
}

//initializes the products array
const initializeProducts = async(req, res) => {
    try {
        Array.from({ length: 2}).forEach(() => {
            products.push(generateProductData());
        });
        products = await Promise.all(products);
    } catch (e) {
        console.error(e.message);
    }
}

/**
 * @swagger
 * /api/products: 
 *  get:
 *      summary: Used to return all products
 *      tags: [Products]
 *      responses:
 *          200:
 *              description: Successfully returned all products.
 *          400:
 *              description: Bad Request. Unable to retrieve all products.
 *  
*/
//returns all the products
const getAllProducts = async(req,res) => {
    try {
        res.status(200).json(products);
    } catch (e) {
        console.error(e.message);
        res.status(400).send('Bad Request. Unable to retrieve all products.');
    }
}

/**
 * @swagger
 * /api/product/{productId}:
 *  get:
 *      summary: Get product data based on productId
 *      tags: [Products]
 *      parameters:
 *        - in: path
 *          name: productId
 *          schema:
 *              type: string
 *          required: true
 *          description: Product id
 *      responses:
 *          200:
 *              description: The product data associated with the product id.
 *          404:
 *              description: Product was not found.
 */
//returns specific product based on productId
const getProductById = async(req, res) => {
    try {
        res.status(200).json(products.filter(product => product.productId == req.params.productId));
    } catch (e) {
        console.error(e.message);
        res.status(404).send('Product was not found.');
    }
}

const deleteProductById = async(req, res) => {

}

module.exports = {
    getAllProducts,
    getProductById,
    initializeProducts,
    deleteProductById
}
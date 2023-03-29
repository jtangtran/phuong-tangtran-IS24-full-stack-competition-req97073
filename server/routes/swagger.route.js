const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition : {
        openapi: '3.0.0',
        info: {
            title:  'Products API',
            version: '1.0.0',
            description: 'citz-imb-full-stack-code-challenge-req97073'
        },
        servers : [
            {
                url: 'http://localhost:3000'
            }
        ]
    },
    apis: ["../server/controllers/product.controller.js"]
};

const swaggerSpec = swaggerJSDoc(options);

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;
const express = require('express');
const app = express();
const cors = require('cors');
const path = require("path");

const PORT = 3000;

const productRoute = require('./routes/product.route');
const swaggerRoute = require('./routes/swagger.route');

app.use(cors());
app.use(express.json());
app.use('/api', [productRoute, swaggerRoute] );

//catch all method
//reroutes the user to the main page if the user enters an invalid route
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/list-products.component.html"));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
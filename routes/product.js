const productsController = require('../controllers/product');

const productsRouter = require('express').Router();

productsRouter
    .route('/')
    .get(productsController.getProducts)
    .post(productsController.createProduct);

productsRouter
    .route('/:id')
    .get(productsController.getOneProduct)
    .put(productsController.updateProduct)
    .delete(productsController.deleteProduct);

module.exports = productsRouter;

// /products

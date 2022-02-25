const productsController = require('../controllers/product');
const auth = require('../middlewares/auth');

const productsRouter = require('express').Router();

productsRouter
    .route('/')
    .get(productsController.getProducts)
    .post(auth.checkUserType('admin'), productsController.createProduct);

productsRouter
    .route('/:id')
    .get(productsController.getOneProduct)
    .put(auth.checkUserType('admin'), productsController.updateProduct)
    .delete(auth.checkUserType('admin'), productsController.deleteProduct);

module.exports = productsRouter;

// /products

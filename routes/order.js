const ordersController = require('../controllers/order');
const auth = require('../middlewares/auth');

const ordersRouter = require('express').Router();

ordersRouter
    .route('/')
    .get(ordersController.getOrders)
    .post(auth.checkToken, ordersController.createOrder);

// ordersRouter
//     .route('/:id')
//     .get(ordersController.getOneProduct)
//     .put(auth.checkUserType('admin'), ordersController.updateProduct)
//     .delete(auth.checkUserType('admin'), ordersController.deleteProduct);

module.exports = ordersRouter;

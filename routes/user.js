const usersController = require('../controllers/user');

const usersRouter = require('express').Router();

usersRouter.route('/register').post(usersController.register);
usersRouter.route('/login').post(usersController.login);

module.exports = usersRouter;

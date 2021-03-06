const express = require('express');
const Logger = require('./config/logger');
const morganMiddleware = require('./config/morganMiddleware');
const middlewares = require('./middlewares');
const auth = require('./middlewares/auth');
const productsRouter = require('./routes/product');
const usersRouter = require('./routes/user');
const ordersRouter = require('./routes/order');
const app = express();

// 200 - ok, 201 - created
// 400 - bad request, 401 - unauthorized, 403 - forbidden, 404 - not found
// 500 - internal server error

app.use(express.json()); // parse req.body
app.use(morganMiddleware); // configure morgan logger

app.get('/', (req, res) => {
    res.send('Hello World');
});

// const simpleMiddleware = (req, res, next) => {
//     console.log(req.method);
//     console.log(res.headers);
//     next();
// };
app.use(
    '/products',
    auth.checkToken,
    // auth.checkUserType('admin') /* (req, res, next) => {} */,
    productsRouter
);
app.use('/users', /*simpleMiddleware,*/ usersRouter);
app.use('/orders', ordersRouter);

// error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.log(err);
    Logger.error(err.message);
    res.status(err.statusCode || 500).json({ message: err.message });
});

app.use('*', middlewares.notFound);

const PORT = process.env.APP_PORT;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

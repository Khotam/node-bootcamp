const express = require('express');
const productsRouter = require('./routes/product');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/products', productsRouter);
// app.route('/products', (req, res) => {});

const PORT = 4000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// controller route

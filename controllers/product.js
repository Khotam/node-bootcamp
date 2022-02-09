const pgClient = require('../db/index');
const { v4: uuidv4 } = require('uuid');

const productsController = {
    getProducts: async (req, res) => {
        try {
            await pgClient.connect();
            const result = await pgClient.query(`SELECT * from product;`);
            const products = result.rows;
            res.status(200).json({ data: products });
        } catch (error) {
            console.log('Error :>> ', error);
            res.status(500).json({ error: error.message });
        } finally {
            await pgClient.end();
        }
    },
    createProduct: async (req, res) => {
        try {
            const { title, price } = req.body;
            const uuid = uuidv4();

            const values = [uuid, title, price];

            await pgClient.connect();
            const result = await pgClient.query(
                'INSERT INTO products (id, title, price) VALUES ($1, $2, $3) RETURNING *;',
                values
            );
            const product = result.rows[0];
            res.status(201).json({ data: product });
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message });
        } finally {
            await pgClient.end();
        }
    },
    getOneProduct: (req, res) => {
        const { id } = req.params;
        res.status(200).json({ data: `get one product ${id}` });
    },
    deleteProduct: (req, res) => {
        const { id } = req.params;
        res.status(200).json({ data: `delete product ${id}` });
    },
    updateProduct: (req, res) => {
        const { id } = req.params;
        res.status(200).json({ data: `update product ${id}` });
    },
};

module.exports = productsController;

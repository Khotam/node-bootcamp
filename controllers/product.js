const { v4: uuidv4 } = require('uuid');
const Logger = require('../config/logger');
const Database = require('../db');
const AppError = require('../utils/AppError');

const productsController = {
    getProducts: async (req, res, next) => {
        try {
            const pgClient = Database.getClient();
            await Database.connect();
            const result = await pgClient.query(`SELECT * from products;`);
            const products = result.rows;
            Logger.info(`Products length ${products.length}`);
            res.status(200).json({ data: products });
        } catch (error) {
            next(error);
        } finally {
            await Database.end();
        }
    },
    createProduct: async (req, res, next) => {
        try {
            const { title, price } = req.body;
            const uuid = uuidv4();

            const values = [uuid, title, price];

            const pgClient = Database.getClient();
            await Database.connect();
            const result = await pgClient.query(
                'INSERT INTO products (id, title, price) VALUES ($1, $2, $3) RETURNING *;',
                values
            );
            const product = result.rows[0];
            res.status(201).json({ data: product });
        } catch (error) {
            next(error);
        } finally {
            await Database.end();
        }
    },
    getOneProduct: async (req, res, next) => {
        try {
            const { id } = req.params;

            const pgClient = Database.getClient();
            await Database.connect();
            Logger.info('Connected to db');
            const result = await pgClient.query(
                `SELECT * from products WHERE id = $1;`,
                [id]
            );
            Logger.info('Got products list');

            const product = result.rows[0];
            Logger.info('Got products');

            if (!product) {
                Error();
                const err = new AppError(400, `Not found with id ${id}`);
                return next(err);
            }
            Logger.info('REsponse sent to client');

            res.status(200).json({ data: product });
        } catch (error) {
            next(error);
        } finally {
            await Database.end();
        }
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

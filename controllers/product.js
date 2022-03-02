const { v4: uuidv4 } = require('uuid');
const Logger = require('../config/logger');
const Database = require('../db');
const AppError = require('../utils/AppError');

const mapToProductWithUser = (product) => {
    return {
        id: product.id,
        title: product.title,
        price: product.price,
        creator: {
            id: product.user_id,
            username: product.username,
            email: product.email,
            type: product.type,
        },
    };
};

const productsController = {
    getProducts: async (req, res, next) => {
        try {
            const pgClient = Database.getClient();
            await Database.connect();
            const result = await pgClient.query(
                `SELECT p.id, p.title, p.price, u.id AS "user_id", u.username, u.email, u.type from products p JOIN users u ON p.creator_id = u.id;`
            );
            const products = result.rows;
            const prods = products.map(mapToProductWithUser);
            Logger.info(`Products length ${products.length}`);
            res.status(200).json({ data: prods });
        } catch (error) {
            next(error);
        } finally {
            await Database.end();
        }
    },
    createProduct: async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { title, price } = req.body;
            const uuid = uuidv4();

            const values = [uuid, title, price, userId];

            const pgClient = Database.getClient();
            await Database.connect();
            const result = await pgClient.query(
                'INSERT INTO products (id, title, price, creator_id) VALUES ($1, $2, $3, $4) RETURNING *;',
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

const Database = require('../db');
const { v4: uuidv4 } = require('uuid');

const ordersController = {
    getOrders: async (req, res, next) => {
        // Should display courier name
        try {
            const pgClient = Database.getClient();
            await Database.connect();
            // join order, products, order_products, users

            const selectOrdersQuery = `SELECT o.id, o.status, u.username, u.email,
                array_agg(row_to_json(p)) as products 
                FROM orders o JOIN order_products ops ON ops.order_id = o.id
                JOIN products p ON ops.product_id = p.id
                JOIN users u ON o.customer_id = u.id
                GROUP BY o.id, u.id;`;

            const result = await pgClient.query(selectOrdersQuery);
            const orders = result.rows;
            res.status(200).json({ orders });
        } catch (error) {
            next(error);
        } finally {
            await Database.end();
        }
    },
    createOrder: async (req, res, next) => {
        const pgClient = Database.getClient();

        try {
            const { product_ids } = req.body;
            const { userId } = req.user;

            await Database.connect();

            const orderId = uuidv4();
            await pgClient.query('BEGIN');
            const orderQueryText =
                'INSERT INTO orders (id, customer_id) VALUES ($1, $2);';
            const orderParameters = [orderId, userId];
            await pgClient.query(orderQueryText, orderParameters);

            let orderProductsQueryText =
                'INSERT INTO order_products (order_id, product_id) VALUES ';

            for (const id of product_ids) {
                orderProductsQueryText += `('${orderId}', '${id}'),`;
            }

            orderProductsQueryText = orderProductsQueryText.slice(
                0,
                orderProductsQueryText.length - 1
            );

            await pgClient.query(orderProductsQueryText);

            await pgClient.query('COMMIT');

            res.status(200).json({ order: orderId });
        } catch (error) {
            await pgClient.query('ROLLBACK');
            next(error);
        } finally {
            await Database.end();
        }
    },
    assignOrderToCourier: async (req, res, next) => {
        // 1. Assign courier to the order
        // 2. Change order status from 'new' to 'delivering'
    },
    finishOrder: async (req, res, next) => {
        // 1. Change order status from 'delivering' to 'finished'
    },
};

module.exports = ordersController;

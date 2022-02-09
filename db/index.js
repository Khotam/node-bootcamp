const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'deliverydb',
    port: 5432,
});

module.exports = client;

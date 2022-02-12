const { Client } = require('pg');
require('dotenv').config();

const { PG_HOST, PG_USER, PG_PASSWORD, PG_DATABASE, PG_PORT } = process.env;

const dbOptions = {
    host: PG_HOST,
    user: PG_USER,
    password: PG_PASSWORD,
    database: PG_DATABASE,
    port: PG_PORT,
};
class Database {
    static client;

    static getClient() {
        Database.client = new Client(dbOptions);
        return Database.client;
    }

    // getClient() {}

    static async connect() {
        await Database.client.connect();
    }

    static async end() {
        await Database.client.end();
    }
}

// const db = new Database();
// db.getClient();
module.exports = Database;
// Database.getClient()

// module.exports = client;

'use strict'
const hanaClient = require('@sap/hana-client');

const db = {
    connection: hanaClient.createConnection(),
    config: {
        host: process.env.HDB_HOST,
        port: process.env.HDB_PORT,
        user: process.env.HDB_USER,
        password: process.env.HDB_PASSWORD
    }
}
const middleware = (req, res, next) => {
    req.db = db;
    next();
};

module.exports = middleware;
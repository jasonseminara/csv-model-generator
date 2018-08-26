/**
 * @module dbConfig
 * @desc this file contains all the connection strings
 * to connect to the database server
 */

// Our database is either at some URL,
// or configured at some host:port
// TODO: [1] Export your database config
module.exports = {
  host:     process.env.DB_HOST || 'localhost',
  port:     process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'dummy_dev',
};

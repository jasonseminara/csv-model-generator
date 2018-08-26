/**
 * @module connection
 * @desc this file exports a connection to the database
 */

const pgp = require('pg-promise')({
  capSQL: true,
  query(q) {
    console.log(q.query);
  },
});

const dbConfig = require('./dbConfig');

// execute pgp with our db config, so a connection is made.
// @see https://github.com/vitaly-t/pg-promise#query-result-mask
module.exports = {
  db:      pgp(dbConfig),
  helpers: pgp.helpers,
};

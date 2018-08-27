/**
 * This is an example of your user model.
 * regardless of how you describe your model,
 * Provide a method called fake and the package will
 * use the method to build out the csv
 */

/**
 * @module User
 * @desc this module is the interface for the database. It contains
 * CRUD methods in SQL to talk to the database.
 * Each function returns a promise
 */

const bcrypt = require('bcryptjs');
const faker  = require('faker');
const { db, helpers } = require('../config/dbConnection');


// describe the database fields so the helper can generate SQL for us
const cs = new helpers.ColumnSet([
  'username',
  'password',
  'email',
  'firstname',
  'lastname',
  'avatar',
], {
  table: 'users',
});


module.exports = class User {
  /**
   * @method fake
   * @returns {object} with:
   *   keys that map directly to the db columns;
   *   values as function names to faker
   * @note the keys MUST match the db columns exactly
   * @note the values MUST be executable
   */
  static fake() {
    return {
      firstname: faker.name.firstName,
      lastname:  faker.name.lastName,
      username:  faker.internet.userName,
      email:     faker.internet.email,
      avatar:    faker.internet.avatar,
      password:  faker.lorem.word,
    };
  }

  /**
   * @method insertBatch
   * @param {user[]} an array of users to insert using a transaction
   * @return {user[]} an array of successfully inserted users
   */
  static async insertBatch(users = []) {
    try {
      // first lets hash all the passwords
      // wrap each user in a promise and wait for the bcrypt to resolve
      // before returning all the promises
      const hashedUsers = Promise.all(users.map(async user => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      })));


      // set up a transaction to record all the new users
      return db.tx(async (t) => {
        // use helpers.insert to generate the SQL insert stmt
        const insert = helpers.insert(await hashedUsers, cs);
        // insert records
        return t.many(`${insert} RETURNING *`);
      })
        .catch(console.error);
    } catch (e) {
      console.error(e);
      return false;
    }
  }
};

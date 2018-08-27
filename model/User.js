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
  'password_digest',
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
  static async register(userList=[]) {
    // users are either going to be one or a collection, always make it many
    const users = userList.map ? userList : [userList];

    try {
      /**
       * first lets hash all the passwords
       * wrap each user in a promise and wait for the bcrypt to resolve
       * before returning all the promises
       * note here, that we're destructuring the password from the user
       * for two reasons:
       * 1. we'll be replacing the field with password_digest
       * 2. we NEVER want the cleartext password to go to the DB and
       *   get recorded in the log
       */
      const hashedUsers = Promise.all(users.map(async ({ password, ...user }) => ({
        ...user,
        password_digest: await bcrypt.hash(password, 10),
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
